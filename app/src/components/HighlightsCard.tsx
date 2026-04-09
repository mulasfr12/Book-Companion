"use client";

import { useState, useEffect } from "react";
import { Quote, Trash2, Plus } from "lucide-react";
import {
  getSavedBook,
  addHighlight,
  removeHighlight,
} from "@/lib/utils/storageHelpers";

interface HighlightsCardProps {
  bookId: string;
}

export default function HighlightsCard({ bookId }: HighlightsCardProps) {
  const [highlights, setHighlights] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [adding, setAdding] = useState(false);

  function reload() {
    const s = getSavedBook(bookId);
    setHighlights(s?.highlights ?? []);
  }

  useEffect(() => { reload(); }, [bookId]); // eslint-disable-line

  const savedBook = typeof window !== "undefined" ? getSavedBook(bookId) : null;
  if (!savedBook) return null;

  function handleAdd() {
    const text = input.trim();
    if (!text) return;
    addHighlight(bookId, text);
    setInput("");
    setAdding(false);
    reload();
  }

  function handleRemove(i: number) {
    removeHighlight(bookId, i);
    reload();
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Quote className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Highlights &amp; Quotes
          </h3>
        </div>
        <button
          onClick={() => setAdding((a) => !a)}
          className="flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all"
        >
          <Plus className="h-3 w-3" />
          Add
        </button>
      </div>

      {/* Add input */}
      {adding && (
        <div className="mb-4 flex flex-col gap-2">
          <textarea
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste a quote or highlight…"
            rows={3}
            className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={!input.trim()}
              className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-all"
            >
              Save
            </button>
            <button
              onClick={() => { setAdding(false); setInput(""); }}
              className="rounded-lg border border-border px-4 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {highlights.length === 0 ? (
        <p className="text-xs text-muted-foreground italic">
          No highlights yet. Save meaningful quotes or passages here.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {highlights.map((h, i) => (
            <div
              key={i}
              className="group relative rounded-lg border-l-2 border-primary/50 bg-primary/5 px-3 py-2.5"
            >
              <p className="text-sm text-foreground leading-relaxed pr-6">{h}</p>
              <button
                onClick={() => handleRemove(i)}
                className="absolute right-2 top-2 rounded p-0.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
