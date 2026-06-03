"""Aggregates content sentiment into 5-minute time windows."""

from __future__ import annotations

import logging
import uuid
from collections import Counter
from datetime import datetime, timedelta, timezone

from sqlalchemy import select, func, and_
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.content_item import ContentItem
from app.models.entity import Entity
from app.models.aggregated_metric import AggregatedMetric

logger = logging.getLogger(__name__)

WINDOW_MINUTES = 5


async def run_aggregation(db: AsyncSession, match_id: uuid.UUID | None = None):
    """Compute aggregated metrics for recent time windows.

    Processes the last hour of data in 5-minute windows.
    Uses upsert so it's safe to run repeatedly.
    """
    now = datetime.now(timezone.utc)
    # Round down to nearest 5 minutes
    current_window_start = now.replace(
        minute=(now.minute // WINDOW_MINUTES) * WINDOW_MINUTES,
        second=0,
        microsecond=0,
    )
    # Process the last 12 windows (1 hour)
    windows_to_process = 12

    for i in range(windows_to_process):
        w_start = current_window_start - timedelta(minutes=WINDOW_MINUTES * i)
        w_end = w_start + timedelta(minutes=WINDOW_MINUTES)

        # Query content items in this window
        query = (
            select(ContentItem)
            .where(
                and_(
                    ContentItem.analyzed_at.is_not(None),
                    ContentItem.published_at >= w_start,
                    ContentItem.published_at < w_end,
                )
            )
        )
        if match_id:
            query = query.where(ContentItem.match_id == match_id)

        result = await db.execute(query)
        items = result.scalars().all()

        if not items:
            continue

        # Count sentiments
        positive = sum(1 for it in items if it.sentiment == "positive")
        negative = sum(1 for it in items if it.sentiment == "negative")
        neutral = sum(1 for it in items if it.sentiment == "neutral")
        total = len(items)

        # Aggregate keywords
        all_kw: list[str] = []
        for it in items:
            if it.keywords and isinstance(it.keywords, list):
                all_kw.extend(it.keywords)
        top_kw = [kw for kw, _ in Counter(all_kw).most_common(10)]

        # Aggregate entities — query from entities table
        item_ids = [it.id for it in items]
        ent_query = select(Entity).where(Entity.content_item_id.in_(item_ids))
        ent_result = await db.execute(ent_query)
        all_entities = ent_result.scalars().all()

        entity_counter: dict[str, dict] = {}
        for ent in all_entities:
            key = ent.entity_name
            if key not in entity_counter:
                entity_counter[key] = {"name": key, "type": ent.entity_type, "mentions": 0}
            entity_counter[key]["mentions"] += 1

        top_entities = sorted(entity_counter.values(), key=lambda x: x["mentions"], reverse=True)[:10]

        # Determine the match_id for this aggregation
        agg_match_id = match_id
        if not agg_match_id:
            # Use the most common match_id in this window
            match_ids = [it.match_id for it in items if it.match_id]
            if match_ids:
                agg_match_id = Counter(match_ids).most_common(1)[0][0]

        # Upsert the aggregated metric
        stmt = pg_insert(AggregatedMetric).values(
            id=uuid.uuid4(),
            match_id=agg_match_id,
            team=None,  # Overall (not team-specific for MVP)
            window_start=w_start,
            window_end=w_end,
            total_items=total,
            positive_count=positive,
            negative_count=negative,
            neutral_count=neutral,
            positive_pct=round((positive / total) * 100, 1) if total > 0 else 0,
            top_keywords=top_kw,
            top_entities=top_entities,
        ).on_conflict_do_update(
            constraint="uq_agg_window",
            set_={
                "total_items": total,
                "positive_count": positive,
                "negative_count": negative,
                "neutral_count": neutral,
                "positive_pct": round((positive / total) * 100, 1) if total > 0 else 0,
                "top_keywords": top_kw,
                "top_entities": top_entities,
            },
        )

        await db.execute(stmt)

    await db.commit()
    logger.info("Aggregation complete for %d windows", windows_to_process)
