from __future__ import annotations

import uuid
from datetime import datetime
from pydantic import BaseModel


class MatchOut(BaseModel):
    id: uuid.UUID
    home_team: str
    away_team: str
    home_flag: str
    away_flag: str
    competition: str
    match_date: datetime | None
    status: str
    total_content_items: int = 0

    model_config = {"from_attributes": True}


class OverallSentiment(BaseModel):
    positive_pct: float
    neutral_pct: float
    negative_pct: float
    total_items: int
    mood_label: str


class MatchDetailOut(BaseModel):
    match: MatchOut
    overall_sentiment: OverallSentiment


class MatchListOut(BaseModel):
    matches: list[MatchOut]
