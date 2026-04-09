"use client";

import { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import { getSavedBook, updateNotes } from "@/lib/utils/storageHelpers";

interface NotesCardProps {
  bookId: string;
}

export default function NotesCard({ bookId }: NotesCardProps) {
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const s = getSavedBook(bookId);
    setNotes(s?.notes ?? "");
  }, [bookId]);

  function handleSave() {
    updateNotes(bookId, notes);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const savedBook = typeof window !== "undefined" ? getSavedBook(bookId) : null;
  if (!savedBook) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <FileText className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">My Notes</h3>
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Write your thoughts, favourite quotes, or anything you want to remember…"
        rows={5}
        className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
      <button
        onClick={handleSave}
        className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        {saved ? "Saved!" : "Save Notes"}
      </button>
    </div>
  );
}
