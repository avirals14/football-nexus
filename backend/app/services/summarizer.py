"""AI-powered match summary generation via Groq / Gemini."""

from __future__ import annotations

import json
import logging
import uuid
from datetime import datetime, timedelta, timezone

from groq import AsyncGroq
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.content_item import ContentItem
from app.models.summary import Summary

logger = logging.getLogger(__name__)

SUMMARY_SYSTEM_PROMPT = """You are a football intelligence analyst for Football Nexus.

Given a set of recent football headlines with their sentiment labels, write a concise
2-4 sentence summary of the current football narrative.

Focus on:
- Overall fan/media mood
- Key players and teams dominating discussion
- Notable trends (transfers, injuries, match results)
- Any controversies or emotional swings

Write in a confident, analytical tone — like a football pundit summarizing the day's news.
Do NOT list headlines. Synthesize them into a narrative.
Return ONLY the summary text. No JSON. No markdown."""


async def generate_summary(
    db: AsyncSession, match_id: uuid.UUID | None = None
) -> str | None:
    """Generate an AI summary of recent content and store it."""
    now = datetime.now(timezone.utc)
    window_start = now - timedelta(hours=2)

    # Get recent analyzed content
    query = (
        select(ContentItem)
        .where(
            and_(
                ContentItem.analyzed_at.is_not(None),
                ContentItem.published_at >= window_start,
            )
        )
        .order_by(ContentItem.published_at.desc())
        .limit(50)
    )
    if match_id:
        query = query.where(ContentItem.match_id == match_id)

    result = await db.execute(query)
    items = result.scalars().all()

    if len(items) < 3:
        logger.info("Not enough content for summary (have %d, need 3+)", len(items))
        return None

    # Build prompt
    headline_list = "\n".join(
        f"- [{it.sentiment}] {it.text}" for it in items
    )
    user_prompt = f"Here are the latest football headlines with sentiment:\n\n{headline_list}\n\nWrite a summary:"

    # Try Groq first, then Gemini
    summary_text = None
    try:
        summary_text = await _summarize_groq(user_prompt)
    except Exception as e:
        logger.warning("Groq summary failed (%s), trying Gemini", e)
        try:
            summary_text = await _summarize_gemini(user_prompt)
        except Exception as e2:
            logger.error("Both providers failed for summary: %s", e2)
            return None

    if not summary_text:
        return None

    # Store the summary
    summary = Summary(
        match_id=match_id,
        text=summary_text.strip(),
        generated_at=now,
        window_start=window_start,
        window_end=now,
    )
    db.add(summary)
    await db.commit()
    logger.info("Generated summary: %s...", summary_text[:80])
    return summary_text


async def _summarize_groq(user_prompt: str) -> str:
    client = AsyncGroq(api_key=settings.groq_api_key)
    response = await client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SUMMARY_SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.4,
        max_tokens=512,
    )
    return response.choices[0].message.content or ""


async def _summarize_gemini(user_prompt: str) -> str:
    from google import genai

    client = genai.Client(api_key=settings.gemini_api_key)
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=user_prompt,
        config={
            "system_instruction": SUMMARY_SYSTEM_PROMPT,
            "temperature": 0.4,
        },
    )
    return response.text or ""
