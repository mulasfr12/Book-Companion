"use client";

import Image from "next/image";
import Link from "next/link";
import { Marquee } from "@/components/ui/marquee";

interface ShowcaseBook {
  id: string;
  title: string;
  author: string;
  coverId: number;
  subject: string;
}

// Curated showcase books with known Open Library cover IDs
const ROW_ONE: ShowcaseBook[] = [
  { id: "OL1168083W", title: "1984",                       author: "George Orwell",         coverId: 8575173,  subject: "Dystopia"     },
  { id: "OL893347W",  title: "Dune",                       author: "Frank Herbert",          coverId: 8712961,  subject: "Sci-Fi"       },
  { id: "OL45804W",   title: "The Great Gatsby",           author: "F. Scott Fitzgerald",    coverId: 8432472,  subject: "Classic"      },
  { id: "OL262463W",  title: "To Kill a Mockingbird",      author: "Harper Lee",             coverId: 8810494,  subject: "Drama"        },
  { id: "OL27516W",   title: "Pride and Prejudice",        author: "Jane Austen",            coverId: 8739161,  subject: "Romance"      },
  { id: "OL7353617W", title: "The Hobbit",                 author: "J.R.R. Tolkien",         coverId: 8406786,  subject: "Fantasy"      },
  { id: "OL102749W",  title: "Brave New World",            author: "Aldous Huxley",          coverId: 8292349,  subject: "Dystopia"     },
  { id: "OL25357W",   title: "The Catcher in the Rye",    author: "J.D. Salinger",          coverId: 8231432,  subject: "Coming-of-Age"},
];

const ROW_TWO: ShowcaseBook[] = [
  { id: "OL82563W",   title: "Fahrenheit 451",             author: "Ray Bradbury",           coverId: 8228691,  subject: "Dystopia"     },
  { id: "OL24347W",   title: "The Alchemist",              author: "Paulo Coelho",           coverId: 8910638,  subject: "Fiction"      },
  { id: "OL2163649W", title: "Harry Potter",               author: "J.K. Rowling",           coverId: 8228694,  subject: "Fantasy"      },
  { id: "OL15100765W",title: "The Road",                   author: "Cormac McCarthy",        coverId: 8228638,  subject: "Fiction"      },
  { id: "OL675093W",  title: "Crime and Punishment",       author: "Fyodor Dostoevsky",      coverId: 8228666,  subject: "Classic"      },
  { id: "OL509183W",  title: "One Hundred Years of Solitude", author: "Gabriel García Márquez", coverId: 8228672, subject: "Magic Realism"},
  { id: "OL183174W",  title: "The Little Prince",          author: "Antoine de Saint-Exupéry", coverId: 8228612, subject: "Philosophy"  },
  { id: "OL118987W",  title: "Moby Dick",                  author: "Herman Melville",        coverId: 8228661,  subject: "Adventure"    },
];

function BookShowcaseCard({ book }: { book: ShowcaseBook }) {
  const coverUrl = `https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`;

  return (
    <Link
      href={`/book/${book.id}`}
      className="group relative flex w-44 shrink-0 flex-col rounded-2xl overflow-hidden border border-border hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
    >
      {/* Cover image */}
      <div className="relative h-64 w-full bg-muted">
        <Image
          src={coverUrl}
          alt={book.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="176px"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Subject badge */}
        <span className="absolute top-2 left-2 rounded-full bg-cyan-500/80 backdrop-blur-sm px-2 py-0.5 text-[10px] font-semibold text-black">
          {book.subject}
        </span>

        {/* Book info on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="font-semibold text-white text-sm leading-tight line-clamp-2 drop-shadow">
            {book.title}
          </p>
          <p className="text-white/70 text-xs mt-0.5 line-clamp-1 drop-shadow">
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
      {/* Fade edges — keyed to the exact dark background colour */}
      <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-28 bg-gradient-to-r from-[oklch(0.07_0.005_240)] to-transparent" />
      <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-28 bg-gradient-to-l from-[oklch(0.07_0.005_240)] to-transparent" />

      <div className="flex flex-col gap-4">
        {/* Row 1 — left to right */}
        <Marquee className="[--duration:55s] [--gap:1rem]" pauseOnHover repeat={2}>
          {ROW_ONE.map((book) => (
            <BookShowcaseCard key={book.id} book={book} />
          ))}
        </Marquee>

        {/* Row 2 — right to left */}
        <Marquee className="[--duration:65s] [--gap:1rem]" pauseOnHover reverse repeat={2}>
          {ROW_TWO.map((book) => (
            <BookShowcaseCard key={book.id} book={book} />
          ))}
        </Marquee>
      </div>
    </div>
  );
}
