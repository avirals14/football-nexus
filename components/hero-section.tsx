"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Globe, TrendingUp } from "lucide-react";

// ---------------------------------------------------------------------------
// Floating Particles Background
// ---------------------------------------------------------------------------
function Particles() {
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; size: number; duration: number; delay: number; opacity: number }[]
  >([]);

  useEffect(() => {
    // Slightly fewer, softer particles for premium minimalism
    const generated = Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 0.6,
      duration: Math.random() * 18 + 10,
      delay: Math.random() * 8,
      opacity: Math.random() * 0.35 + 0.06,
    }));
    setParticles(generated);
  }, []);

  if (!particles.length) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background:
              p.id % 3 === 0
                ? "rgba(0,255,135,0.48)"
                : p.id % 3 === 1
                ? "rgba(0,212,255,0.38)"
                : "rgba(255,255,255,0.12)",
            filter: "blur(6px)",
          }}
          animate={{
            y: [0, -36 + (p.size || 0), 0],
            x: [0, p.id % 2 === 0 ? 18 : -18, 0],
            opacity: [p.opacity, p.opacity * 1.6, p.opacity],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: [0.2, 0.9, 0.2, 1],
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Animated grid background with neon edge pulses
// ---------------------------------------------------------------------------
function AnimatedGrid() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Vertical lines */}
      {Array.from({ length: 9 }).map((_, i) => (
        <motion.div
          key={`v-${i}`}
          className="absolute top-0 h-full"
          style={{
            left: `${(i + 1) * (100 / 10)}%`,
            width: "1px",
            background:
              "linear-gradient(180deg, transparent, rgba(0,255,135,0.04) 30%, rgba(0,212,255,0.03) 70%, transparent)",
          }}
          animate={{ opacity: [0.28, 0.56, 0.28] }}
          transition={{
            duration: 6 + i * 0.6,
            repeat: Infinity,
            ease: [0.2, 0.9, 0.2, 1],
          }}
        />
      ))}

      {/* Horizontal lines */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={`h-${i}`}
          className="absolute left-0 w-full"
          style={{
            top: `${(i + 1) * (100 / 6)}%`,
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(0,212,255,0.04) 30%, rgba(0,255,135,0.03) 70%, transparent)",
          }}
          animate={{ opacity: [0.15, 0.45, 0.15] }}
          transition={{
            duration: 6 + i * 0.6,
            repeat: Infinity,
            ease: [0.2, 0.9, 0.2, 1],
          }}
        />
      ))}

      {/* Soft neon edge glows */}
      <motion.div
        className="absolute top-0 left-0 h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, #00ff87 40%, #00d4ff 60%, transparent)",
        }}
        animate={{ opacity: [0.08, 0.36, 0.08] }}
        transition={{ duration: 10, repeat: Infinity, ease: [0.2, 0.9, 0.2, 1] }}
      />
      <motion.div
        className="absolute bottom-0 left-0 h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, #00d4ff 40%, #00ff87 60%, transparent)",
        }}
        animate={{ opacity: [0.06, 0.28, 0.06] }}
        transition={{ duration: 12, repeat: Infinity, ease: [0.2, 0.9, 0.2, 1] }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Football-inspired abstract SVG
// ---------------------------------------------------------------------------
function FootballAbstract() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-0 flex items-center justify-center opacity-60">
      <svg
        width="1600"
        height="900"
        viewBox="0 0 1600 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full select-none"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0%" stopColor="#001217" stopOpacity="0" />
            <stop offset="60%" stopColor="#002b2a" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#00363d" stopOpacity="0.08" />
          </linearGradient>
          <radialGradient id="g2" cx="0.3" cy="0.2" r="0.8">
            <stop offset="0%" stopColor="#00ff87" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
          </radialGradient>
          <pattern id="hex" width="40" height="34" patternUnits="userSpaceOnUse">
            <path d="M20 0 L40 10 L40 24 L20 34 L0 24 L0 10 Z" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.6" />
          </pattern>
        </defs>

        {/* Swoosh layers */}
        <g opacity="0.8">
          <path d="M0 480 C300 300, 600 540, 900 420 C1200 300, 1400 380, 1600 240 L1600 900 L0 900 Z" fill="url(#g1)" />
          <ellipse cx="1200" cy="180" rx="420" ry="220" fill="url(#g2)" />
        </g>

        {/* Subtle hex pattern */}
        <rect x="0" y="0" width="1600" height="900" fill="url(#hex)" opacity="0.06" />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Floating preview cards
// ---------------------------------------------------------------------------
function FloatingCard({
  children,
  className = "",
  delay = 0,
  x = 0,
  y = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  x?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={`absolute rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 shadow-2xl backdrop-blur-xl ${className}`}
      initial={{ opacity: 0, scale: 0.8, x, y }}
      animate={{ opacity: 1, scale: 1, x, y }}
      transition={{ duration: 1, delay, ease: "easeOut" }}
    >
      {/* Bobbing animation */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 5 + delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function MatchScoreCard() {
  return (
    <div className="min-w-[180px] space-y-2">
      <div className="flex items-center gap-1.5 text-[10px] font-medium tracking-widest text-emerald-400 uppercase">
        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
        Live
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🇦🇷</span>
          <span className="text-sm font-semibold text-white">ARG</span>
        </div>
        <div className="rounded-lg bg-white/[0.08] px-3 py-1 font-mono text-lg font-bold text-white tabular-nums">
          2 <span className="text-white/30">-</span> 1
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">BRA</span>
          <span className="text-lg">🇧🇷</span>
        </div>
      </div>
      <div className="text-center text-[10px] text-white/40">78&apos; • 2nd Half</div>
    </div>
  );
}

function SentimentGauge() {
  return (
    <div className="min-w-[150px] space-y-2">
      <div className="flex items-center gap-1.5 text-[10px] font-medium tracking-widest text-cyan-400 uppercase">
        <TrendingUp className="h-3 w-3" />
        Sentiment
      </div>
      <div className="flex items-center gap-2">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #00ff87, #00d4ff)",
            }}
            initial={{ width: "0%" }}
            animate={{ width: "78%" }}
            transition={{ duration: 2, delay: 1.5, ease: "easeOut" }}
          />
        </div>
        <span className="text-xs font-semibold text-emerald-400">78%</span>
      </div>
      <div className="text-[10px] text-white/40">Fan positivity index</div>
    </div>
  );
}

function StatsCard() {
  return (
    <div className="min-w-[150px] space-y-2">
      <div className="flex items-center gap-1.5 text-[10px] font-medium tracking-widest text-violet-400 uppercase">
        <Zap className="h-3 w-3" />
        Stats
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <span className="text-white/50">Possession</span>
        <span className="text-right font-semibold text-white">62%</span>
        <span className="text-white/50">xG</span>
        <span className="text-right font-semibold text-white">2.4</span>
        <span className="text-white/50">Passes</span>
        <span className="text-right font-semibold text-white">547</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Hero Section
// ---------------------------------------------------------------------------
export function HeroSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section id="hero" aria-label="Hero" className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
      {/* ── Background layers ─────────────────────────────────── */}
      {/* Dark base */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "#050a0f" }}
      />

      {/* Radial gradient glow behind content */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 45%, rgba(0,255,135,0.08) 0%, rgba(0,212,255,0.05) 40%, transparent 70%)",
        }}
      />

      {/* Secondary subtle glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(0,212,255,0.06) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(0,255,135,0.04) 0%, transparent 50%)",
        }}
      />

      <AnimatedGrid />
      <Particles />
      <FootballAbstract />

      {/* ── Content ───────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-28 sm:px-8 lg:py-32">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 90, damping: 20 }}
            className="mb-10 inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-5 py-2 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-medium tracking-wide text-white/70">
              Building for 2026 World Cup
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 96, damping: 22, delay: 0.12 }}
            className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
          >
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #00ff87 0%, #00d4ff 50%, #60efff 100%)",
              }}
            >
              Football Nexus
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 78, damping: 18, delay: 0.26 }}
            className="mt-4 text-lg font-normal tracking-wide text-white/70 sm:text-xl md:text-2xl"
          >
            The Operating System for Football Fans
          </motion.p>

          {/* Supporting paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 70, damping: 16, delay: 0.42 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/45 sm:text-lg"
          >
            Real-time match intelligence, AI-powered fan sentiment, deep
            analytics, and a global community — all in one beautifully crafted
            platform launching for the 2026 World Cup.
          </motion.p>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.56 }}
            className="mt-12 flex w-full flex-col items-center gap-4 sm:gap-6"
          >
            {/* Email + Join Waitlist */}
            <form
              id="waitlist"
              aria-label="Join waitlist"
              onSubmit={handleSubmit}
              className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                  className="h-14 w-full rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 text-sm text-white placeholder-white/30 outline-none backdrop-blur-md transition-colors focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30"
                />
              </div>
              <button
                type="submit"
                disabled={submitted}
                className="group relative h-14 cursor-pointer overflow-hidden rounded-2xl px-7 text-sm font-semibold text-white transition-transform transform-gpu hover:-translate-y-0.5 disabled:cursor-default"
                style={{
                  background: submitted
                    ? "linear-gradient(135deg, rgba(0,255,135,0.95), rgba(0,212,255,0.95))"
                    : "linear-gradient(135deg, rgba(0,255,135,0.95), rgba(0,184,107,0.95))",
                  boxShadow: submitted
                    ? "0 8px 30px rgba(0,255,135,0.14), 0 2px 8px rgba(0,212,255,0.06)"
                    : "0 6px 30px rgba(0,255,135,0.08), inset 0 -2px 8px rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {/* Glow effect */}
                <span
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                  style={{
                    boxShadow: "0 0 40px rgba(0,255,135,0.28), 0 0 80px rgba(0,212,255,0.14)",
                  }}
                />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {submitted ? (
                    "You're on the list! 🎉"
                  ) : (
                    <>
                      Join Waitlist
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </span>
              </button>
            </form>

            <div role="status" aria-live="polite" className="sr-only">
              {submitted ? "You're on the waitlist. Thanks!" : "Join the waitlist"}
            </div>

            {/* Secondary CTA */}
            <a
              href="#roadmap"
              className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-transparent px-6 py-3 text-sm font-medium text-white/70 transition-all hover:border-white/20 hover:text-white"
            >
              <Globe className="h-4 w-4 text-cyan-400 opacity-70 transition-opacity group-hover:opacity-100" />
              Explore Roadmap
            </a>
          </motion.div>
        </div>

        {/* ── Floating Preview Cards ──────────────────────────── */}
        {/* Shown on lg+ screens only — positioned around the hero content */}
        <div className="pointer-events-none hidden lg:block">
          {/* Match Score – upper-left area */}
          <FloatingCard
            className="top-8 left-0 xl:-left-6"
            delay={0.9}
          >
            <MatchScoreCard />
          </FloatingCard>

          {/* Sentiment Gauge – right side */}
          <FloatingCard
            className="top-16 right-0 xl:-right-6"
            delay={1.1}
          >
            <SentimentGauge />
          </FloatingCard>

          {/* Stats – lower-left area */}
          <FloatingCard
            className="bottom-14 right-16 xl:right-28"
            delay={1.3}
          >
            <StatsCard />
          </FloatingCard>
        </div>

        {/* Mobile preview cards – stack horizontally below CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 72, damping: 16, delay: 0.92 }}
          className="mt-20 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:hidden"
        >
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-xl">
            <MatchScoreCard />
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-xl">
            <SentimentGauge />
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-xl">
            <StatsCard />
          </div>
        </motion.div>
      </div>

      {/* ── Bottom fade ───────────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 h-40 w-full"
        style={{
          background:
            "linear-gradient(to top, #050a0f, transparent)",
        }}
      />
    </section>
  );
}
