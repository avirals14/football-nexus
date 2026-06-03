from __future__ import annotations

import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.match import Match
from app.models.content_item import ContentItem
from app.models.entity import Entity
from app.schemas.content import ContentItemOut, ContentListOut, EntityOut

router = APIRouter()


@router.get("/content/{match_id}", response_model=ContentListOut)
async def get_content(
    match_id: uuid.UUID,
    limit: int = Query(default=50, ge=1, le=200),
    since: datetime | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
):
    # Verify match exists
    match_result = await db.execute(select(Match).where(Match.id == match_id))
    if not match_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail={"code": "MATCH_NOT_FOUND", "message": f"No match found with ID {match_id}"})

    # Query content items
    query = (
        select(ContentItem)
        .where(
            and_(
                ContentItem.match_id == match_id,
                ContentItem.analyzed_at.is_not(None),
            )
        )
        .order_by(ContentItem.published_at.desc())
    )

    if since:
        query = query.where(ContentItem.published_at > since)

    # Get total count
    count_q = select(func.count()).where(
        ContentItem.match_id == match_id,
        ContentItem.analyzed_at.is_not(None),
    )
    total_result = await db.execute(count_q)
    total = total_result.scalar() or 0

    # Get items with limit
    query = query.limit(limit + 1)  # +1 to check has_more
    result = await db.execute(query)
    items = result.scalars().all()

    has_more = len(items) > limit
    items = items[:limit]

    # Load entities for each item
    out_items: list[ContentItemOut] = []
    for item in items:
        ent_q = select(Entity).where(Entity.content_item_id == item.id)
        ent_result = await db.execute(ent_q)
        entities = ent_result.scalars().all()

        out_items.append(
            ContentItemOut(
                id=item.id,
                source=item.source,
                text=item.text,
                url=item.source_url,
                sentiment=item.sentiment,
                sentiment_score=item.sentiment_score,
                entities=[EntityOut(name=e.entity_name, type=e.entity_type) for e in entities],
                keywords=item.keywords if isinstance(item.keywords, list) else [],
                published_at=item.published_at,
            )
        )

    return ContentListOut(items=out_items, total=total, has_more=has_more)
