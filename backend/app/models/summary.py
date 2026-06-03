import uuid
from datetime import datetime, timezone

from sqlalchemy import Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP

from .base import Base


class Summary(Base):
    __tablename__ = "summaries"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    match_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("matches.id", ondelete="CASCADE"), nullable=True
    )
    text: Mapped[str] = mapped_column(Text, nullable=False)
    generated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )
    window_start: Mapped[datetime | None] = mapped_column(
        TIMESTAMP(timezone=True), nullable=True
    )
    window_end: Mapped[datetime | None] = mapped_column(
        TIMESTAMP(timezone=True), nullable=True
    )
