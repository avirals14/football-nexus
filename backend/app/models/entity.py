import uuid

from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID

from .base import Base


class Entity(Base):
    __tablename__ = "entities"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    content_item_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("content_items.id", ondelete="CASCADE"),
        nullable=False,
    )
    entity_type: Mapped[str] = mapped_column(String(20), nullable=False)
    entity_name: Mapped[str] = mapped_column(String(100), nullable=False)
    raw_mention: Mapped[str] = mapped_column(String(100), nullable=False)
