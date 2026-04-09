"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import { MeshGradient, PulsingBorder } from "@paper-design/shaders-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Search, BookOpen } from "lucide-react";

export default function BookHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleMouseEnter = () => setIsActive(true);
    const handleMouseLeave = () => setIsActive(false);
    const container = containerRef.current;
    if (container) {
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
    }
    return () => {
      if (container) {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ minHeight: "92vh" }}
    >
      {/* ── SVG filters ─────────────────────────────────────────────── */}
      <svg className="absolute inset-0 w-0 h-0">
        <defs>
          <filter id="glass-effect" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence baseFrequency="0.005" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.3" />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0.02  0 1 0 0 0.02  0 0 1 0 0.05  0 0 0 0.9 0"
            />
          </filter>
          <filter id="gooey-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
          <filter id="text-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="hero-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#06b6d4" />
            <stop offset="70%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
        </defs>
      </svg>

      {/* ── Mesh gradient backgrounds ────────────────────────────────── */}
      {/* Dark base so the gradient renders on black */}
      <div className="absolute inset-0 bg-black" />
      <MeshGradient
        className="absolute inset-0 w-full h-full opacity-90"
        colors={["#000000", "#06b6d4", "#0891b2", "#164e63", "#f97316"]}
        speed={0.3}
      />
      {/* Second subtle layer for depth */}
      <MeshGradient
        className="absolute inset-0 w-full h-full opacity-25"
        colors={["#000000", "#ffffff", "#06b6d4", "#f97316"]}
        speed={0.15}
      />

      {/* ── Hero content ─────────────────────────────────────────────── */}
      <div className="relative z-20 flex flex-col items-start justify-end h-full px-8 pb-16 pt-24 max-w-3xl"
        style={{ minHeight: "92vh" }}
      >
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm mb-8 border border-white/10"
          style={{ filter: "url(#glass-effect)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="absolute top-0 left-1 right-1 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent rounded-full" />
          <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
          <span className="text-white/90 text-sm font-medium tracking-wide">
            Your personal reading companion
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-none tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.span
            className="block font-light text-3xl md:text-4xl lg:text-5xl mb-2 tracking-wider"
            style={{
              background:
                "linear-gradient(135deg, #ffffff 0%, #06b6d4 30%, #f97316 70%, #ffffff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "url(#text-glow)",
            }}
          >
            Discover. Collect.
          </motion.span>
          <span className="block font-black text-white drop-shadow-2xl">Read</span>
          <span className="block font-light text-white/80 italic">Everything.</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="text-lg font-light text-white/70 mb-8 leading-relaxed max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          Search millions of books, build personal reading shelves, track your
          progress, and keep notes — all in one elegant space.
        </motion.p>

        {/* Search bar */}
        <motion.form
          onSubmit={handleSearch}
          className="w-full max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <div className="relative flex items-center gap-0">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, author, or subject…"
                className="w-full rounded-l-2xl border border-white/15 bg-white/8 backdrop-blur-md pl-11 pr-4 py-4 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-cyan-400/50 focus:bg-white/12 transition-all duration-200"
                style={{ background: "rgba(255,255,255,0.07)" }}
              />
            </div>
            <button
              type="submit"
              className="px-8 py-4 rounded-r-2xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-semibold text-sm hover:from-cyan-400 hover:to-cyan-300 transition-all duration-200 active:scale-95 whitespace-nowrap"
            >
              Search
            </button>
          </div>
        </motion.form>

        {/* CTA buttons */}
        <motion.div
          className="flex items-center gap-4 mt-6 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <motion.a
            href="/library"
            className="px-8 py-3 rounded-full bg-transparent border border-white/25 text-white/90 font-medium text-sm hover:border-cyan-400/50 hover:bg-white/8 transition-all duration-200 backdrop-blur-sm"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            My Library
          </motion.a>
          <motion.a
            href="/search?q=bestsellers"
            className="px-8 py-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold text-sm hover:from-orange-400 hover:to-orange-300 transition-all duration-200 shadow-lg shadow-orange-500/25"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            Browse Books
          </motion.a>
        </motion.div>
      </div>

      {/* ── Pulsing border decoration (bottom-right) ─────────────────── */}
      <div className="absolute bottom-8 right-8 z-30">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <PulsingBorder
            colors={[
              "#06b6d4",
              "#0891b2",
              "#f97316",
              "#00FF88",
              "#FFD700",
              "#FF6B35",
              "#ffffff",
            ]}
            colorBack="#00000000"
            speed={1.5}
            roundness={1}
            thickness={0.1}
            softness={0.2}
            intensity={5}
            spots={5}
            spotSize={0.1}
            pulse={0.1}
            smoke={0.5}
            smokeSize={4}
            style={{ width: "60px", height: "60px", borderRadius: "50%" }}
          />
          <motion.svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            animate={{ rotate: 360 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ transform: "scale(1.6)" }}
          >
            <defs>
              <path
                id="circle-path"
                d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
              />
            </defs>
            <text className="text-[7px] fill-white/60 font-medium">
              <textPath href="#circle-path" startOffset="0%">
                BookCompanion • Discover • Read • Collect • BookCompanion •
              </textPath>
            </text>
          </motion.svg>
        </div>
      </div>

      {/* ── Bottom fade into page ─────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
    </div>
  );
}
