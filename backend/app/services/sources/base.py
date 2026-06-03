"""Abstract base class for all content sources.

Every data source (news RSS, web scraper, Reddit, Twitter, etc.)
implements this interface. The sentiment pipeline consumes RawContent
objects and never knows where they came from.
"""

from __future__ import annotations

import asyncio
import logging
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime, timezone

logger = logging.getLogger(__name__)


@dataclass
class RawContent:
    """Universal container for any piece of text from any source."""

    source: str  # "bbc", "espn", "goal", "skysports", "reddit"
    source_id: str  # Unique within source (URL hash, Reddit comment ID)
    text: str  # The headline text or comment body
    url: str | None = None
    author: str | None = None
    published_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


class BaseSource(ABC):
    """Every data source implements this. One property, one method."""

    @property
    @abstractmethod
    def name(self) -> str:
        """Source identifier: 'bbc', 'espn', 'reddit', etc."""
        ...

    @abstractmethod
    async def fetch(self) -> list[RawContent]:
        """Fetch the latest content from this source."""
        ...


async def fetch_all_sources(sources: list[BaseSource]) -> list[RawContent]:
    """Fetch from all sources concurrently. Failures are logged, not raised."""
    results: list[RawContent] = []
    tasks = [source.fetch() for source in sources]
    outcomes = await asyncio.gather(*tasks, return_exceptions=True)

    for source, outcome in zip(sources, outcomes):
        if isinstance(outcome, Exception):
            logger.error("Source '%s' failed: %s", source.name, outcome)
        else:
            logger.info("Source '%s' returned %d items", source.name, len(outcome))
            results.extend(outcome)

    return results
