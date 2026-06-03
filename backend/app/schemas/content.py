from __future__ import annotations

import uuid
from datetime import datetime
from pydantic import BaseModel


class EntityOut(BaseModel):
    name: str
    type: str


class ContentItemOut(BaseModel):
    id: uuid.UUID
    source: str
    text: str
    url: str | None
    sentiment: str | None
    sentiment_score: float | None
    entities: list[EntityOut] = []
    keywords: list[str] = []
    published_at: datetime

    model_config = {"from_attributes": True}


class ContentListOut(BaseModel):
    items: list[ContentItemOut]
    total: int
    has_more: bool
