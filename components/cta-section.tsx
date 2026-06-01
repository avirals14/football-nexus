"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, CheckCircle, Sparkles } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Floating particles (generated on mount to avoid SSR randomness)    */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Avatar stack colors                                                */
/* ------------------------------------------------------------------ */
const AVATAR_COLORS = [
  "bg-green-500",
  "bg-emerald-400",
  "bg-teal-400",
  "bg-cyan-400",
  "bg-green-400",
];

/* ------------------------------------------------------------------ */
/*  Section                                                           */
/* ------------------------------------------------------------------ */
export default function CtaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; size: number; duration: number; delay: number }[]
  >([]);

  useEffect(() => {
    const p = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 3,
      duration: 12 + Math.random() * 20,
      delay: Math.random() * 8,
    }));
    setParticles(p);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black py-28 sm:py-36"
    >
      {/* ---- Radial gradient background ---- */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(34,197,94,0.25) 0%, rgba(34,197,94,0.08) 35%, transparent 70%)",
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-[1200px] w-[1200px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* ---- Floating particles ---- */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="pointer-events-none absolute rounded-full bg-green-400/30"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, 15, -15, 0],
            opacity: [0, 0.7, 0.7, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* ---- Content ---- */}
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-1.5 text-sm font-medium text-green-400"
        >
          <Sparkles className="h-4 w-4" />
          Launching for World Cup 2026
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          Help Build The Future of{" "}
          <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Football Intelligence
          </span>
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-400"
        >
          Join the journey before the 2026 World Cup. Be among the first to
          experience the next generation of football analytics.
        </motion.p>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-10"
        >
          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className="mx-auto flex max-w-lg flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
                id="cta-email"
                className="h-12 flex-1 rounded-xl border border-white/10 bg-white/[0.05] px-4 text-sm text-white placeholder-zinc-500 outline-none backdrop-blur-sm transition-colors focus:border-green-500/40 focus:ring-1 focus:ring-green-500/20"
              />
              <button
                type="submit"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-green-500 px-6 text-sm font-semibold text-black transition-all hover:bg-green-400 hover:shadow-[0_0_24px_rgba(34,197,94,0.35)] active:scale-[0.97]"
              >
                Join Waitlist
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto flex max-w-md items-center justify-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 px-6 py-4"
            >
              <CheckCircle className="h-5 w-5 text-green-400" />
              <p className="text-sm font-medium text-green-300">
                You&apos;re on the list! We&apos;ll be in touch soon.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          {/* Avatar stack */}
          <div className="flex -space-x-2.5">
            {AVATAR_COLORS.map((color, i) => (
              <div
                key={i}
                className={`h-8 w-8 rounded-full border-2 border-black ${color} ring-1 ring-white/10`}
              />
            ))}
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-zinc-800 text-[10px] font-bold text-zinc-300 ring-1 ring-white/10">
              +2K
            </div>
          </div>

          <p className="text-sm text-zinc-500">
            <span className="font-medium text-zinc-300">2,847 fans</span>{" "}
            already joined
          </p>
        </motion.div>
      </div>
    </section>
  );
}
