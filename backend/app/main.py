"""Fan Pulse API — FastAPI application entry point.

Configures CORS, mounts the API router, sets up background workers,
and provides the health check endpoint.
"""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.router import api_router
from app.workers.scheduler import (
    ingest_task,
    analyze_task,
    aggregate_task,
    summarize_task,
)

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=getattr(logging, settings.log_level.upper(), logging.INFO),
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Background scheduler
# ---------------------------------------------------------------------------
scheduler = AsyncIOScheduler()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle."""
    logger.info("Starting Fan Pulse API (%s)", settings.environment)

    # Register background jobs
    scheduler.add_job(
        ingest_task,
        "interval",
        seconds=settings.ingest_interval,
        id="ingest",
        name="Headline Ingestion",
        max_instances=1,
    )
    scheduler.add_job(
        analyze_task,
        "interval",
        seconds=settings.analyze_interval,
        id="analyze",
        name="Sentiment Analysis",
        max_instances=1,
    )
    scheduler.add_job(
        aggregate_task,
        "interval",
        seconds=settings.aggregate_interval,
        id="aggregate",
        name="Metric Aggregation",
        max_instances=1,
    )
    scheduler.add_job(
        summarize_task,
        "interval",
        seconds=settings.summarize_interval,
        id="summarize",
        name="AI Summary Generation",
        max_instances=1,
    )

    scheduler.start()
    logger.info("Background scheduler started with %d jobs", len(scheduler.get_jobs()))

    # Run initial ingestion + analysis on startup (don't block)
    scheduler.add_job(ingest_task, id="ingest_startup", name="Initial Ingestion")
    # Delay the first analysis by 30s to let ingestion finish
    scheduler.add_job(
        analyze_task,
        "date",
        id="analyze_startup",
        name="Initial Analysis",
        run_date=None,  # run immediately but APScheduler queues it
    )

    yield

    # Shutdown
    scheduler.shutdown(wait=False)
    logger.info("Fan Pulse API shutting down")


# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Fan Pulse API",
    description="Football Nexus — Real-time football sentiment intelligence",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes
app.include_router(api_router)


# Health check
@app.get("/health", tags=["system"])
async def health():
    return {
        "status": "ok",
        "service": "fan-pulse-api",
        "version": "0.1.0",
        "environment": settings.environment,
    }
