from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.match import Match
from app.models.summary import Summary
from app.schemas.summary import SummaryOut, SummaryData

router = APIRouter()


@router.get("/summary/{match_id}", response_model=SummaryOut)
async def get_summary(
    match_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    # Verify match exists
    match_result = await db.execute(select(Match).where(Match.id == match_id))
    if not match_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail={"code": "MATCH_NOT_FOUND", "message": f"No match found with ID {match_id}"})

    # Get latest summary
    query = (
        select(Summary)
        .where(Summary.match_id == match_id)
        .order_by(Summary.generated_at.desc())
        .limit(1)
    )
    result = await db.execute(query)
    summary = result.scalar_one_or_none()

    if not summary:
        return SummaryOut(summary=None)

    return SummaryOut(
        summary=SummaryData(
            text=summary.text,
            generated_at=summary.generated_at,
            covers_from=summary.window_start,
            covers_to=summary.window_end,
        )
    )
