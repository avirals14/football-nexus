"""Seed script: inserts demo matches into the database.

Usage:
    cd backend
    python seed.py
"""

import asyncio
import uuid
from datetime import datetime, timezone

from sqlalchemy import text
from app.db.session import engine


SEED_MATCHES = [
    {
        "id": str(uuid.uuid4()),
        "home_team": "Argentina",
        "away_team": "Brazil",
        "home_flag": "🇦🇷",
        "away_flag": "🇧🇷",
        "competition": "World Cup 2026 Qualifier",
        "match_date": "2026-06-15T20:00:00Z",
        "status": "upcoming",
        "search_keywords": ["argentina", "brazil", "messi", "neymar", "world cup qualifier", "conmebol", "albiceleste", "selecao"],
    },
    {
        "id": str(uuid.uuid4()),
        "home_team": "Spain",
        "away_team": "France",
        "home_flag": "🇪🇸",
        "away_flag": "🇫🇷",
        "competition": "World Cup 2026 Qualifier",
        "match_date": "2026-06-16T19:00:00Z",
        "status": "upcoming",
        "search_keywords": ["spain", "france", "mbappe", "pedri", "yamal", "deschamps", "de la fonte", "la roja", "les bleus"],
    },
    {
        "id": str(uuid.uuid4()),
        "home_team": "Manchester City",
        "away_team": "Real Madrid",
        "home_flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
        "away_flag": "🇪🇸",
        "competition": "Champions League",
        "match_date": "2026-06-20T20:00:00Z",
        "status": "upcoming",
        "search_keywords": ["manchester city", "man city", "real madrid", "haaland", "vinicius", "guardiola", "ancelotti", "champions league"],
    },
]


async def seed():
    async with engine.begin() as conn:
        for match in SEED_MATCHES:
            await conn.execute(
                text(
                    """
                    INSERT INTO matches (id, home_team, away_team, home_flag, away_flag, competition, match_date, status, search_keywords)
                    VALUES (:id, :home_team, :away_team, :home_flag, :away_flag, :competition, :match_date, :status, :search_keywords)
                    ON CONFLICT (id) DO NOTHING
                    """
                ),
                {
                    **match,
                    "search_keywords": match["search_keywords"],
                },
            )
        print(f"Seeded {len(SEED_MATCHES)} matches.")
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed())
