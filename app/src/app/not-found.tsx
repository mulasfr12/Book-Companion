import Link from "next/link";
import { BookOpen, Home, Search } from "lucide-react";
import BackButton from "@/components/BackButton";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center px-4 text-center overflow-hidden">
      {/* Ambient glow blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full blur-3xl opacity-10"
        style={{ background: "oklch(0.71 0.148 209)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/3 bottom-1/4 h-64 w-64 rounded-full blur-3xl opacity-8"
        style={{ background: "oklch(0.72 0.19 50)" }}
      />

      {/* Icon */}
      <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10">
        <BookOpen className="h-10 w-10 text-cyan-400" />
        <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500/90 text-[10px] font-bold text-white">
          ?
        </div>
      </div>

      {/* 404 */}
      <h1 className="mb-2 text-8xl font-black tracking-tighter text-white/10 select-none">
        404
      </h1>

      <p className="mb-2 text-xl font-semibold text-white/80">
        This page got lost in the stacks
      </p>
      <p className="mb-10 max-w-sm text-sm text-white/40 leading-relaxed">
        The shelf you&apos;re looking for doesn&apos;t exist — it may have been
        moved, removed, or never catalogued.
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-500/15 border border-cyan-400/25 px-5 py-2.5 text-sm font-medium text-cyan-300 hover:bg-cyan-500/25 hover:border-cyan-400/40 transition-all"
        >
          <Home className="h-4 w-4" />
          Back to Discover
        </Link>
        <Link
          href="/search?q="
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/60 hover:bg-white/8 hover:text-white/80 transition-all"
        >
          <Search className="h-4 w-4" />
          Search books
        </Link>
        <BackButton />
      </div>

      {/* Bottom flavour */}
      <p className="mt-14 text-[11px] text-white/15">
        BookCompanion · powered by Open Library
      </p>
    </div>
  );
}
