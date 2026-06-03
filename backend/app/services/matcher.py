"""Tags content items to matches based on keyword overlap."""

from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.match import Match
    from app.services.sources.base import RawContent


def find_matching_match(
    content: RawContent, matches: list[Match]
) -> uuid.UUID | None:
    """Return the match_id of the best matching match, or None."""
    text_lower = content.text.lower()
    best_match_id: uuid.UUID | None = None
    best_score = 0

    for match in matches:
        score = 0
        keywords = match.search_keywords or []
        for keyword in keywords:
            if keyword.lower() in text_lower:
                score += 1
        if score > best_score:
            best_score = score
            best_match_id = match.id

    # Require at least 1 keyword match
    return best_match_id if best_score >= 1 else None
