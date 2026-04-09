"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, BookOpen, Loader2 } from "lucide-react";
import { searchBooks } from "@/lib/api/booksApi";
import { mapSearchDoc, Book } from "@/lib/utils/bookMapper";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

interface Props {
  initialQuery?: string;
  size?: "default" | "large";
  className?: string;
  placeholder?: string;
}

export default function SearchSuggestions({
  initialQuery = "",
  size = "default",
  className = "",
  placeholder = "Search by title, author, or subject…",
}: Props) {
  const [query, setQuery]         = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<Book[]>([]);
  const [loading, setLoading]     = useState(false);
  const [open, setOpen]           = useState(false);
  const [focused, setFocused]     = useState(false);
  const containerRef              = useRef<HTMLDivElement>(null);
  const router                    = useRouter();
  const debouncedQuery            = useDebounce(query, 280);

  // Fetch suggestions
  useEffect(() => {
    const q = debouncedQuery.trim();
    if (q.length < 2) { setSuggestions([]); setOpen(false); return; }

    let cancelled = false;
    setLoading(true);
    searchBooks(q, 1, 6)
      .then((res) => {
        if (!cancelled) {
          setSuggestions(res.docs.map(mapSearchDoc).slice(0, 6));
          setOpen(true);
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [debouncedQuery]);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  function handleSelect(book: Book) {
    setOpen(false);
    router.push(`/book/${book.id}`);
  }

  const isLarge = size === "large";

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center">
          {loading ? (
            <Loader2 className={`absolute left-4 animate-spin text-muted-foreground ${isLarge ? "h-5 w-5" : "h-4 w-4"}`} />
          ) : (
            <Search className={`absolute left-4 text-muted-foreground ${isLarge ? "h-5 w-5" : "h-4 w-4"}`} />
          )}
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            className={`
              w-full rounded-xl border border-border bg-card text-foreground
              placeholder:text-muted-foreground
              focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
              transition-all duration-200
              ${isLarge ? "pl-12 pr-36 py-4 text-base" : "pl-10 pr-28 py-3 text-sm"}
            `}
          />
          <button
            type="submit"
            className={`
              absolute right-2 rounded-lg bg-primary text-primary-foreground font-medium
              hover:bg-primary/90 active:scale-95 transition-all duration-150
              ${isLarge ? "px-5 py-2.5 text-sm" : "px-4 py-1.5 text-xs"}
            `}
          >
            Search
          </button>
        </div>
      </form>

      {/* Dropdown */}
      {open && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/30">
          {suggestions.map((book) => {
            const hasCover = book.coverUrl !== "/placeholder-book.svg";
            return (
              <button
                key={book.id}
                onMouseDown={() => handleSelect(book)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent"
              >
                <div className="relative h-12 w-8 shrink-0 overflow-hidden rounded-md bg-muted">
                  {hasCover ? (
                    <Image src={book.coverMediumUrl} alt={book.title} fill className="object-cover" sizes="32px" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-sm">📚</div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground line-clamp-1">{book.title}</p>
                  {book.authors[0] && (
                    <p className="text-xs text-muted-foreground line-clamp-1">{book.authors[0]}</p>
                  )}
                </div>
                {book.publishYear && (
                  <span className="ml-auto shrink-0 text-xs text-muted-foreground">{book.publishYear}</span>
                )}
              </button>
            );
          })}

          {/* See all results */}
          <button
            onMouseDown={handleSubmit as never}
            className="flex w-full items-center gap-2 border-t border-border px-4 py-2.5 text-xs font-medium text-primary hover:bg-accent transition-colors"
          >
            <BookOpen className="h-3.5 w-3.5" />
            See all results for &ldquo;{query}&rdquo;
          </button>
        </div>
      )}
    </div>
  );
}
