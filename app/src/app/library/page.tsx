"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, BookOpen, Library } from "lucide-react";
import { SHELVES, ShelfId } from "@/constants/shelves";
import { SavedBook, getAllSavedBooks, removeBook, getBooksByShelf } from "@/lib/utils/storageHelpers";
import { cn } from "@/lib/utils";

function SavedBookCard({
  saved,
  onRemove,
}: {
  saved: SavedBook;
  onRemove: () => void;
}) {
  const { book } = saved;
  const hasCover = book.coverUrl !== "/placeholder-book.svg";

  return (
    <div className="group relative flex gap-4 rounded-xl border border-border bg-card p-3 transition-all hover:border-primary/30 hover:shadow-md">
      {/* Cover */}
      <Link href={`/book/${book.id}`} className="shrink-0">
        <div className="relative h-20 w-14 overflow-hidden rounded-lg bg-muted">
          {hasCover ? (
            <Image
              src={book.coverMediumUrl}
              alt={book.title}
              fill
              className="object-cover"
              sizes="56px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-accent">
              <span className="text-xl">📚</span>
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <Link
            href={`/book/${book.id}`}
            className="text-sm font-semibold text-foreground hover:text-primary line-clamp-2 leading-snug transition-colors"
          >
            {book.title}
          </Link>
          {book.authors.length > 0 && (
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
              {book.authors.slice(0, 2).join(", ")}
            </p>
          )}
        </div>

        {/* Progress bar */}
        {saved.progress !== undefined && book.pageCount && (
          <div className="mt-2">
            <div className="mb-1 flex justify-between text-[10px] text-muted-foreground">
              <span>{saved.progress} / {book.pageCount} pages</span>
              <span>{Math.round((saved.progress / book.pageCount) * 100)}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary"
                style={{
                  width: `${Math.min(100, (saved.progress / book.pageCount) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Remove */}
      <button
        onClick={onRemove}
        className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive/10 hover:text-destructive"
        title="Remove from library"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default function LibraryPage() {
  const [activeShelf, setActiveShelf] = useState<ShelfId>("reading");
  const [books, setBooks] = useState<SavedBook[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  function reload() {
    setBooks(getBooksByShelf(activeShelf));
    setTotalCount(getAllSavedBooks().length);
  }

  useEffect(() => {
    reload();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeShelf]);

  function handleRemove(bookId: string) {
    removeBook(bookId);
    reload();
  }

  if (totalCount === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <Library className="mx-auto mb-4 h-14 w-14 text-muted-foreground/30" />
        <h1 className="mb-2 text-xl font-semibold text-foreground">
          Your library is empty
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Search for books and add them to your shelves to get started.
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
        <h1 className="text-2xl font-bold text-foreground">My Library</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {totalCount} book{totalCount !== 1 ? "s" : ""} saved across all shelves
        </p>
      </div>

      {/* Shelf tabs */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-1">
        {SHELVES.map((shelf) => {
          const count = getBooksByShelf(shelf.id).length;
          return (
            <button
              key={shelf.id}
              onClick={() => setActiveShelf(shelf.id)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all",
                activeShelf === shelf.id
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:border-primary/20 hover:bg-accent hover:text-foreground"
              )}
            >
              <span>{shelf.emoji}</span>
              <span>{shelf.label}</span>
              {count > 0 && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                    activeShelf === shelf.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Book list */}
      {books.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
          <BookOpen className="h-10 w-10 opacity-30" />
          <p className="text-sm">No books on this shelf yet.</p>
          <Link
            href="/"
            className="text-xs text-primary hover:underline"
          >
            Browse books to add
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((saved) => (
            <SavedBookCard
              key={saved.book.id}
              saved={saved}
              onRemove={() => handleRemove(saved.book.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
