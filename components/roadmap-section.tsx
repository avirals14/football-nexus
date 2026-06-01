"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Loader,
  Trophy,
  Rocket,
  Zap,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

type PhaseStatus = "completed" | "in-progress" | "upcoming";

interface Phase {
  number: number;
  codename: string;
  description: string;
  status: PhaseStatus;
  icon: React.ReactNode;
  worldCup?: boolean;
}

const phases: Phase[] = [
  {
    number: 0,
    codename: "Genesis",
    description: "Landing page and public launch",
    status: "completed",
    icon: <CheckCircle2 className="h-5 w-5" />,
  },
  {
    number: 1,
    codename: "Foundation",
    description: "Live scores, schedules, and match data",
    status: "in-progress",
    icon: <Loader className="h-5 w-5" />,
  },
  {
    number: 2,
    codename: "Intelligence",
    description: "Fan sentiment analyzer and AI commentary",
    status: "upcoming",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    number: 3,
    codename: "Deep Analytics",
    description: "Player analytics and knowledge graph",
    status: "upcoming",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    number: 4,
    codename: "Community",
    description: "Trivia battles and fan communities",
    status: "upcoming",
    icon: <Rocket className="h-5 w-5" />,
  },
  {
    number: 5,
    codename: "Global Launch",
    description: "Mobile app and 2026 World Cup integration",
    status: "upcoming",
    icon: <Trophy className="h-5 w-5" />,
    worldCup: true,
  },
];

/* ------------------------------------------------------------------ */
/*  Status helpers                                                     */
/* ------------------------------------------------------------------ */

function statusBadge(status: PhaseStatus) {
  switch (status) {
    case "completed":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-400 ring-1 ring-emerald-500/30">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Completed
        </span>
      );
    case "in-progress":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold tracking-wide text-amber-400 ring-1 ring-amber-500/30">
          <Loader className="h-3.5 w-3.5 animate-spin" />
          In Progress
        </span>
      );
    case "upcoming":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold tracking-wide text-zinc-500 ring-1 ring-white/10">
          <Circle className="h-3.5 w-3.5" />
          Upcoming
        </span>
      );
  }
}

/* ------------------------------------------------------------------ */
/*  Node (dot on the timeline)                                         */
/* ------------------------------------------------------------------ */

