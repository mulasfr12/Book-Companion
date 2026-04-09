"use client";

import { useState, useEffect } from "react";
import { Check, ChevronDown, Plus, Trash2 } from "lucide-react";
import { Book } from "@/lib/utils/bookMapper";
import { SHELVES, ShelfId } from "@/constants/shelves";
import {
  getSavedBook,
  saveBookToShelf,
  removeBook,
} from "@/lib/utils/storageHelpers";

interface ShelfSelectorProps {
  book: Book;
  onSaved?: (shelf: ShelfId | null) => void;
}

export default function ShelfSelector({ book, onSaved }: ShelfSelectorProps) {
  const [currentShelf, setCurrentShelf] = useState<ShelfId | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = getSavedBook(book.id);
    setCurrentShelf(saved?.shelf ?? null);
  }, [book.id]);

  function handleSelect(shelf: ShelfId) {
    saveBookToShelf(book, shelf);
    setCurrentShelf(shelf);
    setOpen(false);
    onSaved?.(shelf);
  }

  function handleRemove() {
    removeBook(book.id);
    setCurrentShelf(null);
    setOpen(false);
    onSaved?.(null);
  }

  const activeShelf = SHELVES.find((s) => s.id === currentShelf);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-all hover:border-primary/40 hover:bg-accent"
      >
        <span className="flex items-center gap-2">
          {activeShelf ? (
            <>
              <span>{activeShelf.emoji}</span>
              <span className="text-primary">{activeShelf.label}</span>
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Add to shelf</span>
            </>
          )}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1.5 rounded-xl border border-border bg-card shadow-xl shadow-black/10 overflow-hidden">
          {SHELVES.map((shelf) => (
            <button
              key={shelf.id}
              onClick={() => handleSelect(shelf.id)}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-left transition-colors hover:bg-accent"
            >
              <span className="text-base">{shelf.emoji}</span>
              <span className="flex-1 font-medium text-foreground">
                {shelf.label}
              </span>
              {currentShelf === shelf.id && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </button>
          ))}

          {currentShelf && (
            <>
              <div className="mx-4 border-t border-border" />
              <button
                onClick={handleRemove}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-left text-destructive transition-colors hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
                Remove from library
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
