"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { ArrowLeft, User, BookOpen } from "lucide-react";
import { getAuthor, searchByAuthor } from "@/lib/api/booksApi";
import { mapAuthor } from "@/lib/utils/bookMapper";
import { mapSearchDoc, Book } from "@/lib/utils/bookMapper";

interface AuthorInfo {
  id: string;
  name: string;
  bio?: string;
  photoUrl?: string;
  birthDate?: string;
  deathDate?: string;
}

interface Props {
  params: Promise<{ id: string }>;
}

export default function AuthorPage({ params }: Props) {
  const { id } = use(params);
  const [author, setAuthor]   = useState<AuthorInfo | null>(null);
  const [books, setBooks]     = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const raw = await getAuthor(id);
        const mapped = mapAuthor(raw);
        setAuthor(mapped);

        const results = await searchByAuthor(mapped.name, "", 24);
        setBooks(results.docs.map(mapSearchDoc));
      } catch {
        setError("Could not load author details.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="flex flex-col gap-8 sm:flex-row">
          <div className="mx-auto h-40 w-40 shrink-0 animate-pulse rounded-full bg-muted sm:mx-0" />
          <div className="flex flex-1 flex-col gap-4">
            <div className="h-8 w-1/2 animate-pulse rounded-lg bg-muted" />
            <div className="h-4 w-1/3 animate-pulse rounded-lg bg-muted" />
            <div className="h-20 w-full animate-pulse rounded-lg bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center">
        <p className="text-muted-foreground">{error ?? "Author not found."}</p>
        <Link href="/" className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <button
        onClick={() => window.history.back()}
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      {/* ── Author header ───────────────────────────────────────────── */}
      <div className="mb-12 flex flex-col gap-8 sm:flex-row sm:items-start">
        <div className="mx-auto shrink-0 sm:mx-0">
          <div className="relative h-40 w-40 overflow-hidden rounded-full border-2 border-border shadow-xl shadow-black/30">
            {author.photoUrl ? (
              <Image src={author.photoUrl} alt={author.name} fill className="object-cover" sizes="160px" priority />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-accent">
                <User className="h-14 w-14 text-muted-foreground/50" />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 min-w-0">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-1">Author</p>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{author.name}</h1>
            {(author.birthDate || author.deathDate) && (
              <p className="mt-1 text-sm text-muted-foreground">
                {author.birthDate ?? ""}
                {author.deathDate ? ` — ${author.deathDate}` : ""}
              </p>
            )}
          </div>

          {author.bio && (
            <div>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Biography</h2>
              <p className="text-sm text-foreground leading-relaxed max-w-2xl">{author.bio}</p>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4 text-primary" />
            {books.length > 0 ? `${books.length}+ works indexed` : "Works loading…"}
          </div>
        </div>
      </div>

      {/* ── Books grid ─────────────────────────────────────────────── */}
      {books.length > 0 && (
        <div>
          <h2 className="mb-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Works by {author.name}
          </h2>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {books.map((book) => {
              const hasCover = book.coverUrl !== "/placeholder-book.svg";
              return (
                <Link key={book.id} href={`/book/${book.id}`} className="group flex flex-col gap-1.5">
                  <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-border bg-muted shadow transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-lg group-hover:-translate-y-0.5">
                    {hasCover ? (
                      <Image
                        src={book.coverMediumUrl}
                        alt={book.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 33vw, 17vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-accent text-2xl">📚</div>
                    )}
                  </div>
                  <p className="text-[11px] font-medium text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {book.title}
                  </p>
                  {book.publishYear && (
                    <p className="text-[10px] text-muted-foreground">{book.publishYear}</p>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
