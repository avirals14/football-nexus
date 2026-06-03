"""BBC Sport Football — RSS feed source."""

from __future__ import annotations

import hashlib
import logging
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime

import feedparser
import httpx

from .base import BaseSource, RawContent

logger = logging.getLogger(__name__)


class BBCSource(BaseSource):
    RSS_URL = "https://feeds.bbci.co.uk/sport/football/rss.xml"

    @property
    def name(self) -> str:
        return "bbc"

    async def fetch(self) -> list[RawContent]:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(self.RSS_URL)
            resp.raise_for_status()

        feed = feedparser.parse(resp.text)
        items: list[RawContent] = []

        for entry in feed.entries:
            link = getattr(entry, "link", "")
            title = getattr(entry, "title", "").strip()
            if not title or len(title) < 10:
                continue

            source_id = hashlib.md5(link.encode("utf-8")).hexdigest()
            published_at = _parse_published(entry)

            items.append(
                RawContent(
                    source=self.name,
                    source_id=source_id,
                    text=title,
                    url=link,
                    author=getattr(entry, "author", None),
                    published_at=published_at,
                )
            )

        logger.info("BBC: fetched %d headlines", len(items))
        return items


def _parse_published(entry) -> datetime:
    """Try to parse the published date from an RSS entry."""
    for attr in ("published", "updated"):
        raw = getattr(entry, attr, None)
        if raw:
            try:
                return parsedate_to_datetime(raw).astimezone(timezone.utc)
            except Exception:
                pass
    return datetime.now(timezone.utc)
