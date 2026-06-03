from __future__ import annotations

from datetime import datetime
from pydantic import BaseModel


class SummaryData(BaseModel):
    text: str
    generated_at: datetime
    covers_from: datetime | None
    covers_to: datetime | None


class SummaryOut(BaseModel):
    summary: SummaryData | None
