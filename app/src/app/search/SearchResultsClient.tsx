"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, BookOpen, SlidersHorizontal, X } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import BookGrid from "@/components/BookGrid";
import { searchBooks, SortField } from "@/lib/api/booksApi";
import { mapSearchDoc, Book } from "@/lib/utils/bookMapper";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 20;

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "new",       label: "Newest first" },
  { value: "old",       label: "Oldest first" },
  { value: "rating",    label: "Top rated" },
  { value: "title",     label: "A → Z" },
];

export default function SearchResultsClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const [books, setBooks]         = useState<Book[]>([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [sort, setSort]           = useState<SortField>("relevance");
  const [onlyCover, setOnlyCover] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const fetchResults = useCallback(
    async (q: string, p: number, s: SortField, cover: boolean) => {
      if (!q.trim()) return;
      setLoading(true);
      setError(null);
      try {
        const result = await searchBooks(q, p, PAGE_SIZE, s, cover);
        setBooks(result.docs.map(mapSearchDoc));
        setTotal(result.numFound);
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Reset to page 1 whenever query, sort or filter changes
  useEffect(() => {
    setPage(1);
    fetchResults(query, 1, sort, onlyCover);
  }, [query, sort, onlyCover, fetchResults]);

  useEffect(() => {
    if (page === 1) return;
    fetchResults(query, page, sort, onlyCover);
  }, [page, query, sort, onlyCover, fetchResults]);

  const totalPages = Math.min(Math.ceil(total / PAGE_SIZE), 50);
  const activeFilters = sort !== "relevance" || onlyCover;

  if (!query) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center text-muted-foreground">
        <BookOpen className="mx-auto mb-4 h-12 w-12 opacity-30" />
        <p>Enter a search query to discover books.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
            Results for{" "}
            <span className="text-primary">&ldquo;{query}&rdquo;</span>
          </h1>
          {!loading && total > 0 && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {total.toLocaleString()} books found
            </p>
          )}
        </div>
        <SearchBar initialQuery={query} className="w-full sm:max-w-sm" />
      </div>

      {/* ── Filter / sort bar ──────────────────────────────────────── */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFiltersOpen((o) => !o)}
          className={cn(
            "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all",
            filtersOpen || activeFilters
              ? "border-primary/50 bg-primary/10 text-primary"
              : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
          )}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
          {activeFilters && (
            <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {(sort !== "relevance" ? 1 : 0) + (onlyCover ? 1 : 0)}
            </span>
          )}
        </button>

        {/* Sort chips — always visible */}
        <div className="flex flex-wrap gap-1.5">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSort(opt.value)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                sort === opt.value
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Expanded filter panel */}
        {filtersOpen && (
          <div className="w-full flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <div
                onClick={() => setOnlyCover((c) => !c)}
                className={cn(
                  "relative h-5 w-9 rounded-full transition-colors duration-200",
                  onlyCover ? "bg-primary" : "bg-muted"
                )}
              >
                <div
                  className={cn(
                    "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200",
                    onlyCover ? "translate-x-4" : "translate-x-0.5"
                  )}
                />
              </div>
              Only books with covers
            </label>

            {activeFilters && (
              <button
                onClick={() => { setSort("relevance"); setOnlyCover(false); }}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors ml-auto"
              >
                <X className="h-3 w-3" /> Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Loading skeleton ───────────────────────────────────────── */}
      {loading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array(PAGE_SIZE).fill(0).map((_, i) => (
            <div key={i} className="flex flex-col rounded-xl overflow-hidden border border-border bg-card animate-pulse">
              <div className="h-56 w-full bg-muted" />
              <div className="p-3 flex flex-col gap-2">
                <div className="h-3 w-4/5 rounded bg-muted" />
                <div className="h-3 w-3/5 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Error ──────────────────────────────────────────────────── */}
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center text-sm text-destructive">
          {error}
        </div>
      )}

      {/* ── Results ────────────────────────────────────────────────── */}
      {!loading && !error && <BookGrid books={books} />}

      {/* ── Pagination ─────────────────────────────────────────────── */}
      {!loading && totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-primary/40 hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <span className="px-4 text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-primary/40 hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
