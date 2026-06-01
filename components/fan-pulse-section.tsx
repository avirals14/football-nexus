"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useInView,
  type Variants,
} from "framer-motion";
import {
  Activity,
  TrendingUp,
  Heart,
  Zap,
  Clock,
  Circle,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Animated counter hook replacement — pure Framer Motion approach    */
/* ------------------------------------------------------------------ */

function AnimatedNumber({ value, delay = 0 }: { value: number; delay?: number }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      <motion.span
        initial={{ "--num": 0 } as Record<string, number>}
        animate={{ "--num": value } as Record<string, number>}
        transition={{ duration: 1.8, delay, ease: "easeOut" }}
        style={{
          counterSet: "num var(--num)",
        }}
        className="tabular-nums [counter-set:num_var(--num)] before:content-[counter(num)]"
      />
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/*  Data                                                              */
/* ------------------------------------------------------------------ */

const trendingTopics = ["#Messi", "#Scaloni", "#Penalty", "#WorldCup", "#MatchDay"];

const matchEvents = [
  { time: "23'", event: "⚽ Goal", detail: "Messi", color: "text-emerald-400" },
  { time: "37'", event: "⚽ Goal", detail: "Vinícius Jr.", color: "text-sky-400" },
  { time: "45'", event: "🟨 Yellow Card", detail: "Casemiro", color: "text-amber-400" },
  { time: "58'", event: "⚽ Goal", detail: "Álvarez", color: "text-emerald-400" },
];

/* SVG sentiment line path — a stylised mini-chart */
const sentimentPath =
  "M 0 40 C 15 38, 25 30, 40 28 S 65 18, 80 22 S 105 10, 120 14 S 145 8, 160 6 S 185 10, 200 8";

const sentimentPathBrazil =
  "M 0 28 C 15 30, 25 34, 40 36 S 65 32, 80 38 S 105 40, 120 42 S 145 44, 160 46 S 185 42, 200 44";

/* ------------------------------------------------------------------ */
/*  Variants                                                          */
/* ------------------------------------------------------------------ */

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const barGrow = (pct: number): Variants => ({
  hidden: { width: "0%" },
  show: {
    width: `${pct}%`,
    transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1] as const },
  },
});

/* ------------------------------------------------------------------ */
/*  Floating decorative dots                                          */
/* ------------------------------------------------------------------ */

