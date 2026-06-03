"""Combines all sub-routers into a single API router."""

from fastapi import APIRouter

from . import matches, sentiment, content, summary

api_router = APIRouter(prefix="/api")

api_router.include_router(matches.router, tags=["matches"])
api_router.include_router(sentiment.router, tags=["sentiment"])
api_router.include_router(content.router, tags=["content"])
api_router.include_router(summary.router, tags=["summaries"])
