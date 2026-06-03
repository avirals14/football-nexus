import uuid
from datetime import datetime, timezone

from sqlalchemy import String, Text, ARRAY
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP

from .base import Base


class Match(Base):
    __tablename__ = "matches"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    home_team: Mapped[str] = mapped_column(String(100), nullable=False)
    away_team: Mapped[str] = mapped_column(String(100), nullable=False)
    home_flag: Mapped[str] = mapped_column(String(10), default="")
    away_flag: Mapped[str] = mapped_column(String(10), default="")
    competition: Mapped[str] = mapped_column(String(100), default="")
    match_date: Mapped[datetime | None] = mapped_column(
        TIMESTAMP(timezone=True), nullable=True
    )
    status: Mapped[str] = mapped_column(String(20), default="upcoming")
    reddit_thread_ids: Mapped[list[str] | None] = mapped_column(
        ARRAY(Text), default=list
    )
    subreddits: Mapped[list[str] | None] = mapped_column(ARRAY(Text), default=list)
    search_keywords: Mapped[list[str] | None] = mapped_column(
        ARRAY(Text), default=list
    )
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )
