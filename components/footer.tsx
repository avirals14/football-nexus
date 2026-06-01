"use client";

import { motion } from "framer-motion";
import { Mail, ExternalLink, Hexagon } from "lucide-react";
import { GithubIcon, TwitterIcon } from "./icons";

const footerSections = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Roadmap", href: "#roadmap" },
      { label: "API Docs", href: "#" },
      { label: "Changelog", href: "#" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Discord", href: "#", external: true },
      { label: "Twitter / X", href: "#", external: true },
      { label: "GitHub", href: "https://github.com/avirals14/football-nexus", external: true },
      { label: "Blog", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
];

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/avirals14/football-nexus",
    icon: GithubIcon,
  },
  {
    label: "Twitter / X",
    href: "https://twitter.com",
    icon: TwitterIcon,
  },
  {
    label: "Contact",
    href: "mailto:hello@footballnexus.dev",
    icon: Mail,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Gradient top border */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

      {/* Subtle glow effect behind footer */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[600px] -translate-x-1/2 rounded-full bg-emerald-500/[0.03] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-8 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8"
        >
          {/* Brand Column */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-4"
          >
            <a href="/" className="group inline-flex items-center gap-2.5">
              <div className="relative flex h-8 w-8 items-center justify-center">
                <Hexagon className="h-7 w-7 text-emerald-400 fill-emerald-400/20 transition-all duration-300 group-hover:fill-emerald-400/30 group-hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                <span className="absolute text-[10px] font-bold text-white">
                  FN
                </span>
              </div>
              <span className="text-lg font-semibold tracking-tight text-white">
                Football Nexus
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-500">
              The Operating System for Football Fans.
            </p>
            <p className="mt-2 text-sm text-zinc-600">
              Track everything. Miss nothing.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="group flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-all duration-300 hover:bg-white/[0.06] hover:text-emerald-400 hover:shadow-[0_0_12px_rgba(52,211,153,0.15)]"
                >
                  <social.icon className="h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-110" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Link Columns */}
          {footerSections.map((section) => (
            <motion.div
              key={section.title}
              variants={itemVariants}
              className="lg:col-span-2"
            >
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                {section.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="group inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors duration-200 hover:text-zinc-200"
                    >
                      {link.label}
                      {link.external && (
                        <ExternalLink className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:opacity-60" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row"
        >
          <p className="text-xs text-zinc-600">
            © 2025 Football Nexus. Building for 2026 World Cup.
          </p>
          <p className="text-xs text-zinc-600">
            Made with ⚽ and AI
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
