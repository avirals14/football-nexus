/* ================================================================== */
/*  Fan Pulse API client — fetch with automatic mock fallback         */
/* ================================================================== */

import type {
  MatchListResponse,
  MatchDetailResponse,
  SentimentResponse,
  ContentResponse,
  SummaryResponse,
} from "./mock-data";

import {
  MOCK_MATCHES,
  MOCK_MATCH_DETAILS,
  MOCK_SENTIMENT,
  MOCK_CONTENT,
  MOCK_SUMMARIES,
} from "./mock-data";

const API_BASE =
  process.env.NEXT_PUBLIC_FAN_PULSE_API_URL || "http://localhost:8000";

/* ------------------------------------------------------------------ */
/*  Generic safe-fetch: tries the real API, falls back to mock data   */
/* ------------------------------------------------------------------ */

interface FetchResult<T> {
  data: T;
  isMock: boolean;
}

async function safeFetch<T>(
  path: string,
  fallback: T
): Promise<FetchResult<T>> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${API_BASE}${path}`, {
      signal: controller.signal,
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as T;
    return { data, isMock: false };
  } catch {
    return { data: fallback, isMock: true };
  }
}

/* ------------------------------------------------------------------ */
/*  Typed endpoint fetchers                                           */
/* ------------------------------------------------------------------ */

export async function fetchMatches(): Promise<FetchResult<MatchListResponse>> {
  return safeFetch("/api/matches", MOCK_MATCHES);
}

export async function fetchMatchDetail(
  matchId: string
): Promise<FetchResult<MatchDetailResponse>> {
  const fallback = MOCK_MATCH_DETAILS[matchId] ?? MOCK_MATCH_DETAILS["mock-arg-bra"];
  return safeFetch(`/api/matches/${matchId}`, fallback);
}

export async function fetchSentiment(
  matchId: string
): Promise<FetchResult<SentimentResponse>> {
  const fallback = MOCK_SENTIMENT[matchId] ?? MOCK_SENTIMENT["mock-arg-bra"];
  return safeFetch(`/api/sentiment/${matchId}`, fallback);
}

export async function fetchContent(
  matchId: string
): Promise<FetchResult<ContentResponse>> {
  const fallback = MOCK_CONTENT[matchId] ?? MOCK_CONTENT["mock-arg-bra"];
  return safeFetch(`/api/content/${matchId}`, fallback);
}

export async function fetchSummary(
  matchId: string
): Promise<FetchResult<SummaryResponse>> {
  const fallback = MOCK_SUMMARIES[matchId] ?? MOCK_SUMMARIES["mock-arg-bra"];
  return safeFetch(`/api/summary/${matchId}`, fallback);
}