function FloatingDots() {
  const dots = [
    { x: "8%", y: "18%", size: 4, delay: 0 },
    { x: "92%", y: "22%", size: 3, delay: 0.5 },
    { x: "5%", y: "70%", size: 5, delay: 1 },
    { x: "88%", y: "75%", size: 3, delay: 0.8 },
    { x: "15%", y: "90%", size: 4, delay: 1.3 },
    { x: "82%", y: "12%", size: 3, delay: 0.3 },
    { x: "50%", y: "5%", size: 3, delay: 0.7 },
    { x: "72%", y: "92%", size: 4, delay: 1.1 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((d, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-emerald-400/30"
          style={{ left: d.x, top: d.y, width: d.size, height: d.size }}
          animate={{
            y: [0, -10, 0, 10, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            delay: d.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Mini floating chart decorations */}
      <motion.svg
        className="absolute left-[3%] top-[40%] opacity-20"
        width="60"
        height="30"
        viewBox="0 0 60 30"
        animate={{ y: [0, -6, 0], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <polyline
          points="0,25 10,18 20,22 30,12 40,16 50,8 60,10"
          fill="none"
          stroke="rgb(52,211,153)"
          strokeWidth="1.5"
        />
      </motion.svg>

      <motion.svg
        className="absolute right-[4%] bottom-[35%] opacity-20"
        width="50"
        height="28"
        viewBox="0 0 50 28"
        animate={{ y: [0, 8, 0], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 7, repeat: Infinity, delay: 1, ease: "easeInOut" }}
      >
        <polyline
          points="0,20 8,14 18,18 28,8 38,12 50,6"
          fill="none"
          stroke="rgb(56,189,248)"
          strokeWidth="1.5"
        />
      </motion.svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main section                                                      */
/* ------------------------------------------------------------------ */

export default function FanPulseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  // Start/stops live simulation when section enters viewport
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });

  const [argSentiment, setArgSentiment] = useState(78);
  const [braSentiment, setBraSentiment] = useState(52);
  const [eventsState, setEventsState] = useState(() => [...matchEvents]);

  // Lightweight live simulation: tweak percentages and occasionally push an event
  useEffect(() => {
    if (!isInView) return;

    const sentimentInterval = setInterval(() => {
      setArgSentiment((prev) => Math.max(30, Math.min(95, prev + Math.round(Math.random() * 6 - 3))));
      setBraSentiment((prev) => Math.max(25, Math.min(90, prev + Math.round(Math.random() * 6 - 3))));
    }, 2500);

    const eventsInterval = setInterval(() => {
      const choices = [
        { event: "⚽ Goal", color: "text-emerald-400", details: ["Messi", "Álvarez", "Di María", "L. Martínez"] },
        { event: "🟨 Yellow Card", color: "text-amber-400", details: ["Casemiro", "Rodríguez", "Lo Celso"] },
        { event: "🔁 Substitution", color: "text-sky-400", details: ["F. replaces G", "H replaces I", "J replaces K"] },
      ];
      const choice = choices[Math.floor(Math.random() * choices.length)];
      const detail = choice.details[Math.floor(Math.random() * choice.details.length)];

      setEventsState((prev) => {
        const minutes = prev.map((e) => parseInt(e.time.replace("'", ""))).filter(Boolean);
        const maxMinute = minutes.length ? Math.max(...minutes) : 66;
        const minute = Math.min(90, maxMinute + Math.floor(Math.random() * 4) + 1);
        const newEvent = { time: `${minute}'`, event: choice.event, detail, color: choice.color };
        return [newEvent, ...prev].slice(0, 8);
      });
    }, 12000);

    return () => {
      clearInterval(sentimentInterval);
      clearInterval(eventsInterval);
    };
  }, [isInView]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black px-4 py-24 sm:px-6 md:py-32 lg:px-8"
    >
      {/* Background radial glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-sky-500/8 blur-[100px]" />
      </div>

      <FloatingDots />

      {/* ---- Header ---- */}
      <motion.div
        className="relative z-10 mx-auto mb-16 max-w-2xl text-center"
        variants={container}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
      >
        <motion.div variants={fadeUp} className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-400">
          <Activity className="h-3.5 w-3.5" />
          Real-time Analytics
        </motion.div>

        <motion.h2
          variants={fadeUp}
          className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          Live Fan{" "}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
            Pulse
          </span>
        </motion.h2>

        <motion.p variants={fadeUp} className="text-lg text-zinc-400 sm:text-xl">
          Feel the heartbeat of every match
        </motion.p>
      </motion.div>

      {/* ---- Main Card ---- */}
      <motion.div
        className="relative z-10 mx-auto max-w-3xl"
        variants={container}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
      >
        {/* Gradient border glow */}
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-emerald-500/40 via-transparent to-sky-500/40 blur-sm" />

        <div className="relative rounded-2xl glass-card p-6 sm:p-8 md:p-10">
          {/* ---- Match header ---- */}
          <motion.div variants={fadeUp} className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            {/* LIVE badge */}
            <div className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-red-400">
              <motion.span
                className="inline-block h-2 w-2 rounded-full bg-red-500"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              />
              Live
            </div>

            <div className="flex items-center gap-1.5 text-sm text-zinc-500">
              <Clock className="h-3.5 w-3.5" />
              67&apos; &mdash; 2nd Half
            </div>
          </motion.div>

          {/* ---- Scoreboard ---- */}
          <motion.div variants={fadeUp} className="mb-10 flex items-center justify-center gap-4 sm:gap-8">
            {/* Argentina */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl sm:text-4xl">🇦🇷</span>
              <span className="text-sm font-medium text-zinc-300 sm:text-base">Argentina</span>
            </div>

            {/* Score */}
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-extrabold tabular-nums text-white sm:text-6xl">2</span>
              <span className="text-2xl font-light text-zinc-600 sm:text-3xl">&ndash;</span>
              <span className="text-5xl font-extrabold tabular-nums text-white sm:text-6xl">1</span>
            </div>

            {/* Brazil */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl sm:text-4xl">🇧🇷</span>
              <span className="text-sm font-medium text-zinc-300 sm:text-base">Brazil</span>
            </div>
          </motion.div>

          {/* ---- Sentiment bars ---- */}
          <motion.div variants={fadeUp} className="mb-8 space-y-5">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-400">
              <Heart className="h-4 w-4 text-emerald-400" />
              Fan Sentiment
            </div>

            {/* Argentina bar */}
            <div>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-zinc-300">🇦🇷 Argentina</span>
                <span aria-live="polite" aria-atomic="true" className="font-semibold tabular-nums text-emerald-400">
                  {isInView ? <AnimatedNumber value={argSentiment} delay={0.4} /> : "0"}%
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]"
                  variants={barGrow(78)}
                  initial="hidden"
                  animate={isInView ? "show" : "hidden"}
                />
              </div>
            </div>

            {/* Brazil bar */}
            <div>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-zinc-300">🇧🇷 Brazil</span>
                <span aria-live="polite" aria-atomic="true" className="font-semibold tabular-nums text-sky-400">
                  {isInView ? <AnimatedNumber value={braSentiment} delay={0.6} /> : "0"}%
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-sky-500 to-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.5)]"
                  variants={barGrow(52)}
                  initial="hidden"
                  animate={isInView ? "show" : "hidden"}
                />
              </div>
            </div>
          </motion.div>

          {/* ---- Sentiment chart ---- */}
          <motion.div variants={fadeUp} className="mb-8 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-400">
              <TrendingUp className="h-4 w-4 text-teal-400" />
              Sentiment Over Time
            </div>
            <svg
              viewBox="0 0 200 55"
              className="w-full"
              preserveAspectRatio="none"
            >
              {/* Grid lines */}
              {[15, 30, 45].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="200"
                  y2={y}
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth="0.5"
                />
              ))}

              {/* Argentina line */}
              <motion.path
                d={sentimentPath}
                fill="none"
                stroke="url(#grad-arg)"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                transition={{ duration: 2, delay: 0.6, ease: "easeOut" }}
              />

              {/* Brazil line */}
              <motion.path
                d={sentimentPathBrazil}
                fill="none"
                stroke="url(#grad-bra)"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                transition={{ duration: 2, delay: 0.8, ease: "easeOut" }}
              />

              {/* Glow under Argentina line */}
              <motion.path
                d={sentimentPath + " L 200 55 L 0 55 Z"}
                fill="url(#fill-arg)"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 0.15 } : { opacity: 0 }}
                transition={{ duration: 2, delay: 1 }}
              />

              <defs>
                <linearGradient id="grad-arg" x1="0" y1="0" x2="200" y2="0">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#2dd4bf" />
                </linearGradient>
                <linearGradient id="grad-bra" x1="0" y1="0" x2="200" y2="0">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#7dd3fc" />
                </linearGradient>
                <linearGradient id="fill-arg" x1="0" y1="0" x2="0" y2="55">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>

            <div className="mt-2 flex items-center justify-center gap-6 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                Argentina
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-sky-400" />
                Brazil
              </span>
            </div>
          </motion.div>

          {/* ---- Match events timeline ---- */}
          <motion.div variants={fadeUp} className="mb-8 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-400">
              <Zap className="h-4 w-4 text-amber-400" />
              Match Events
            </div>

            <div className="space-y-3">
              {eventsState.map((ev, i) => (
                <motion.div
                  key={`${ev.time}-${i}`}
                  className="flex items-center gap-3 text-sm"
                  initial={{ opacity: 0, x: -16 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
                  transition={{ duration: 0.4, delay: 1 + i * 0.12 }}
                >
                  <span className="w-9 shrink-0 text-right font-mono text-xs text-zinc-500">
                    {ev.time}
                  </span>
                  <span className="h-px w-4 bg-white/10" />
                  <Circle className="h-2 w-2 shrink-0 fill-current text-white/20" />
                  <span className={`font-medium ${ev.color}`}>{ev.event}</span>
                  <span className="text-zinc-400">&mdash; {ev.detail}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ---- Trending topics ---- */}
          <motion.div variants={fadeUp}>
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-400">
              <TrendingUp className="h-4 w-4 text-violet-400" />
              Trending Topics
            </div>

            <div className="flex flex-wrap gap-2">
              {trendingTopics.map((tag, i) => (
                <motion.span
                  key={tag}
                  className="cursor-default rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-medium text-zinc-300 transition-colors hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-300"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: 1.4 + i * 0.08 }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
