import Link from "next/link";
import BookHero from "@/components/ui/hero";
import BookMarquee from "@/components/BookMarquee";

const FEATURED_SUBJECTS = [
  { label: "Fantasy",         emoji: "🧙",  query: "fantasy" },
  { label: "Sci-Fi",          emoji: "🚀",  query: "science fiction" },
  { label: "Mystery",         emoji: "🔍",  query: "mystery thriller" },
  { label: "History",         emoji: "🏛️",  query: "history" },
  { label: "Philosophy",      emoji: "💭",  query: "philosophy" },
  { label: "Biography",       emoji: "👤",  query: "biography" },
  { label: "Romance",         emoji: "💌",  query: "romance" },
  { label: "Adventure",       emoji: "🗺️",  query: "adventure" },
  { label: "Science",         emoji: "🔬",  query: "science" },
  { label: "Poetry",          emoji: "✍️",  query: "poetry" },
  { label: "Self-Help",       emoji: "🌱",  query: "self help" },
  { label: "Travel",          emoji: "✈️",  query: "travel" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* ── Shader Hero ───────────────────────────────────────────────── */}
      <BookHero />

      {/* ── Book Marquee Showcase ─────────────────────────────────────── */}
      <section className="py-16">
        <div className="mb-10 px-6 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Curated Collection
          </p>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Beloved books waiting for you
          </h2>
          <p className="mt-2 text-sm text-white/50">
            From timeless classics to genre-defining works
          </p>
        </div>
        <BookMarquee />
      </section>

      {/* ── Explore by Subject ───────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        {/* Section header */}
        <div className="mb-10">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Browse by Genre
          </p>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Explore by subject
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {FEATURED_SUBJECTS.map((s) => (
            <Link
              key={s.label}
              href={`/search?q=${encodeURIComponent(s.query)}`}
              className="group flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/6 px-3 py-4 text-center transition-all duration-200 hover:border-cyan-400/40 hover:bg-white/10 hover:shadow-lg hover:shadow-cyan-400/10"
            >
              <span className="text-2xl">{s.emoji}</span>
              <span className="text-xs font-semibold text-white/90 group-hover:text-cyan-400 transition-colors">
                {s.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Reading companion CTA ────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br from-white/4 to-white/2 px-8 py-14 text-center">
          {/* Decorative glows */}
          <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-12 -bottom-12 h-56 w-56 rounded-full bg-orange-500/10 blur-3xl" />
          {/* Top border line */}
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

          <div className="relative">
            <span className="text-4xl">📚</span>
            <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
              Build your personal library
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-white/50 sm:text-base">
              Save books, track your progress, write notes, and organize
              everything into reading shelves — no account needed.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/library"
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 px-6 py-2.5 text-sm font-semibold text-black shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-cyan-300 transition-all"
              >
                My Library
              </Link>
              <Link
                href="/search?q=bestsellers"
                className="rounded-xl border border-white/15 bg-white/6 px-6 py-2.5 text-sm font-semibold text-white/80 hover:border-white/25 hover:bg-white/10 transition-all backdrop-blur-sm"
              >
                Browse Books
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
