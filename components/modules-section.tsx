"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  type Variants,
} from "framer-motion";
import {
  Activity,
  MessageSquare,
  Target,
  Play,
  Brain,
  Code,
  ArrowUpRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface Module {
  title: string;
  description: string;
  icon: LucideIcon;
  /** Tailwind colour used for the icon ring + glow */
  accent: string;
  /** rgba / gradient stops for the hover‑glow border */
  glowFrom: string;
  glowTo: string;
  status?: "live" | "soon";
}

const modules: Module[] = [
  {
    title: "Live Fan Pulse",
    description: "Real-time sentiment analysis across millions of fans",
    icon: Activity,
    accent: "#22c55e",
    glowFrom: "rgba(34,197,94,0.6)",
    glowTo: "rgba(34,197,94,0.0)",
    status: "live",
  },
  {
    title: "AI Match Commentary",
    description: "AI-generated insights that rival expert analysis",
    icon: MessageSquare,
    accent: "#06b6d4",
    glowFrom: "rgba(6,182,212,0.6)",
    glowTo: "rgba(6,182,212,0.0)",
    status: "soon",
  },
  {
    title: "Match Predictor",
    description: "Simulate World Cup outcomes with machine learning",
    icon: Target,
    accent: "#3b82f6",
    glowFrom: "rgba(59,130,246,0.6)",
    glowTo: "rgba(59,130,246,0.0)",
    status: "soon",
  },
  {
    title: "Career Replay",
    description: "Explore legendary football careers visually",
    icon: Play,
    accent: "#8b5cf6",
    glowFrom: "rgba(139,92,246,0.6)",
    glowTo: "rgba(139,92,246,0.0)",
    status: "soon",
  },
  {
    title: "Football Knowledge Graph",
    description: "Ask football questions in natural language",
    icon: Brain,
    accent: "#a855f7",
    glowFrom: "rgba(168,85,247,0.6)",
    glowTo: "rgba(168,85,247,0.0)",
    status: "soon",
  },
  {
    title: "Developer API",
    description: "Open football intelligence for developers",
    icon: Code,
    accent: "#14b8a6",
    glowFrom: "rgba(20,184,166,0.6)",
    glowTo: "rgba(20,184,166,0.0)",
    status: "soon",
  },
];

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/* ------------------------------------------------------------------ */
/*  ModuleCard                                                         */
/* ------------------------------------------------------------------ */

function ModuleCard({ module }: { module: Module }) {
  const Icon = module.icon;

  return (
    <motion.div
      variants={cardVariants}
      className="group relative rounded-2xl p-[1px] transition-all duration-300"
      style={
        {
          /* resting border – very subtle gradient */
          background: `linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))`,
        }
      }
      whileHover={{
        y: -6,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
    >
      {/* Hover‑glow border overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `linear-gradient(135deg, ${module.glowFrom}, ${module.glowTo})`,
        }}
      />

      {/* Card inner */}
      <div className="relative flex h-full flex-col gap-4 rounded-2xl px-6 py-7 backdrop-blur-xl"
        style={{
          background: "rgba(15, 15, 20, 0.75)",
        }}
      >
        <div className="flex items-start justify-between">
          <div className="relative flex size-12 items-center justify-center rounded-full"
            style={{
              background: `rgba(${hexToRgb(module.accent)}, 0.12)`,
              boxShadow: `0 0 20px rgba(${hexToRgb(module.accent)}, 0.15)`,
            }}
          >
            <Icon
              className="size-5 transition-transform duration-300 group-hover:scale-110"
              style={{ color: module.accent }}
            />
            {/* Pulse ring on hover */}
            <span
              className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                boxShadow: `0 0 24px 4px rgba(${hexToRgb(module.accent)}, 0.35)`,
              }}
            />
          </div>
          {module.status === "soon" && (
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-white/50 backdrop-blur-sm">
              Coming Soon
            </div>
          )}
        </div>

        {/* Text */}
        <div className="flex flex-1 flex-col gap-1.5">
          <h3 className="text-base font-semibold tracking-tight text-white">
            {module.title}
          </h3>
          <p className="text-sm leading-relaxed text-neutral-400">
            {module.description}
          </p>
        </div>

        {/* Arrow indicator on hover */}
        <div className="flex items-center gap-1 text-xs font-medium opacity-0 transition-all duration-300 group-hover:opacity-100"
          style={{ color: module.accent }}
        >
          <span>Explore</span>
          <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export default function ModulesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden px-4 py-24 sm:px-6 md:py-32 lg:px-8"
      style={{ background: "linear-gradient(180deg, #09090b 0%, #0a0a0f 100%)" }}
    >
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
        style={{
          width: "800px",
          height: "500px",
          background:
            "radial-gradient(ellipse at center, rgba(59,130,246,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Heading */}
        <motion.div
          className="mb-16 text-center"
          variants={headingVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-400">
            Platform Modules
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Six engines powering the future
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {" "}of football intelligence
            </span>
          </h2>
        </motion.div>

        {/* Card grid */}
        <motion.div
          className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {modules.map((mod) => (
            <ModuleCard key={mod.title} module={mod} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Convert a hex colour like `#22c55e` → `34,197,94` for use in rgba() */
function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `${r},${g},${b}`;
}
