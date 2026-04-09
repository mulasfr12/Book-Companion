"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, CheckCircle2, Clock, Library, Star } from "lucide-react";
import { SHELVES } from "@/constants/shelves";
import {
  getAllSavedBooks,
  getRecentlyViewed,
  SavedBook,
} from "@/lib/utils/storageHelpers";
import { Book } from "@/lib/utils/bookMapper";
import ReadingGoalCard from "@/components/ReadingGoalCard";

function SmallBookCard({ book }: { book: Book }) {
  const hasCover = book.coverUrl !== "/placeholder-book.svg";
  return (
    <Link
      href={`/book/${book.id}`}
      className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-all hover:border-primary/30 hover:shadow-md"
    >
      <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
        {hasCover ? (
          <Image
            src={book.coverMediumUrl}
            alt={book.title}
            fill
            className="object-cover"
            sizes="40px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-accent text-lg">
            📚
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
          {book.title}
        </p>
        {book.authors[0] && (
          <p className="mt-0.5 text-[10px] text-muted-foreground line-clamp-1">
            {book.authors[0]}
          </p>
        )}
      </div>
    </Link>
  );
}

function ReadingCard({ saved }: { saved: SavedBook }) {
  const { book } = saved;
  const hasCover = book.coverUrl !== "/placeholder-book.svg";
  const percent =
    saved.progress && book.pageCount
      ? Math.min(100, Math.round((saved.progress / book.pageCount) * 100))
      : 0;

  return (
    <Link
      href={`/book/${book.id}`}
      className="group flex gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md"
    >
      <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
        {hasCover ? (
          <Image
            src={book.coverMediumUrl}
            alt={book.title}
            fill
            className="object-cover"
            sizes="56px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-accent text-2xl">
            📚
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <p className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {book.title}
          </p>
          {book.authors[0] && (
            <p className="mt-0.5 text-xs text-muted-foreground">{book.authors[0]}</p>
          )}
        </div>
        {book.pageCount ? (
          <div className="mt-2">
            <div className="mb-1 flex justify-between text-[10px] text-muted-foreground">
              <span>{saved.progress ?? 0} / {book.pageCount} pages</span>
              <span>{percent}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        ) : (
          <p className="mt-1 text-[10px] text-muted-foreground">No page count available</p>
        )}
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const [allBooks, setAllBooks] = useState<SavedBook[]>([]);
  const [recent, setRecent] = useState<Book[]>([]);

  useEffect(() => {
    setAllBooks(getAllSavedBooks());
    setRecent(getRecentlyViewed().slice(0, 6));
  }, []);

  const reading    = allBooks.filter((b) => b.shelf === "reading");
  const finished   = allBooks.filter((b) => b.shelf === "finished");
  const wantToRead = allBooks.filter((b) => b.shelf === "wantToRead");
  const favorites  = allBooks.filter((b) => b.shelf === "favorites");

  const totalPages = reading.reduce((sum, b) => sum + (b.book.pageCount ?? 0), 0);
  const pagesRead  = reading.reduce((sum, b) => sum + (b.progress ?? 0), 0);

  if (allBooks.length === 0 && recent.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <Library className="mx-auto mb-4 h-14 w-14 text-muted-foreground/30" />
        <h1 className="mb-2 text-xl font-semibold text-foreground">
          Your dashboard is empty
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Start searching for books and add them to your library.
        </p>
        <Link
          href="/"
          className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Discover Books
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">My Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your reading overview at a glance
        </p>
      </div>

      {/* ── Stats row ─────────────────────────────────────────────────── */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { icon: BookOpen,     label: "Reading",      value: reading.length,    color: "text-cyan-400" },
          { icon: CheckCircle2, label: "Finished",     value: finished.length,   color: "text-green-500" },
          { icon: Clock,        label: "Want to Read", value: wantToRead.length, color: "text-amber-400" },
          { icon: Star,         label: "Favorites",    value: favorites.length,  color: "text-rose-400" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-4">
            <Icon className={`mb-2 h-5 w-5 ${color}`} />
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Currently reading */}
        {reading.length > 0 && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Currently Reading</h2>
              {totalPages > 0 && (
                <span className="text-xs text-muted-foreground">
                  {pagesRead} / {totalPages} pages total
                </span>
              )}
            </div>
            <div className="flex flex-col gap-3">
              {reading.map((s) => (
                <ReadingCard key={s.book.id} saved={s} />
              ))}
            </div>
          </section>
        )}

        {/* Reading goal */}
        <section>
          <h2 className="mb-4 font-semibold text-foreground">Monthly Goal</h2>
          <ReadingGoalCard />
        </section>

        {/* Recently viewed */}
        {recent.length > 0 && (
          <section>
            <h2 className="mb-4 font-semibold text-foreground">Recently Viewed</h2>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {recent.map((book) => (
                <SmallBookCard key={book.id} book={book} />
              ))}
            </div>
          </section>
        )}

        {/* Shelf summary */}
        <section className="lg:col-span-2">
          <h2 className="mb-4 font-semibold text-foreground">Shelf Overview</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {SHELVES.map((shelf) => {
              const count = allBooks.filter((b) => b.shelf === shelf.id).length;
              return (
                <Link
                  key={shelf.id}
                  href="/library"
                  className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card py-4 text-center transition-all hover:border-primary/30 hover:bg-accent"
                >
                  <span className="text-2xl">{shelf.emoji}</span>
                  <span className="text-lg font-bold text-foreground">{count}</span>
                  <span className="text-xs text-muted-foreground">{shelf.label}</span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
