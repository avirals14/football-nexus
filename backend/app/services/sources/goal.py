"""Goal.com — HTML scraping source (no reliable RSS)."""

from __future__ import annotations

import hashlib
import logging
from datetime import datetime, timezone

import httpx
from bs4 import BeautifulSoup

from .base import BaseSource, RawContent

logger = logging.getLogger(__name__)


class GoalSource(BaseSource):
    URL = "https://www.goal.com/en/news"

    @property
    def name(self) -> str:
        return "goal"

    async def fetch(self) -> list[RawContent]:
        async with httpx.AsyncClient(timeout=20.0, follow_redirects=True) as client:
            resp = await client.get(
                self.URL,
                headers={
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
                    "Accept": "text/html,application/xhtml+xml",
                    "Accept-Language": "en-US,en;q=0.9",
                },
            )
            resp.raise_for_status()

        soup = BeautifulSoup(resp.text, "lxml")
        items: list[RawContent] = []
        seen: set[str] = set()

        # Goal.com uses various selectors — try multiple patterns
        selectors = [
            "article h3 a",
            "article h3",
            "[class*='title'] a",
            "h3 a[href*='/en/']",
            ".card-title a",
            "a[class*='article']",
        ]

        for selector in selectors:
            for el in soup.select(selector):
                title = el.get_text(strip=True)
                if not title or len(title) < 15:
                    continue

                href = el.get("href", "")
                if href and not href.startswith("http"):
                    href = f"https://www.goal.com{href}"

                sig = hashlib.md5(title.encode("utf-8")).hexdigest()
                if sig in seen:
                    continue
                seen.add(sig)

                items.append(
                    RawContent(
                        source=self.name,
                        source_id=sig,
                        text=title,
                        url=href or None,
                        published_at=datetime.now(timezone.utc),
                    )
                )

            if items:  # Stop at first selector that finds results
                break

        logger.info("Goal.com: fetched %d headlines", len(items))
        return items
