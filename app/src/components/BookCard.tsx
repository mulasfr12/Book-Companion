"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Book } from "@/lib/utils/bookMapper";

interface BookCardProps {
  book: Book;
  compact?: boolean;
}

export default function BookCard({ book, compact = false }: BookCardProps) {
  const hasCover = book.coverUrl !== "/placeholder-book.svg";

  return (
    <Link
      href={`/book/${book.id}`}
      className="group flex flex-col rounded-xl overflow-hidden border border-border bg-card hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
    >
      {/* Cover */}
      <div className={`relative w-full overflow-hidden bg-muted ${compact ? "h-44" : "h-56"}`}>
        {hasCover ? (
          <Image
            src={book.coverUrl}
            alt={`Cover of ${book.title}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3 bg-gradient-to-br from-muted to-accent">
            <span className="text-3xl">📚</span>
            <p className="text-xs text-center text-muted-foreground font-medium leading-tight line-clamp-3">
              {book.title}
            </p>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 p-3 flex-1">
        <h3 className="font-semibold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
          {book.title}
        </h3>

        {book.authors.length > 0 && (
          <p className="text-xs text-muted-foreground line-clamp-1">
            {book.authors.slice(0, 2).join(", ")}
          </p>
        )}

        {!compact && (
          <div className="flex items-center justify-between mt-auto pt-2">
            {book.publishYear && (
              <span className="text-xs text-muted-foreground">
                {book.publishYear}
              </span>
            )}
            {book.rating && book.rating > 0 && (
              <span className="flex items-center gap-1 text-xs text-amber-500 dark:text-amber-400">
                <Star className="h-3 w-3 fill-current" />
                {book.rating.toFixed(1)}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
