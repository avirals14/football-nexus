"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { Star, GitCommit, Users, FileText } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Animated counter — springs from 0 to `target` when scrolled in    */
/* ------------------------------------------------------------------ */
function AnimatedCounter({
  target,
  suffix = "",
  decimals = 0,
}: {
  target: number;
  suffix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, (v) =>
    decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString()
  );

  const [text, setText] = useState("0");

  useEffect(() => {
    if (isInView) spring.set(target);
  }, [isInView, spring, target]);

  useEffect(() => {
    const unsub = display.on("change", (v) => setText(String(v)));
    return unsub;
  }, [display]);

  return (
    <span ref={ref}>
      {text}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
const stats = [
  {
    icon: Star,
    label: "GitHub Stars",
    value: 127,
    suffix: "",
    extra: "+12 this week",
  },
  {
    icon: GitCommit,
    label: "Commits",
    value: 342,
    suffix: "",
    extra: "Last commit 2h ago",
  },
  {
    icon: Users,
    label: "Community",
    value: 1.2,
    suffix: "K",
    decimals: 1,
    extra: "Discord members",
  },
  {
    icon: FileText,
    label: "Updates",
    value: 24,
    suffix: "",
    extra: "Weekly devlogs",
  },
] as const;

const activities = [
  {
    time: "2h ago",
    icon: GitCommit,
    text: "Shipped fan sentiment API v0.2",
  },
  {
    time: "1d ago",
    icon: FileText,
    text: "Added World Cup 2026 match scheduler",
  },
  {
    time: "3d ago",
    icon: Star,
    text: "Launched Football Nexus landing page",
  },
];

/* ------------------------------------------------------------------ */
/*  Card                                                              */
/* ------------------------------------------------------------------ */
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" },
  }),
};

/* ------------------------------------------------------------------ */
/*  Section                                                           */
/* ------------------------------------------------------------------ */
export default function BuildInPublicSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black py-24 sm:py-32"
    >
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,197,94,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,.6) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-green-500/20 bg-green-500/10 px-4 py-1.5 text-sm font-medium text-green-400">
            Open Source
          </span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Built In Public
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-zinc-400">
            Follow every commit, every update, every milestone
          </p>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-md transition-colors hover:border-green-500/20 hover:bg-white/[0.05]"
              >
                {/* Glow on hover */}
                <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(34,197,94,0.06), transparent 60%)",
                  }}
                />

                <div className="relative">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-green-500/20 bg-green-500/10">
                    <Icon className="h-5 w-5 text-green-400" />
                  </div>

                  <p className="text-sm font-medium text-zinc-400">
                    {stat.label}
                  </p>

                  <p className="mt-1 text-3xl font-bold tracking-tight text-white">
                    <AnimatedCounter
                      target={stat.value}
                      suffix={stat.suffix}
                      decimals={"decimals" in stat ? stat.decimals : 0}
                    />
                  </p>

                  <p className="mt-2 text-sm text-green-400/80">
                    {stat.extra}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mx-auto mt-12 max-w-2xl"
        >
          <h3 className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-zinc-500">
            Recent Activity
          </h3>

          <div className="space-y-3">
            {activities.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.6 + i * 0.15, duration: 0.45 }}
                  className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 backdrop-blur-sm transition-colors hover:border-green-500/15 hover:bg-white/[0.04]"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
                    <Icon className="h-4 w-4 text-green-400" />
                  </div>

                  <span className="w-16 shrink-0 text-xs font-medium text-zinc-500">
                    {item.time}
                  </span>

                  <span className="text-sm text-zinc-300">{item.text}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
