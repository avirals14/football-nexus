from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func, and_, case
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.match import Match
from app.models.aggregated_metric import AggregatedMetric
from app.models.content_item import ContentItem
from app.models.entity import Entity
from app.schemas.sentiment import SentimentOut, TimelinePoint, TeamSentiment, PlayerMention

router = APIRouter()


@router.get("/sentiment/{match_id}", response_model=SentimentOut)
async def get_sentiment(
    match_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    # Verify match exists
    match_result = await db.execute(select(Match).where(Match.id == match_id))
    match = match_result.scalar_one_or_none()
    if not match:
        raise HTTPException(status_code=404, detail={"code": "MATCH_NOT_FOUND", "message": f"No match found with ID {match_id}"})

    # 1. Timeline from aggregated_metrics
    agg_q = (
        select(AggregatedMetric)
        .where(AggregatedMetric.match_id == match_id, AggregatedMetric.team.is_(None))
        .order_by(AggregatedMetric.window_start.asc())
    )
    agg_result = await db.execute(agg_q)
    agg_rows = agg_result.scalars().all()

    timeline = [
        TimelinePoint(
            window_start=row.window_start,
            window_end=row.window_end,
            positive_pct=row.positive_pct,
            negative_pct=round(row.negative_count / row.total_items * 100, 1) if row.total_items else 0,
            neutral_pct=round(row.neutral_count / row.total_items * 100, 1) if row.total_items else 0,
            total_items=row.total_items,
        )
        for row in agg_rows
    ]

    # 2. Team-level sentiment
    teams: dict[str, TeamSentiment] = {}
    for team_name in [match.home_team, match.away_team]:
        team_items_q = select(ContentItem).where(
            and_(
                ContentItem.match_id == match_id,
                ContentItem.sentiment.is_not(None),
            )
        )
        team_items_result = await db.execute(team_items_q)
        team_items = team_items_result.scalars().all()

        # Filter to items mentioning this team
        team_lower = team_name.lower()
        team_specific = [it for it in team_items if team_lower in it.text.lower()]
        total = len(team_specific)

        if total > 0:
            pos = sum(1 for i in team_specific if i.sentiment == "positive")
            neg = sum(1 for i in team_specific if i.sentiment == "negative")
            neu = total - pos - neg
            teams[team_name] = TeamSentiment(
                positive_pct=round(pos / total * 100, 1),
                negative_pct=round(neg / total * 100, 1),
                neutral_pct=round(neu / total * 100, 1),
                total_items=total,
            )
        else:
            teams[team_name] = TeamSentiment(
                positive_pct=0, negative_pct=0, neutral_pct=0, total_items=0
            )

    # 3. Top players from entities table
    player_q = (
        select(
            Entity.entity_name,
            func.count().label("mentions"),
        )
        .join(ContentItem, Entity.content_item_id == ContentItem.id)
        .where(
            and_(
                ContentItem.match_id == match_id,
                Entity.entity_type == "player",
            )
        )
        .group_by(Entity.entity_name)
        .order_by(func.count().desc())
        .limit(10)
    )
    player_result = await db.execute(player_q)
    top_players = [
        PlayerMention(name=row.entity_name, mentions=row.mentions)
        for row in player_result.all()
    ]

    # 4. Top keywords — gather from latest aggregated metrics
    keywords: list[str] = []
    if agg_rows:
        latest = agg_rows[-1]
        if latest.top_keywords and isinstance(latest.top_keywords, list):
            keywords = latest.top_keywords[:10]

    return SentimentOut(
        timeline=timeline,
        teams=teams,
        top_players=top_players,
        top_keywords=keywords,
    )
