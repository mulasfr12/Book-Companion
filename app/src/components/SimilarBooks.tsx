"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { searchBySubject, searchByAuthor } from "@/lib/api/booksApi";
import { mapSearchDoc, Book } from "@/lib/utils/bookMapper";

interface Props {
  subjects: string[];
  authors: string[];
  currentTitle: string;
}

interface Section {
  label: string;
  books: Book[];
}

export default function SimilarBooks({ subjects, authors, currentTitle }: Props) {
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    if (!subjects.length && !authors.length) return;

    async function load() {
      const results: Section[] = [];

      // By first author
      if (authors[0]) {
        try {
          const res = await searchByAuthor(authors[0], currentTitle, 6);
          const books = res.docs.map(mapSearchDoc).filter((b) => b.coverUrl !== "/placeholder-book.svg");
          if (books.length >= 2) {
            results.push({ label: `More by ${authors[0]}`, books: books.slice(0, 6) });
          }
        } catch { /* non-critical */ }
      }

      // By first subject
      if (subjects[0]) {
        try {
          const res = await searchBySubject(subjects[0], 8);
          const books = res.docs
            .map(mapSearchDoc)
            .filter(
              (b) =>
                b.coverUrl !== "/placeholder-book.svg" &&
                b.title.toLowerCase() !== currentTitle.toLowerCase()
            )
            .slice(0, 6);
          if (books.length >= 2) {
            results.push({ label: `More in "${subjects[0]}"`, books });
          }
        } catch { /* non-critical */ }
      }

      setSections(results);
    }

    load();
  }, [subjects, authors, currentTitle]);

  if (!sections.length) return null;

  return (
    <div className="mt-12 flex flex-col gap-10">
      {sections.map((section) => (
        <div key={section.label}>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {section.label}
          </h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {section.books.map((book) => (
              <Link
                key={book.id}
                href={`/book/${book.id}`}
                className="group flex flex-col gap-1.5"
              >
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-border bg-muted shadow transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-lg group-hover:-translate-y-0.5">
                  <Image
                    src={book.coverMediumUrl}
                    alt={book.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 33vw, 15vw"
                  />
                </div>
                <p className="text-[11px] font-medium text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                  {book.title}
                </p>
                {book.authors[0] && (
                  <p className="text-[10px] text-muted-foreground line-clamp-1">
                    {book.authors[0]}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
