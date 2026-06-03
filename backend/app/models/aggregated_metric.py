import uuid
from datetime import datetime, timezone

from sqlalchemy import String, Integer, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP, JSONB

from .base import Base


class AggregatedMetric(Base):
    __tablename__ = "aggregated_metrics"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    match_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("matches.id", ondelete="CASCADE"), nullable=True
    )
    team: Mapped[str | None] = mapped_column(String(100), nullable=True)
    window_start: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), nullable=False
    )
    window_end: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), nullable=False
    )
    total_items: Mapped[int] = mapped_column(Integer, default=0)
    positive_count: Mapped[int] = mapped_column(Integer, default=0)
    negative_count: Mapped[int] = mapped_column(Integer, default=0)
    neutral_count: Mapped[int] = mapped_column(Integer, default=0)
    positive_pct: Mapped[float] = mapped_column(Float, default=0.0)
    top_keywords: Mapped[dict | None] = mapped_column(JSONB, default=list)
    top_entities: Mapped[dict | None] = mapped_column(JSONB, default=list)
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )
