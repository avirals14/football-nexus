"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  TrendingUp,
  Sparkles,
  Radio,
  Users,
  Hash,
  ChevronRight,
  ExternalLink,
  Wifi,
  WifiOff,
} from "lucide-react";

import type {
  MatchInfo,
  MatchDetailResponse,
  SentimentResponse,
  ContentResponse,
  SummaryResponse,
  TimelinePoint,
  TopPlayer,
  ContentItemData,
} from "./mock-data";

import {
  fetchMatches,
  fetchMatchDetail,
  fetchSentiment,
  fetchContent,
  fetchSummary,
} from "./api";

/* ================================================================== */
/*  Helpers                                                           */
/* ================================================================== */

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const SOURCE_STYLE: Record<string, { bg: string; label: string }> = {
  bbc: { bg: "bg-rose-500/15 text-rose-400 border-rose-500/25", label: "BBC" },
  espn: { bg: "bg-amber-500/15 text-amber-400 border-amber-500/25", label: "ESPN" },
  skysports: { bg: "bg-sky-500/15 text-sky-400 border-sky-500/25", label: "SKY" },
  goal: { bg: "bg-violet-500/15 text-violet-400 border-violet-500/25", label: "GOAL" },
};

const SENTIMENT_DOT: Record<string, string> = {
  positive: "bg-emerald-400",
  negative: "bg-rose-400",
  neutral: "bg-zinc-500",
};

const SENTIMENT_BORDER: Record<string, string> = {
  positive: "border-l-emerald-500",
  negative: "border-l-rose-500",
  neutral: "border-l-zinc-600",
};

/* ================================================================== */
/*  Sub-components                                                    */
/* ================================================================== */

/* ---- Mock-mode banner ------------------------------------------- */

function MockBanner() {
  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex items-center justify-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm text-amber-300"
    >
      <WifiOff className="h-4 w-4" />
      <span>
        <strong>Demo Mode</strong> — Backend unreachable. Showing simulated data.
      </span>
    </motion.div>
  );
}

/* ---- Match selector --------------------------------------------- */

