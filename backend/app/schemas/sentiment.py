from __future__ import annotations

from datetime import datetime
from pydantic import BaseModel


class TimelinePoint(BaseModel):
    window_start: datetime
    window_end: datetime
    positive_pct: float
    negative_pct: float
    neutral_pct: float
    total_items: int


class TeamSentiment(BaseModel):
    positive_pct: float
    negative_pct: float
    neutral_pct: float
    total_items: int


class PlayerMention(BaseModel):
    name: str
    mentions: int
    avg_sentiment_score: float = 0.0


class SentimentOut(BaseModel):
    timeline: list[TimelinePoint]
    teams: dict[str, TeamSentiment]
    top_players: list[PlayerMention]
    top_keywords: list[str]
