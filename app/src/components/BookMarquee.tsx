"use client";

import Image from "next/image";
import Link from "next/link";
import { Marquee } from "@/components/ui/marquee";

interface ShowcaseBook {
  title: string;
  author: string;
  coverId: number;
  subject: string;
}

// Use verified Open Library cover IDs — links search by title+author (always reliable)
const ROW_ONE: ShowcaseBook[] = [
  { title: "1984",                        author: "George Orwell",            coverId: 8575173,  subject: "Dystopia"      },
  { title: "Dune",                        author: "Frank Herbert",             coverId: 8712961,  subject: "Sci-Fi"        },
  { title: "The Great Gatsby",            author: "F. Scott Fitzgerald",       coverId: 8432472,  subject: "Classic"       },
  { title: "To Kill a Mockingbird",       author: "Harper Lee",                coverId: 8810494,  subject: "Drama"         },
  { title: "Pride and Prejudice",         author: "Jane Austen",               coverId: 8739161,  subject: "Romance"       },
  { title: "The Hobbit",                  author: "J.R.R. Tolkien",            coverId: 8406786,  subject: "Fantasy"       },
  { title: "Brave New World",             author: "Aldous Huxley",             coverId: 8292349,  subject: "Dystopia"      },
  { title: "The Catcher in the Rye",      author: "J.D. Salinger",             coverId: 8231432,  subject: "Coming-of-Age" },
];

const ROW_TWO: ShowcaseBook[] = [
  { title: "Fahrenheit 451",              author: "Ray Bradbury",              coverId: 8228691,  subject: "Dystopia"      },
  { title: "The Alchemist",               author: "Paulo Coelho",              coverId: 8910638,  subject: "Fiction"       },
  { title: "Harry Potter and the Philosopher's Stone", author: "J.K. Rowling", coverId: 8228694, subject: "Fantasy"       },
  { title: "The Road",                    author: "Cormac McCarthy",           coverId: 8228638,  subject: "Fiction"       },
  { title: "Crime and Punishment",        author: "Fyodor Dostoevsky",         coverId: 8228666,  subject: "Classic"       },
  { title: "One Hundred Years of Solitude", author: "Gabriel García Márquez",  coverId: 8228672,  subject: "Magic Realism" },
  { title: "The Little Prince",           author: "Antoine de Saint-Exupéry",  coverId: 8228612,  subject: "Philosophy"    },
  { title: "Moby Dick",                   author: "Herman Melville",           coverId: 8228661,  subject: "Adventure"     },
];

function searchHref(book: ShowcaseBook) {
  // Search by title + author — always surfaces the correct book as first result
  return `/search?q=${encodeURIComponent(`${book.title} ${book.author}`)}`;
}

function BookShowcaseCard({ book }: { book: ShowcaseBook }) {
  const coverUrl = `https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`;

  return (
    <Link
      href={searchHref(book)}
      className="group relative flex w-44 shrink-0 flex-col rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-400/40 hover:shadow-xl hover:shadow-cyan-400/10 transition-all duration-300"
    >
      <div className="relative h-64 w-full bg-muted">
        <Image
          src={coverUrl}
          alt={book.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="176px"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

        {/* Subject badge */}
        <span className="absolute top-2 left-2 rounded-full bg-cyan-500/80 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-black">
          {book.subject}
        </span>

        {/* Title + author always visible */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="font-semibold text-white text-sm leading-tight line-clamp-2 drop-shadow">
            {book.title}
          </p>
          <p className="text-white/75 text-xs mt-0.5 line-clamp-1 drop-shadow">
            {book.author}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function BookMarquee() {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Fade edges */}
      <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-28 bg-gradient-to-r from-[oklch(0.07_0.005_240)] to-transparent" />
      <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-28 bg-gradient-to-l from-[oklch(0.07_0.005_240)] to-transparent" />

      <div className="flex flex-col gap-4">
        <Marquee className="[--duration:55s] [--gap:1rem]" pauseOnHover repeat={2}>
          {ROW_ONE.map((book) => (
            <BookShowcaseCard key={book.title} book={book} />
          ))}
        </Marquee>

        <Marquee className="[--duration:65s] [--gap:1rem]" pauseOnHover reverse repeat={2}>
          {ROW_TWO.map((book) => (
            <BookShowcaseCard key={book.title} book={book} />
          ))}
        </Marquee>
      </div>
    </div>
  );
}
