"""Sentiment analysis via LLM API (Groq primary, Gemini fallback).

Analyzes batches of headlines/comments and returns sentiment, entities,
and keywords in a single API call.
"""

from __future__ import annotations

import json
import logging
from dataclasses import dataclass

from groq import AsyncGroq
from app.config import settings

logger = logging.getLogger(__name__)


@dataclass
class AnalysisResult:
    index: int
    sentiment: str  # "positive", "negative", "neutral"
    sentiment_score: float
    entities: list[dict]  # [{"name": "Messi", "type": "player"}]
    keywords: list[str]


SYSTEM_PROMPT = """You are a football sentiment analysis engine.

Analyze each football headline or comment. Return ONLY a JSON array with one object per input.

Each object must have:
- "index": the 0-based index of the input
- "sentiment": exactly one of "positive", "negative", "neutral"
- "sentiment_score": confidence float 0.0-1.0
- "entities": array of {"name": "Normalized Name", "type": "player|team|manager|competition"}
- "keywords": array of 1-5 topic strings (e.g. "transfer", "injury", "goal", "tactics")

Football-specific rules:
- "cooking" = performing brilliantly = positive
- "cold finish" = clinical goal = positive
- "we are finished" = hopelessness = negative
- "fraud" / "finished player" = negative
- "GOAT" = greatest of all time = positive
- Transfers and signings = neutral unless language is clearly positive/negative
- Injury news = generally negative
- Match previews = generally neutral

Always normalize entity names:
- "Leo" → "Messi", "CR7" → "Ronaldo", "Pep" → "Guardiola"
- "Man City" → "Manchester City", "Barca" → "Barcelona"
- "United" → "Manchester United", "Real" → "Real Madrid"

Return ONLY valid JSON. No markdown fences. No explanatory text."""

# Entity alias normalization (post-processing)
ENTITY_ALIASES: dict[str, str] = {
    "leo": "Messi", "lionel": "Messi", "lionel messi": "Messi", "la pulga": "Messi",
    "cr7": "Ronaldo", "cristiano": "Ronaldo", "cristiano ronaldo": "Ronaldo",
    "mbappe": "Mbappé", "kylian": "Mbappé", "kylian mbappe": "Mbappé",
    "haaland": "Haaland", "erling": "Haaland", "erling haaland": "Haaland",
    "pep": "Guardiola", "guardiola": "Guardiola",
    "carlo": "Ancelotti", "ancelotti": "Ancelotti",
    "klopp": "Klopp", "jurgen klopp": "Klopp",
    "scaloni": "Scaloni",
    "barca": "Barcelona", "barça": "Barcelona",
    "real": "Real Madrid", "los blancos": "Real Madrid",
    "man utd": "Manchester United", "united": "Manchester United", "man united": "Manchester United",
    "man city": "Manchester City", "city": "Manchester City",
    "bayern": "Bayern Munich", "bayern munich": "Bayern Munich",
    "psg": "Paris Saint-Germain",
    "la albiceleste": "Argentina",
    "selecao": "Brazil", "seleção": "Brazil",
    "la roja": "Spain",
    "les bleus": "France", "the blues": "Chelsea",
}


def normalize_entity_name(name: str) -> str:
    """Normalize an entity name using alias dictionary."""
    return ENTITY_ALIASES.get(name.lower().strip(), name.strip().title())


async def analyze_batch(texts: list[str]) -> list[AnalysisResult]:
    """Analyze a batch of texts using Groq (primary) or Gemini (fallback)."""
    if not texts:
        return []

    try:
        return await _analyze_with_groq(texts)
    except Exception as e:
        logger.warning("Groq failed (%s), falling back to Gemini", e)
        try:
            return await _analyze_with_gemini(texts)
        except Exception as e2:
            logger.error("Both Groq and Gemini failed: %s", e2)
            return []


async def _analyze_with_groq(texts: list[str]) -> list[AnalysisResult]:
    """Primary: Groq + Llama 3.3 70B."""
    client = AsyncGroq(api_key=settings.groq_api_key)
    numbered = "\n".join(f"{i}. {t}" for i, t in enumerate(texts))

    response = await client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Analyze these football texts:\n\n{numbered}"},
        ],
        response_format={"type": "json_object"},
        temperature=0.1,
        max_tokens=4096,
    )

    raw = response.choices[0].message.content or "[]"
    return _parse_results(raw, len(texts))


async def _analyze_with_gemini(texts: list[str]) -> list[AnalysisResult]:
    """Fallback: Gemini 2.5 Flash."""
    from google import genai

    client = genai.Client(api_key=settings.gemini_api_key)
    numbered = "\n".join(f"{i}. {t}" for i, t in enumerate(texts))

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"Analyze these football texts:\n\n{numbered}",
        config={
            "system_instruction": SYSTEM_PROMPT,
            "response_mime_type": "application/json",
            "temperature": 0.1,
        },
    )

    raw = response.text or "[]"
    return _parse_results(raw, len(texts))


def _parse_results(raw_json: str, expected_count: int) -> list[AnalysisResult]:
    """Parse the LLM JSON response into AnalysisResult objects."""
    try:
        data = json.loads(raw_json)
    except json.JSONDecodeError:
        logger.error("Failed to parse analysis JSON: %s", raw_json[:200])
        return []

    # Handle both {"results": [...]} and [...] formats
    if isinstance(data, dict):
        data = data.get("results", data.get("items", data.get("analyses", [])))
    if not isinstance(data, list):
        logger.error("Unexpected analysis response format")
        return []

    results: list[AnalysisResult] = []
    for item in data:
        try:
            # Normalize entities
            entities = []
            for ent in item.get("entities", []):
                if isinstance(ent, dict) and "name" in ent:
                    entities.append({
                        "name": normalize_entity_name(ent["name"]),
                        "type": ent.get("type", "other"),
                    })

            sentiment = item.get("sentiment", "neutral").lower()
            if sentiment not in ("positive", "negative", "neutral"):
                sentiment = "neutral"

            results.append(
                AnalysisResult(
                    index=item.get("index", len(results)),
                    sentiment=sentiment,
                    sentiment_score=min(1.0, max(0.0, float(item.get("sentiment_score", 0.5)))),
                    entities=entities,
                    keywords=[str(k) for k in item.get("keywords", [])],
                )
            )
        except (KeyError, ValueError, TypeError) as e:
            logger.warning("Skipping malformed analysis item: %s", e)

    return results
