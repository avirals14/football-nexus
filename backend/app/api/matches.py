from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.match import Match
from app.models.content_item import ContentItem
from app.schemas.match import MatchOut, MatchDetailOut, MatchListOut, OverallSentiment

router = APIRouter()


def _mood_label(positive_pct: float, negative_pct: float) -> str:
    if positive_pct >= 75:
        return "Highly Positive"
    if positive_pct >= 55:
        return "Positive"
    if negative_pct >= 75:
        return "Highly Negative"
    if negative_pct >= 55:
        return "Negative"
    return "Mixed"


@router.get("/matches", response_model=MatchListOut)
async def list_matches(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Match).order_by(Match.match_date.desc()))
    matches = result.scalars().all()

    out: list[MatchOut] = []
    for m in matches:
        # Count content items for this match
        count_q = select(func.count()).where(ContentItem.match_id == m.id)
        count_result = await db.execute(count_q)
        total = count_result.scalar() or 0

        out.append(
            MatchOut(
                id=m.id,
                home_team=m.home_team,
                away_team=m.away_team,
                home_flag=m.home_flag,
                away_flag=m.away_flag,
                competition=m.competition,
                match_date=m.match_date,
                status=m.status,
                total_content_items=total,
            )
        )

    return MatchListOut(matches=out)


@router.get("/matches/{match_id}", response_model=MatchDetailOut)
async def get_match(match_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Match).where(Match.id == match_id))
    match = result.scalar_one_or_none()
    if not match:
        raise HTTPException(status_code=404, detail={"code": "MATCH_NOT_FOUND", "message": f"No match found with ID {match_id}"})

    # Compute overall sentiment from content items
    items_q = select(ContentItem).where(
        ContentItem.match_id == match_id,
        ContentItem.sentiment.is_not(None),
    )
    items_result = await db.execute(items_q)
    items = items_result.scalars().all()

    total = len(items)
    if total > 0:
        pos = sum(1 for i in items if i.sentiment == "positive")
        neg = sum(1 for i in items if i.sentiment == "negative")
        neu = total - pos - neg
        pos_pct = round(pos / total * 100, 1)
        neg_pct = round(neg / total * 100, 1)
        neu_pct = round(neu / total * 100, 1)
    else:
        pos_pct = neg_pct = neu_pct = 0.0

    return MatchDetailOut(
        match=MatchOut(
            id=match.id,
            home_team=match.home_team,
            away_team=match.away_team,
            home_flag=match.home_flag,
            away_flag=match.away_flag,
            competition=match.competition,
            match_date=match.match_date,
            status=match.status,
            total_content_items=total,
        ),
        overall_sentiment=OverallSentiment(
            positive_pct=pos_pct,
            neutral_pct=neu_pct,
            negative_pct=neg_pct,
            total_items=total,
            mood_label=_mood_label(pos_pct, neg_pct),
        ),
    )