function MatchSelector({
  matches,
  selectedId,
  onSelect,
}: {
  matches: MatchInfo[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {matches.map((m) => {
        const isActive = m.id === selectedId;
        return (
          <motion.button
            key={m.id}
            onClick={() => onSelect(m.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`group relative flex-shrink-0 rounded-xl border px-5 py-4 text-left transition-all duration-300 ${
              isActive
                ? "border-emerald-500/40 bg-emerald-500/10 shadow-[0_0_24px_rgba(52,211,153,0.1)]"
                : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]"
            }`}
          >
            {/* Live indicator */}
            {m.status === "live" && (
              <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
              </span>
            )}

            <div className="flex items-center gap-3">
              <span className="text-xl">{m.home_flag}</span>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white truncate">
                  {m.home_team} vs {m.away_team}
                </div>
                <div className="text-xs text-zinc-500">{m.competition}</div>
              </div>
              <span className="text-xl">{m.away_flag}</span>
            </div>

            <div className="mt-2 flex items-center gap-2">
              {m.status === "live" ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-400">
                  <Radio className="h-2.5 w-2.5" /> Live
                </span>
              ) : (
                <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                  {m.status}
                </span>
              )}
              {m.total_content_items != null && (
                <span className="text-[10px] text-zinc-600">
                  {m.total_content_items} items
                </span>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

/* ---- Sentiment donut -------------------------------------------- */

function SentimentDonut({
  positive,
  neutral,
  negative,
  mood,
  total,
}: {
  positive: number;
  neutral: number;
  negative: number;
  mood: string;
  total: number;
}) {
  const r = 52;
  const C = 2 * Math.PI * r;

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-8">
      {/* SVG donut */}
      <div className="relative h-40 w-40 flex-shrink-0">
        <svg viewBox="0 0 130 130" className="h-full w-full -rotate-90">
          {/* Track */}
          <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="12" />

          {/* Positive arc */}
          <motion.circle
            cx="65"
            cy="65"
            r={r}
            fill="none"
            stroke="#34d399"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${(positive / 100) * C} ${C}`}
            initial={{ strokeDasharray: `0 ${C}` }}
            animate={{ strokeDasharray: `${(positive / 100) * C} ${C}` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />

          {/* Neutral arc */}
          <motion.circle
            cx="65"
            cy="65"
            r={r}
            fill="none"
            stroke="#71717a"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${(neutral / 100) * C} ${C}`}
            transform={`rotate(${positive * 3.6} 65 65)`}
            initial={{ strokeDasharray: `0 ${C}` }}
            animate={{ strokeDasharray: `${(neutral / 100) * C} ${C}` }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          />

          {/* Negative arc */}
          <motion.circle
            cx="65"
            cy="65"
            r={r}
            fill="none"
            stroke="#fb7185"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${(negative / 100) * C} ${C}`}
            transform={`rotate(${(positive + neutral) * 3.6} 65 65)`}
            initial={{ strokeDasharray: `0 ${C}` }}
            animate={{ strokeDasharray: `${(negative / 100) * C} ${C}` }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
          <span className="text-3xl font-bold tabular-nums text-white">
            {positive.toFixed(0)}%
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            Positive
          </span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="flex flex-col gap-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="text-zinc-400">Positive</span>
          <span className="ml-auto font-semibold tabular-nums text-white">{positive.toFixed(1)}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-500" />
          <span className="text-zinc-400">Neutral</span>
          <span className="ml-auto font-semibold tabular-nums text-white">{neutral.toFixed(1)}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          <span className="text-zinc-400">Negative</span>
          <span className="ml-auto font-semibold tabular-nums text-white">{negative.toFixed(1)}%</span>
        </div>
        <div className="mt-1 border-t border-white/[0.06] pt-2">
          <div className="text-xs text-zinc-500">{total.toLocaleString()} items analyzed</div>
          <div className="mt-1 inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
            {mood}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Timeline chart --------------------------------------------- */

function TimelineChart({ timeline }: { timeline: TimelinePoint[] }) {
  if (timeline.length < 2) return null;

  const W = 440;
  const H = 160;
  const pad = { top: 20, right: 16, bottom: 28, left: 36 };
  const cW = W - pad.left - pad.right;
  const cH = H - pad.top - pad.bottom;

  const toPoint = (pct: number, i: number) => ({
    x: pad.left + (i / (timeline.length - 1)) * cW,
    y: pad.top + cH - (pct / 100) * cH,
  });

  const posPoints = timeline.map((p, i) => toPoint(p.positive_pct, i));
  const negPoints = timeline.map((p, i) => toPoint(p.negative_pct, i));

  const toPath = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");

  const posPath = toPath(posPoints);
  const negPath = toPath(negPoints);

  const areaPath =
    posPath +
    ` L ${posPoints[posPoints.length - 1].x.toFixed(1)} ${(pad.top + cH).toFixed(1)}` +
    ` L ${posPoints[0].x.toFixed(1)} ${(pad.top + cH).toFixed(1)} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet">
      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map((pct) => {
        const y = pad.top + cH - (pct / 100) * cH;
        return (
          <g key={pct}>
            <line x1={pad.left} y1={y} x2={W - pad.right} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
            <text x={pad.left - 6} y={y + 3} textAnchor="end" fill="#52525b" fontSize="8">
              {pct}
            </text>
          </g>
        );
      })}

      {/* Area fill */}
      <motion.path
        d={areaPath}
        fill="url(#tl-gradient)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />

      {/* Positive line */}
      <motion.path
        d={posPath}
        fill="none"
        stroke="#34d399"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      {/* Negative line */}
      <motion.path
        d={negPath}
        fill="none"
        stroke="#fb7185"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="4 3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
      />

      {/* Dots on positive line */}
      {posPoints.map((p, i) => (
        <motion.circle
          key={`pos-${i}`}
          cx={p.x}
          cy={p.y}
          r="3"
          fill="#34d399"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 + i * 0.06, duration: 0.3 }}
        />
      ))}

      {/* Legend */}
      <circle cx={W - pad.right - 90} cy={H - 10} r="4" fill="#34d399" />
      <text x={W - pad.right - 82} y={H - 6} fill="#a1a1aa" fontSize="9">
        Positive
      </text>
      <circle cx={W - pad.right - 35} cy={H - 10} r="4" fill="#fb7185" />
      <text x={W - pad.right - 27} y={H - 6} fill="#a1a1aa" fontSize="9">
        Negative
      </text>

      <defs>
        <linearGradient id="tl-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ---- AI summary with typing effect ------------------------------ */

function AISummaryCard({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setComplete(false);
    let i = 0;
    const id = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setComplete(true);
        clearInterval(id);
      }
    }, 18);
    return () => clearInterval(id);
  }, [text]);

  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-400">
        <Sparkles className="h-4 w-4 text-amber-400" />
        AI Match Summary
      </div>
      <p className="text-sm leading-relaxed text-zinc-300">
        {displayed}
        {!complete && (
          <motion.span
            className="inline-block text-emerald-400"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          >
            ▌
          </motion.span>
        )}
      </p>
      {complete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-[10px] text-zinc-600"
        >
          Generated {timeAgo(new Date().toISOString())}
        </motion.div>
      )}
    </div>
  );
}

/* ---- Trending players ------------------------------------------- */

function TrendingPlayers({ players }: { players: TopPlayer[] }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-400">
        <Users className="h-4 w-4 text-cyan-400" />
        Trending Players
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {players.slice(0, 6).map((p, i) => {
          const isPositive = p.avg_sentiment_score >= 0.5;
          return (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.4 }}
              className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 transition-colors hover:border-white/[0.12]"
            >
              <div className="text-sm font-semibold text-white truncate">{p.name}</div>
              <div className="mt-1 flex items-center justify-between text-xs">
                <span className="text-zinc-500">{p.mentions} mentions</span>
                <span
                  className={`font-semibold tabular-nums ${
                    isPositive ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {isPositive ? "▲" : "▼"} {(p.avg_sentiment_score * 100).toFixed(0)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ---- Keyword pills ---------------------------------------------- */

function KeywordPills({ keywords }: { keywords: string[] }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-400">
        <Hash className="h-4 w-4 text-violet-400" />
        Top Keywords
      </div>
      <div className="flex flex-wrap gap-2">
        {keywords.map((kw, i) => (
          <motion.span
            key={kw}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 * i, duration: 0.3 }}
            className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs font-medium text-zinc-300 transition-colors hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-300"
          >
            {kw}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

/* ---- Headline feed ---------------------------------------------- */

function HeadlineFeed({ items }: { items: ContentItemData[] }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-400">
        <Activity className="h-4 w-4 text-emerald-400" />
        Live Headlines
      </div>
      <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1 scrollbar-hide">
        {items.map((item, i) => {
          const src = SOURCE_STYLE[item.source] ?? SOURCE_STYLE.bbc;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 * i, duration: 0.3 }}
              className={`group rounded-lg border-l-2 ${SENTIMENT_BORDER[item.sentiment]} border border-white/[0.04] bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]`}
            >
              <div className="flex items-start gap-3">
                {/* Sentiment dot */}
                <span className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${SENTIMENT_DOT[item.sentiment]}`} />

                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug text-zinc-200">{item.text}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span className={`inline-flex rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${src.bg}`}>
                      {src.label}
                    </span>
                    <span className="text-[10px] text-zinc-600">{timeAgo(item.published_at)}</span>
                    {item.url !== "#" && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <ExternalLink className="h-3 w-3 text-zinc-600 hover:text-white" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ---- Loading skeleton ------------------------------------------- */

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-white/[0.04] ${className}`} />;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <Skeleton className="h-24 w-56" />
        <Skeleton className="h-24 w-56" />
        <Skeleton className="h-24 w-56" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
      <Skeleton className="h-80" />
    </div>
  );
}

/* ================================================================== */
/*  Main dashboard component                                          */
/* ================================================================== */

export default function FanPulseDashboard() {
  const [matches, setMatches] = useState<MatchInfo[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<MatchDetailResponse | null>(null);
  const [sentiment, setSentiment] = useState<SentimentResponse | null>(null);
  const [content, setContent] = useState<ContentResponse | null>(null);
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [isMock, setIsMock] = useState(false);
  const [loading, setLoading] = useState(true);

  /* -- Load matches on mount -------------------------------------- */
  useEffect(() => {
    fetchMatches().then(({ data, isMock: mock }) => {
      setMatches(data.matches);
      setIsMock(mock);
      if (data.matches.length > 0) {
        setSelectedId(data.matches[0].id);
      }
    });
  }, []);

  /* -- Load detail when match changes ----------------------------- */
  const loadMatchData = useCallback(async (matchId: string) => {
    setLoading(true);
    const [d, s, c, sm] = await Promise.all([
      fetchMatchDetail(matchId),
      fetchSentiment(matchId),
      fetchContent(matchId),
      fetchSummary(matchId),
    ]);
    setDetail(d.data);
    setSentiment(s.data);
    setContent(c.data);
    setSummary(sm.data);
    if (d.isMock) setIsMock(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedId) loadMatchData(selectedId);
  }, [selectedId, loadMatchData]);

  /* -- Polling for live updates ----------------------------------- */
  useEffect(() => {
    if (!selectedId || isMock) return;
    const id = setInterval(() => loadMatchData(selectedId), 30_000);
    return () => clearInterval(id);
  }, [selectedId, isMock, loadMatchData]);

  /* -- Derive current team sentiment ------------------------------ */
  const teamEntries = sentiment ? Object.entries(sentiment.teams) : [];

  return (
    <div className="min-h-screen bg-[#050a0f]">
      {/* Background glow effects */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-emerald-500/[0.04] blur-[150px]" />
        <div className="absolute right-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-cyan-500/[0.03] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ---- Header ---- */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Fan{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Pulse
              </span>
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Real-time football sentiment intelligence
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isMock ? (
              <MockBanner />
            ) : (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
                <Wifi className="h-3.5 w-3.5" />
                Connected to API
              </div>
            )}
          </div>
        </div>

        {/* ---- Match selector ---- */}
        <div className="mb-8">
          <MatchSelector
            matches={matches}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>

        {/* ---- Main content ---- */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DashboardSkeleton />
            </motion.div>
          ) : (
            <motion.div
              key={selectedId}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="space-y-6"
            >
              {/* Row 1: Sentiment Gauge + Timeline */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Sentiment overview card */}
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm">
                  <div className="mb-4 flex items-center gap-2 text-sm font-medium text-zinc-400">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                    Overall Sentiment
                  </div>
                  {detail && (
                    <SentimentDonut
                      positive={detail.overall_sentiment.positive_pct}
                      neutral={detail.overall_sentiment.neutral_pct}
                      negative={detail.overall_sentiment.negative_pct}
                      mood={detail.overall_sentiment.mood_label}
                      total={detail.overall_sentiment.total_items}
                    />
                  )}

                  {/* Team breakdown */}
                  {teamEntries.length > 0 && (
                    <div className="mt-6 space-y-3 border-t border-white/[0.06] pt-4">
                      <div className="text-xs font-medium uppercase tracking-wider text-zinc-600">
                        Team Breakdown
                      </div>
                      {teamEntries.map(([team, ts]) => (
                        <div key={team} className="flex items-center gap-3">
                          <span className="w-28 truncate text-sm text-zinc-300">
                            {team}
                          </span>
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.04]">
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                              initial={{ width: "0%" }}
                              animate={{ width: `${ts.positive_pct}%` }}
                              transition={{ duration: 1.2, ease: "easeOut" }}
                            />
                          </div>
                          <span className="w-12 text-right text-xs font-semibold tabular-nums text-emerald-400">
                            {ts.positive_pct}%
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Timeline card */}
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm">
                  <div className="mb-4 flex items-center gap-2 text-sm font-medium text-zinc-400">
                    <Activity className="h-4 w-4 text-teal-400" />
                    Sentiment Timeline
                  </div>
                  {sentiment && <TimelineChart timeline={sentiment.timeline} />}
                </div>
              </div>

              {/* Row 2: AI Summary + Trending Players */}
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm">
                  {summary && <AISummaryCard text={summary.summary.text} />}
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm">
                  {sentiment && <TrendingPlayers players={sentiment.top_players} />}
                </div>
              </div>

              {/* Row 3: Keywords */}
              {sentiment && sentiment.top_keywords.length > 0 && (
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm">
                  <KeywordPills keywords={sentiment.top_keywords} />
                </div>
              )}

              {/* Row 4: Live headlines */}
              {content && content.items.length > 0 && (
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm">
                  <HeadlineFeed items={content.items} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