function TimelineNode({ status }: { status: PhaseStatus }) {
  const base =
    "relative z-10 flex h-5 w-5 items-center justify-center rounded-full border-2";

  if (status === "completed") {
    return (
      <span className={`${base} border-emerald-400 bg-emerald-500 shadow-[0_0_14px_3px_rgba(16,185,129,.55)]`}>
        <CheckCircle2 className="h-3 w-3 text-white" />
      </span>
    );
  }

  if (status === "in-progress") {
    return (
      <span className={`${base} border-emerald-400 bg-emerald-500`}>
        {/* pulsing ring */}
        <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/40" />
        <span className="absolute -inset-1 animate-pulse rounded-full bg-cyan-400/20" />
        <span className="relative h-2 w-2 rounded-full bg-white" />
      </span>
    );
  }

  return (
    <span className={`${base} border-zinc-700 bg-zinc-800`}>
      <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Progress Ring (for in-progress phase)                              */
/* ------------------------------------------------------------------ */

function ProgressRing() {
  return (
    <div className="absolute -right-3 -top-3 h-12 w-12">
      <svg viewBox="0 0 48 48" className="h-full w-full -rotate-90">
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="3"
        />
        <motion.circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke="url(#progress-gradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={2 * Math.PI * 20}
          initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
          animate={{ strokeDashoffset: 2 * Math.PI * 20 * 0.65 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="progress-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-emerald-400">
        35%
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Celebration particles (for completed phase)                        */
/* ------------------------------------------------------------------ */

function CelebrationParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
      {[...Array(6)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-emerald-400"
          style={{
            left: `${15 + i * 14}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -12, 0],
            opacity: [0.7, 1, 0.4],
            scale: [1, 1.6, 1],
          }}
          transition={{
            duration: 2.5 + i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  World Cup Badge                                                    */
/* ------------------------------------------------------------------ */

function WorldCupBadge() {
  return (
    <motion.span
      className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 px-3 py-1 text-xs font-bold tracking-wide text-amber-300 ring-1 ring-amber-500/40"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <Trophy className="h-3.5 w-3.5 text-amber-400" />
      2026 World Cup
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/*  Phase Card                                                         */
/* ------------------------------------------------------------------ */

function PhaseCard({
  phase,
  index,
}: {
  phase: Phase;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const isLeft = index % 2 === 0; // alternate sides on desktop

  return (
    <div
      ref={ref}
      className={`relative grid grid-cols-[1fr] md:grid-cols-[1fr_auto_1fr] items-center gap-x-8 ${
        index !== phases.length - 1 ? "pb-14 md:pb-20" : ""
      }`}
    >
      {/* ---- desktop left column ---- */}
      <div
        className={`hidden md:flex ${
          isLeft ? "justify-end" : ""
        }`}
      >
        {isLeft && (
          <CardContent
            phase={phase}
            isInView={isInView}
            direction="left"
            index={index}
          />
        )}
      </div>

      {/* ---- node column ---- */}
      <div className="absolute left-4 top-0 flex md:relative md:left-auto md:flex-col md:items-center">
        <TimelineNode status={phase.status} />
      </div>

      {/* ---- desktop right column ---- */}
      <div className={`hidden md:flex ${!isLeft ? "" : ""}`}>
        {!isLeft && (
          <CardContent
            phase={phase}
            isInView={isInView}
            direction="right"
            index={index}
          />
        )}
      </div>

      {/* ---- mobile card (always right of the line) ---- */}
      <div className="ml-12 md:hidden">
        <CardContent
          phase={phase}
          isInView={isInView}
          direction="right"
          index={index}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Card inner content                                                 */
/* ------------------------------------------------------------------ */

function CardContent({
  phase,
  isInView,
  direction,
  index,
}: {
  phase: Phase;
  isInView: boolean;
  direction: "left" | "right";
  index: number;
}) {
  const xInitial = direction === "left" ? 60 : -60;

  return (
    <motion.div
      initial={{ opacity: 0, x: xInitial, y: 20 }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{
        duration: 0.65,
        delay: 0.15 * index,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      }}
      className={`relative w-full max-w-md rounded-2xl border border-white/[.07] bg-white/[.03] p-6 backdrop-blur-xl transition-colors hover:border-white/[.13] ${
        phase.status === "completed"
          ? "shadow-[0_0_30px_-6px_rgba(16,185,129,.18)]"
          : phase.status === "in-progress"
          ? "shadow-[0_0_30px_-6px_rgba(34,211,238,.14)]"
          : ""
      }`}
    >
      {/* celebration effect for completed */}
      {phase.status === "completed" && <CelebrationParticles />}

      {/* progress ring for in-progress */}
      {phase.status === "in-progress" && <ProgressRing />}

      {/* phase label */}
      <div className="mb-3 flex items-center gap-3">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${
            phase.status === "completed"
              ? "bg-emerald-500/15 text-emerald-400"
              : phase.status === "in-progress"
              ? "bg-cyan-500/15 text-cyan-400"
              : "bg-white/5 text-zinc-500"
          }`}
        >
          {phase.number}
        </span>
        <span
          className={`text-xs font-semibold uppercase tracking-widest ${
            phase.status === "completed"
              ? "text-emerald-400/80"
              : phase.status === "in-progress"
              ? "text-cyan-400/80"
              : "text-zinc-600"
          }`}
        >
          Phase {phase.number}
        </span>
      </div>

      {/* codename */}
      <h3
        className={`mb-1 text-lg font-bold ${
          phase.status === "upcoming" ? "text-zinc-400" : "text-white"
        }`}
      >
        {phase.codename}
      </h3>

      {/* description */}
      <p
        className={`mb-4 text-sm leading-relaxed ${
          phase.status === "upcoming"
            ? "text-zinc-600"
            : "text-zinc-400"
        }`}
      >
        {phase.description}
      </p>

      {/* badges */}
      <div className="flex flex-wrap items-center gap-2">
        {statusBadge(phase.status)}
        {phase.worldCup && <WorldCupBadge />}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Section                                                       */
/* ------------------------------------------------------------------ */

export default function RoadmapSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-60px" });

  return (
    <section
      id="roadmap"
      className="relative overflow-hidden bg-black py-24 md:py-32"
    >
      {/* ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2">
        <div className="h-[500px] w-[700px] rounded-full bg-emerald-500/[.04] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6">
        {/* ---- heading ---- */}
        <div ref={headingRef} className="mb-20 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400"
          >
            What&rsquo;s Next
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-4 text-4xl font-extrabold tracking-tight text-white md:text-5xl"
          >
            The Roadmap
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-lg text-base text-zinc-500"
          >
            Our journey to the 2026 World Cup
          </motion.p>
        </div>

        {/* ---- timeline container ---- */}
        <div ref={containerRef} className="relative">
          {/* vertical glowing line */}
          <div className="absolute left-[22px] top-0 h-full w-[2px] md:left-1/2 md:-translate-x-1/2">
            {/* background track */}
            <div className="h-full w-full rounded-full bg-white/[.06]" />
            {/* animated fill */}
            <motion.div
              className="absolute inset-x-0 top-0 w-full rounded-full bg-gradient-to-b from-emerald-400 via-emerald-500/60 to-transparent"
              style={{ height: lineHeight }}
            />
            {/* glow */}
            <motion.div
              className="absolute inset-x-0 top-0 w-full rounded-full bg-gradient-to-b from-emerald-400/50 via-emerald-500/20 to-transparent blur-sm"
              style={{ height: lineHeight }}
            />
          </div>

          {/* phase cards */}
          {phases.map((phase, i) => (
            <PhaseCard key={phase.number} phase={phase} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
