"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { getRecentlyViewed } from "@/lib/utils/storageHelpers";
import { Book } from "@/lib/utils/bookMapper";

export default function RecentlyViewed() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    setBooks(getRecentlyViewed().slice(0, 8));
  }, []);

  if (books.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex items-center gap-3">
        <Clock className="h-4 w-4 text-cyan-400" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Continue Reading
          </p>
          <h2 className="text-xl font-bold text-white">Recently Viewed</h2>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8">
        {books.map((book) => {
          const hasCover = book.coverUrl !== "/placeholder-book.svg";
          return (
            <Link
              key={book.id}
              href={`/book/${book.id}`}
              className="group flex flex-col gap-2"
            >
              <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-white/10 bg-muted shadow-md transition-all duration-300 group-hover:border-cyan-400/40 group-hover:shadow-lg group-hover:shadow-cyan-400/10 group-hover:-translate-y-1">
                {hasCover ? (
                  <Image
                    src={book.coverMediumUrl}
                    alt={book.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 25vw, 12vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white/5 to-white/2 text-2xl">
                    📚
                  </div>
                )}
              </div>
              <p className="text-[11px] font-medium text-white/70 line-clamp-2 group-hover:text-white/90 transition-colors leading-snug">
                {book.title}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
