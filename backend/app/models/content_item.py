import uuid
from datetime import datetime, timezone

from sqlalchemy import String, Text, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP, JSONB

from .base import Base


class ContentItem(Base):
    __tablename__ = "content_items"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    match_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("matches.id", ondelete="SET NULL"), nullable=True
    )
    source: Mapped[str] = mapped_column(String(30), nullable=False)
    source_id: Mapped[str] = mapped_column(String(255), nullable=False)
    source_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    text: Mapped[str] = mapped_column(Text, nullable=False)
    author: Mapped[str | None] = mapped_column(String(100), nullable=True)
    sentiment: Mapped[str | None] = mapped_column(String(10), nullable=True)
    sentiment_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    keywords: Mapped[dict | None] = mapped_column(JSONB, default=list)
    language: Mapped[str] = mapped_column(String(10), default="en")
    published_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), nullable=False
    )
    analyzed_at: Mapped[datetime | None] = mapped_column(
        TIMESTAMP(timezone=True), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )
