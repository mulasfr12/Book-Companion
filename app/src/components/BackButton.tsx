"use client";

import { ArrowLeft } from "lucide-react";

export default function BackButton({ className }: { className?: string }) {
  return (
    <button
      onClick={() => window.history.back()}
      className={
        className ??
        "inline-flex items-center gap-2 rounded-xl border border-white/8 bg-transparent px-5 py-2.5 text-sm font-medium text-white/40 hover:text-white/60 transition-all"
      }
    >
      <ArrowLeft className="h-4 w-4" />
      Go back
    </button>
  );
}
