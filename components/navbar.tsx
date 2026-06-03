"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Hexagon } from "lucide-react";
import { GithubIcon } from "./icons";

const hashLinks = [
  { label: "Features", href: "#features" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Community", href: "#community" },
];

const pageLinks = [
  { label: "Fan Pulse", href: "/fan-pulse" },
];

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    // For page links like /fan-pulse, let the browser navigate normally
    if (!href.startsWith("#")) return;

    // If we're on the home page, smooth-scroll to the section
    if (isHome) {
      e.preventDefault();
      setMobileOpen(false);
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // On other pages, navigate to /#section
      e.preventDefault();
      setMobileOpen(false);
      window.location.href = `/` + href;
    }
  };

  // Accessibility & active-link helpers
  const menuRef = useRef<HTMLDivElement | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
  const [active, setActive] = useState<string | null>(null);

  // Focus the first menu item when mobile menu opens
  useEffect(() => {
    if (mobileOpen) firstLinkRef.current?.focus();
  }, [mobileOpen]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Observe sections to set active link (only on home page)
  useEffect(() => {
    if (!isHome) {
      // On non-home pages, highlight the matching page link
      const match = pageLinks.find((l) => pathname.startsWith(l.href));
      if (match) setActive(match.href);
      return;
    }
    const els = hashLinks.map((l) => document.querySelector(l.href)).filter(Boolean) as Element[];
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { threshold: 0.5 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [isHome, pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass-card bg-black/60 border-b border-white/[0.06] shadow-[0_1px_20px_rgba(0,0,0,0.4)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <nav role="navigation" aria-label="Main Navigation" className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          {/* Logo */}
          <a href="/" className="group flex items-center gap-2.5">
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

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-1 md:flex">
            {hashLinks.map((link) => (
              <a
                key={link.href}
                href={isHome ? link.href : `/${link.href}`}
                onClick={(e) => handleNavClick(e, link.href)}
                aria-current={active === link.href ? "page" : undefined}
                className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  active === link.href ? "text-white font-semibold" : "text-zinc-400 hover:text-white"
                }`}
              >
                {link.label}
              </a>
            ))}
            {pageLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={active === link.href ? "page" : undefined}
                className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  active === link.href
                    ? "text-emerald-400 font-semibold"
                    : "text-zinc-400 hover:text-emerald-300"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden items-center gap-3 md:flex">
            <a
              href="https://github.com/avirals14/football-nexus"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-all duration-200 hover:bg-white/[0.06] hover:text-white"
              aria-label="GitHub"
            >
                      <GithubIcon className="h-[18px] w-[18px]" />
            </a>
            <a
              href="#waitlist"
              onClick={(e) => handleNavClick(e, "#waitlist")}
              className="inline-flex h-9 items-center justify-center rounded-lg bg-emerald-500 px-4 text-sm font-semibold text-black transition-all duration-200 hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(52,211,153,0.3)]"
            >
              Join Waitlist
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors duration-200 hover:text-white md:hidden"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              ref={menuRef}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
              className="overflow-hidden border-t border-white/[0.06] bg-black/80 backdrop-blur-xl md:hidden"
              aria-hidden={!mobileOpen}
            >
              <div className="flex flex-col gap-1 px-6 py-4">
                {hashLinks.map((link, index) => (
                  <motion.a
                    key={link.href}
                    href={isHome ? link.href : `/${link.href}`}
                    onClick={(e) => handleNavClick(e, link.href)}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                    ref={index === 0 ? (el) => { firstLinkRef.current = el as HTMLAnchorElement; } : undefined}
                    className="rounded-lg px-4 py-3 text-sm font-medium text-zinc-400 transition-colors duration-200 hover:bg-white/[0.04] hover:text-white"
                  >
                    {link.label}
                  </motion.a>
                ))}
                {pageLinks.map((link, index) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: (hashLinks.length + index) * 0.05, duration: 0.2 }}
                    className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200 hover:bg-white/[0.04] ${
                      active === link.href ? "text-emerald-400" : "text-zinc-400 hover:text-emerald-300"
                    }`}
                  >
                    {link.label}
                  </motion.a>
                ))}
                <div className="my-2 h-px bg-white/[0.06]" />
                <div className="flex items-center gap-3 px-4 py-2">
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors duration-200 hover:text-white"
                      aria-label="GitHub"
                    >
                              <GithubIcon className="h-[18px] w-[18px]" />
                    </a>
                  <a
                    href="#waitlist"
                    onClick={(e) => handleNavClick(e, "#waitlist")}
                    className="inline-flex h-9 flex-1 items-center justify-center rounded-lg bg-emerald-500 px-4 text-sm font-semibold text-black transition-all duration-200 hover:bg-emerald-400"
                  >
                    Join Waitlist
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer so content doesn't hide behind the fixed navbar */}
      <div className="h-16" />
    </>
  );
}
