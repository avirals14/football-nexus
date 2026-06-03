"""Sky Sports Football — RSS feed source."""

from __future__ import annotations

import hashlib
import logging
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime

import feedparser
import httpx

from .base import BaseSource, RawContent

logger = logging.getLogger(__name__)


class SkySportsSource(BaseSource):
    RSS_URL = "https://www.skysports.com/rss/12040"

    @property
    def name(self) -> str:
        return "skysports"

    async def fetch(self) -> list[RawContent]:
        async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
            resp = await client.get(
                self.RSS_URL,
                headers={"User-Agent": "FootballNexus/1.0 (+https://footballnexus.dev)"},
            )
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

        logger.info("Sky Sports: fetched %d headlines", len(items))
        return items


def _parse_published(entry) -> datetime:
    for attr in ("published", "updated"):
        raw = getattr(entry, attr, None)
        if raw:
            try:
                return parsedate_to_datetime(raw).astimezone(timezone.utc)
            except Exception:
                pass
    return datetime.now(timezone.utc)
