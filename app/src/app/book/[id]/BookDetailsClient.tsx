"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, Calendar, BookOpen, Hash, Globe, User } from "lucide-react";
import { getWorkDetails, getAuthor, OLWork } from "@/lib/api/booksApi";
import { mapWorkDetails, mapAuthor, BookDetails } from "@/lib/utils/bookMapper";
import { addRecentlyViewed } from "@/lib/utils/storageHelpers";
import ShelfSelector from "@/components/ShelfSelector";
import ProgressCard from "@/components/ProgressCard";
import NotesCard from "@/components/NotesCard";
import HighlightsCard from "@/components/HighlightsCard";

interface AuthorInfo {
  name: string;
  bio?: string;
  photoUrl?: string;
  birthDate?: string;
}

interface Props { id: string; }

export default function BookDetailsClient({ id }: Props) {
  const [book, setBook]       = useState<BookDetails | null>(null);
  const [author, setAuthor]   = useState<AuthorInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [descExpanded, setDescExpanded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const work: OLWork = await getWorkDetails(id);
        const details = mapWorkDetails(work);
        setBook(details);
        addRecentlyViewed(details);

        // Fetch first author in background
        const authorKey = work.authors?.[0]?.author?.key;
        if (authorKey) {
          try {
            const raw = await getAuthor(authorKey);
            setAuthor(mapAuthor(raw));
          } catch {
            // author fetch failing is non-critical
          }
        }
      } catch {
        setError("Could not load book details. Please try again.");
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
          <div className="mx-auto h-80 w-52 shrink-0 animate-pulse rounded-2xl bg-muted sm:mx-0" />
          <div className="flex flex-1 flex-col gap-4">
            <div className="h-8 w-2/3 animate-pulse rounded-lg bg-muted" />
            <div className="h-5 w-1/2 animate-pulse rounded-lg bg-muted" />
            <div className="h-4 w-1/3 animate-pulse rounded-lg bg-muted" />
            <div className="mt-4 h-24 w-full animate-pulse rounded-lg bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center">
        <p className="text-muted-foreground">{error ?? "Book not found."}</p>
        <Link href="/" className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
      </div>
    );
  }

  const hasCover   = book.coverUrl !== "/placeholder-book.svg";
  const descWords  = book.description?.split(" ") ?? [];
  const isLongDesc = descWords.length > 80;
  const displayDesc =
    isLongDesc && !descExpanded
      ? descWords.slice(0, 80).join(" ") + "…"
      : book.description;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Back */}
      <button
        onClick={() => window.history.back()}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="flex flex-col gap-10 sm:flex-row sm:items-start">
        {/* ── Cover ──────────────────────────────────────────────────── */}
        <div className="mx-auto shrink-0 sm:mx-0">
          <div className="relative h-80 w-52 overflow-hidden rounded-2xl border border-border shadow-2xl shadow-black/40">
            {hasCover ? (
              <Image
                src={book.coverUrl}
                alt={`Cover of ${book.title}`}
                fill
                className="object-cover"
                sizes="208px"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-muted to-accent p-4 text-center">
                <span className="text-5xl">📚</span>
                <p className="text-sm font-medium text-muted-foreground leading-tight">{book.title}</p>
              </div>
            )}
          </div>

          {/* Rating */}
          {book.rating && book.rating > 0 && (
            <div className="mt-3 flex items-center justify-center gap-1.5 text-sm text-amber-400">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-semibold">{book.rating.toFixed(1)}</span>
              {book.ratingCount && (
                <span className="text-xs text-muted-foreground">
                  ({book.ratingCount.toLocaleString()})
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Info column ────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col gap-6 min-w-0">

          {/* Title & author */}
          <div>
            <h1 className="text-2xl font-bold leading-tight text-foreground sm:text-3xl">
              {book.title}
            </h1>
            {book.authors.length > 0 && (
              <p className="mt-1.5 text-base text-muted-foreground">
                by{" "}
                <span className="font-medium text-foreground">
                  {book.authors.join(", ")}
                </span>
              </p>
            )}
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {book.publishYear && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-primary" />
                First published {book.publishYear}
              </span>
            )}
            {book.pageCount && (
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-primary" />
                ~{book.pageCount} pages
              </span>
            )}
            {book.editionCount && (
              <span className="flex items-center gap-1.5">
                <Hash className="h-4 w-4 text-primary" />
                {book.editionCount} editions
              </span>
            )}
            {book.isbn && (
              <span className="flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-primary" />
                ISBN {book.isbn}
              </span>
            )}
          </div>

          {/* Description */}
          {book.description && (
            <div>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                About this book
              </h2>
              <p className="text-sm leading-relaxed text-foreground">{displayDesc}</p>
              {isLongDesc && (
                <button
                  onClick={() => setDescExpanded((x) => !x)}
                  className="mt-1.5 text-xs font-medium text-primary hover:underline"
                >
                  {descExpanded ? "Show less" : "Read more"}
                </button>
              )}
            </div>
          )}

          {/* Subjects */}
          {book.subjects.length > 0 && (
            <div>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Subjects
              </h2>
              <div className="flex flex-wrap gap-2">
                {book.subjects.map((s) => (
                  <Link
                    key={s}
                    href={`/search?q=${encodeURIComponent(s)}`}
                    className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground hover:border-primary/40 hover:bg-accent transition-colors"
                  >
                    {s}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ── Author bio card ──────────────────────────────────────── */}
          {author && (
            <div className="rounded-xl border border-border bg-card p-4">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                About the Author
              </h2>
              <div className="flex gap-4">
                {/* Photo */}
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                  {author.photoUrl ? (
                    <Image
                      src={author.photoUrl}
                      alt={author.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <User className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                {/* Text */}
                <div className="min-w-0">
                  <p className="font-semibold text-foreground text-sm">{author.name}</p>
                  {author.birthDate && (
                    <p className="text-xs text-muted-foreground mb-1">b. {author.birthDate}</p>
                  )}
                  {author.bio && (
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">
                      {author.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Personal library tools ───────────────────────────────── */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              My Library
            </h2>
            <ShelfSelector book={book} />
            <ProgressCard bookId={book.id} totalPages={book.pageCount} />
            <NotesCard bookId={book.id} />
            <HighlightsCard bookId={book.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
