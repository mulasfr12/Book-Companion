"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import BookGrid from "@/components/BookGrid";
import { searchBooks } from "@/lib/api/booksApi";
import { mapSearchDoc, Book } from "@/lib/utils/bookMapper";

const PAGE_SIZE = 20;

export default function SearchResultsClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = useCallback(
    async (q: string, p: number) => {
      if (!q.trim()) return;
      setLoading(true);
      setError(null);
      try {
        const result = await searchBooks(q, p, PAGE_SIZE);
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

  useEffect(() => {
    setPage(1);
    fetchResults(query, 1);
  }, [query, fetchResults]);

  useEffect(() => {
    if (page === 1) return;
    fetchResults(query, page);
  }, [page, query, fetchResults]);

  const totalPages = Math.min(Math.ceil(total / PAGE_SIZE), 50);

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
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array(PAGE_SIZE)
            .fill(0)
            .map((_, i) => (
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

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Results */}
      {!loading && !error && <BookGrid books={books} />}

      {/* Pagination */}
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
