"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Tag } from "lucide-react";
import { searchBySubject } from "@/lib/api/booksApi";
import { mapSearchDoc, Book } from "@/lib/utils/bookMapper";
import BookGrid from "@/components/BookGrid";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function SubjectPage({ params }: Props) {
  const { slug } = use(params);
  const subject = decodeURIComponent(slug).replace(/-/g, " ");

  const [books, setBooks]     = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await searchBySubject(subject, 40);
        setBooks(res.docs.map(mapSearchDoc));
      } catch {
        setError("Could not load books for this subject.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [subject]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <button
        onClick={() => window.history.back()}
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="mb-10 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
          <Tag className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-0.5">Subject</p>
          <h1 className="text-2xl font-bold capitalize text-foreground sm:text-3xl">{subject}</h1>
          {!loading && (
            <p className="mt-1 text-sm text-muted-foreground">
              {books.length} books found
            </p>
          )}
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array(20).fill(0).map((_, i) => (
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

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center text-sm text-destructive">
          {error}
        </div>
      )}

      {!loading && !error && <BookGrid books={books} />}

      {!loading && !error && books.length === 0 && (
        <div className="py-20 text-center text-muted-foreground">
          <p>No books found for this subject.</p>
          <Link href="/" className="mt-3 inline-block text-sm text-primary hover:underline">
            Back to home
          </Link>
        </div>
      )}
    </div>
  );
}
