"use client";

import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { getSavedBook, updateProgress } from "@/lib/utils/storageHelpers";

interface ProgressCardProps {
  bookId: string;
  totalPages?: number;
}

export default function ProgressCard({ bookId, totalPages }: ProgressCardProps) {
  const [pagesRead, setPagesRead] = useState(0);
  const [input, setInput] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const s = getSavedBook(bookId);
    if (s?.progress) {
      setPagesRead(s.progress);
      setInput(String(s.progress));
    }
  }, [bookId]);

  const percent =
    totalPages && totalPages > 0
      ? Math.min(100, Math.round((pagesRead / totalPages) * 100))
      : null;

  function handleSave() {
    const val = parseInt(input, 10);
    if (isNaN(val) || val < 0) return;
    updateProgress(bookId, val);
    setPagesRead(val);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const savedBook = typeof window !== "undefined" ? getSavedBook(bookId) : null;
  if (!savedBook) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Reading Progress</h3>
      </div>

      {/* Progress bar */}
      {percent !== null && (
        <div className="mb-4">
          <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
            <span>{pagesRead} pages read</span>
            <span>{percent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          {totalPages && (
            <p className="mt-1 text-right text-xs text-muted-foreground">
              of {totalPages} pages
            </p>
          )}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="number"
          min={0}
          max={totalPages ?? 9999}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pages read"
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <button
          onClick={handleSave}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          {saved ? "Saved!" : "Update"}
        </button>
      </div>
    </div>
  );
}
