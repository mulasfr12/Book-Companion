"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  BookOpen,
  Library,
  LayoutDashboard,
  Loader2,
  ArrowRight,
  Command,
} from "lucide-react";
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

const QUICK_LINKS = [
  { label: "Discover books",   href: "/",          icon: Search },
  { label: "My Library",       href: "/library",   icon: Library },
  { label: "Dashboard",        href: "/dashboard", icon: LayoutDashboard },
];

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery]           = useState("");
  const [results, setResults]       = useState<Book[]>([]);
  const [loading, setLoading]       = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef                    = useRef<HTMLInputElement>(null);
  const listRef                     = useRef<HTMLDivElement>(null);
  const router                      = useRouter();
  const debouncedQuery              = useDebounce(query, 280);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 10);
      setQuery("");
      setResults([]);
      setActiveIndex(0);
    }
  }, [open]);

  // Fetch results
  useEffect(() => {
    const q = debouncedQuery.trim();
    if (q.length < 2) { setResults([]); setLoading(false); return; }

    let cancelled = false;
    setLoading(true);
    searchBooks(q, 1, 6)
      .then((res) => {
        if (!cancelled) {
          setResults(res.docs.map(mapSearchDoc).slice(0, 6));
          setActiveIndex(0);
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [debouncedQuery]);

  const items = query.trim().length >= 2 ? results : [];
  const totalItems = items.length + QUICK_LINKS.length;

  const navigate = useCallback(
    (href: string) => {
      onClose();
      router.push(href);
    },
    [onClose, router]
  );

  const handleSelect = useCallback(
    (index: number) => {
      if (index < items.length) {
        navigate(`/book/${items[index].id}`);
      } else {
        navigate(QUICK_LINKS[index - items.length].href);
      }
    },
    [items, navigate]
  );

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % totalItems);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + totalItems) % totalItems);
      }
      if (e.key === "Enter") {
        e.preventDefault();
        handleSelect(activeIndex);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, activeIndex, totalItems, handleSelect, onClose]);

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  if (!open) return null;

  const showSearch = query.trim().length >= 2;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div className="relative w-full max-w-xl rounded-2xl border border-white/10 bg-[oklch(0.11_0.008_240)] shadow-2xl shadow-black/60 overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-white/8 px-4 py-3.5">
          {loading ? (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-cyan-400" />
          ) : (
            <Search className="h-4 w-4 shrink-0 text-cyan-400" />
          )}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search books, authors…"
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
          />
          <kbd className="hidden sm:flex items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-white/30 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[60vh] overflow-y-auto py-2">
          {/* Book results */}
          {showSearch && (
            <>
              {results.length > 0 && (
                <div className="px-3 pb-1 pt-2">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 px-1">
                    Books
                  </p>
                </div>
              )}
              {results.map((book, i) => {
                const hasCover = book.coverUrl !== "/placeholder-book.svg";
                const isActive = activeIndex === i;
                return (
                  <button
                    key={book.id}
                    data-index={i}
                    onMouseDown={() => navigate(`/book/${book.id}`)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      isActive ? "bg-white/8" : "hover:bg-white/5"
                    }`}
                  >
                    <div className="relative h-10 w-7 shrink-0 overflow-hidden rounded bg-white/5">
                      {hasCover ? (
                        <Image
                          src={book.coverMediumUrl}
                          alt={book.title}
                          fill
                          className="object-cover"
                          sizes="28px"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-xs">📚</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white line-clamp-1">{book.title}</p>
                      {book.authors[0] && (
                        <p className="text-xs text-white/40 line-clamp-1">{book.authors[0]}</p>
                      )}
                    </div>
                    {isActive && <ArrowRight className="h-3.5 w-3.5 shrink-0 text-cyan-400" />}
                  </button>
                );
              })}

              {/* "Search for" row */}
              {query.trim().length >= 2 && (
                <button
                  data-index={results.length}
                  onMouseDown={() => navigate(`/search?q=${encodeURIComponent(query.trim())}`)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-white/5 border-t border-white/5 mt-1"
                >
                  <BookOpen className="h-4 w-4 shrink-0 text-cyan-400" />
                  <span className="text-sm text-cyan-400 font-medium">
                    Search all results for &ldquo;{query.trim()}&rdquo;
                  </span>
                </button>
              )}
            </>
          )}

          {/* Quick links (always visible) */}
          <div className="px-3 pb-1 pt-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 px-1">
              Quick Links
            </p>
          </div>
          {QUICK_LINKS.map(({ label, href, icon: Icon }, qi) => {
            const idx = items.length + qi;
            const isActive = activeIndex === idx;
            return (
              <button
                key={href}
                data-index={idx}
                onMouseDown={() => navigate(href)}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  isActive ? "bg-white/8" : "hover:bg-white/5"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0 text-white/40" />
                <span className="text-sm text-white/70">{label}</span>
                {isActive && <ArrowRight className="ml-auto h-3.5 w-3.5 shrink-0 text-cyan-400" />}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 border-t border-white/5 px-4 py-2.5 text-[10px] text-white/20">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0.5 font-mono">↑↓</kbd>
            navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0.5 font-mono">↵</kbd>
            open
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0.5 font-mono">ESC</kbd>
            close
          </span>
          <span className="ml-auto flex items-center gap-1 opacity-60">
            <Command className="h-3 w-3" />K
          </span>
        </div>
      </div>
    </div>
  );
}
