"""Background worker scheduler.

Runs periodic tasks using APScheduler:
- Ingest: Fetch headlines from all news sources
- Analyze: Run sentiment analysis on un-analyzed items
- Aggregate: Roll up metrics into 5-minute windows
- Summarize: Generate AI summaries
"""

from __future__ import annotations

import logging
import uuid
from datetime import datetime, timezone

from sqlalchemy import select, and_
from sqlalchemy.dialects.postgresql import insert as pg_insert

from app.config import settings
from app.db.session import async_session
from app.models.match import Match
from app.models.content_item import ContentItem
from app.models.entity import Entity
from app.services.sources import ALL_SOURCES
from app.services.sources.base import fetch_all_sources, RawContent
from app.services.analyzer import analyze_batch
from app.services.aggregator import run_aggregation
from app.services.summarizer import generate_summary
from app.services.matcher import find_matching_match

logger = logging.getLogger(__name__)


async def ingest_task():
    """Fetch headlines from all news sources and store them."""
    logger.info("=== INGEST: Starting headline fetch ===")

    try:
        # 1. Fetch from all sources
        raw_items = await fetch_all_sources(ALL_SOURCES)
        logger.info("Fetched %d raw items from %d sources", len(raw_items), len(ALL_SOURCES))

        if not raw_items:
            return

        async with async_session() as db:
            # 2. Load active matches for tagging
            match_result = await db.execute(select(Match))
            matches = match_result.scalars().all()

            inserted = 0
            for item in raw_items:
                # 3. Tag to a match
                match_id = find_matching_match(item, matches)

                # 4. Upsert (skip duplicates)
                stmt = pg_insert(ContentItem).values(
                    id=uuid.uuid4(),
                    match_id=match_id,
                    source=item.source,
                    source_id=item.source_id,
                    source_url=item.url,
                    text=item.text,
                    author=item.author,
                    language="en",
                    published_at=item.published_at,
                    created_at=datetime.now(timezone.utc),
                ).on_conflict_do_nothing(
                    constraint="uq_content_source",
                )

                result = await db.execute(stmt)
                if result.rowcount and result.rowcount > 0:
                    inserted += 1

            await db.commit()
            logger.info("INGEST: Inserted %d new items (skipped %d duplicates)", inserted, len(raw_items) - inserted)

    except Exception as e:
        logger.error("INGEST failed: %s", e, exc_info=True)


async def analyze_task():
    """Analyze un-analyzed content items via LLM."""
    logger.info("=== ANALYZE: Processing un-analyzed items ===")

    try:
        async with async_session() as db:
            # Get un-analyzed items (batch of 20)
            query = (
                select(ContentItem)
                .where(ContentItem.analyzed_at.is_(None))
                .order_by(ContentItem.created_at.asc())
                .limit(20)
            )
            result = await db.execute(query)
            items = result.scalars().all()

            if not items:
                logger.info("ANALYZE: No un-analyzed items found")
                return

            logger.info("ANALYZE: Processing %d items", len(items))

            # Run batch analysis
            texts = [item.text for item in items]
            analyses = await analyze_batch(texts)

            if not analyses:
                logger.warning("ANALYZE: LLM returned no results")
                return

            # Map results back to items
            for analysis in analyses:
                if analysis.index >= len(items):
                    continue

                item = items[analysis.index]
                item.sentiment = analysis.sentiment
                item.sentiment_score = analysis.sentiment_score
                item.keywords = analysis.keywords
                item.analyzed_at = datetime.now(timezone.utc)

                # Insert entities
                for ent in analysis.entities:
                    entity = Entity(
                        id=uuid.uuid4(),
                        content_item_id=item.id,
                        entity_type=ent.get("type", "other"),
                        entity_name=ent.get("name", ""),
                        raw_mention=ent.get("name", ""),
                    )
                    db.add(entity)

            await db.commit()
            logger.info("ANALYZE: Successfully analyzed %d items", len(analyses))

    except Exception as e:
        logger.error("ANALYZE failed: %s", e, exc_info=True)


async def aggregate_task():
    """Run metric aggregation for all active matches."""
    logger.info("=== AGGREGATE: Rolling up metrics ===")

    try:
        async with async_session() as db:
            # Get all matches
            result = await db.execute(select(Match))
            matches = result.scalars().all()

            for match in matches:
                await run_aggregation(db, match_id=match.id)

            # Also run a global aggregation (no match filter)
            await run_aggregation(db, match_id=None)

            logger.info("AGGREGATE: Complete for %d matches", len(matches))

    except Exception as e:
        logger.error("AGGREGATE failed: %s", e, exc_info=True)


async def summarize_task():
    """Generate AI summaries for active matches."""
    logger.info("=== SUMMARIZE: Generating summaries ===")

    try:
        async with async_session() as db:
            result = await db.execute(select(Match))
            matches = result.scalars().all()

            for match in matches:
                await generate_summary(db, match_id=match.id)

            logger.info("SUMMARIZE: Complete for %d matches", len(matches))

    except Exception as e:
        logger.error("SUMMARIZE failed: %s", e, exc_info=True)
