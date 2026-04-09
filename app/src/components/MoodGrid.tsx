import Link from "next/link";

const MOODS = [
  {
    label: "Need Adventure",
    description: "Journeys, quests & bold heroes",
    emoji: "🌊",
    query: "adventure exploration journey",
    gradient: "from-blue-600/20 to-cyan-500/10",
    border: "hover:border-blue-400/40",
    glow: "hover:shadow-blue-500/10",
  },
  {
    label: "Think Deeply",
    description: "Philosophy, ideas & big questions",
    emoji: "🧠",
    query: "philosophy psychology mind",
    gradient: "from-violet-600/20 to-purple-500/10",
    border: "hover:border-violet-400/40",
    glow: "hover:shadow-violet-500/10",
  },
  {
    label: "Light & Fun",
    description: "Humor, wit & easy reads",
    emoji: "😄",
    query: "humor comedy light fiction",
    gradient: "from-yellow-500/20 to-amber-400/10",
    border: "hover:border-yellow-400/40",
    glow: "hover:shadow-yellow-500/10",
  },
  {
    label: "Dark & Thrilling",
    description: "Suspense, crime & edge-of-seat",
    emoji: "🔪",
    query: "thriller mystery suspense crime",
    gradient: "from-red-700/20 to-rose-600/10",
    border: "hover:border-red-400/40",
    glow: "hover:shadow-red-500/10",
  },
  {
    label: "Romance & Heart",
    description: "Love, longing & connection",
    emoji: "💕",
    query: "romance love relationships",
    gradient: "from-pink-600/20 to-rose-400/10",
    border: "hover:border-pink-400/40",
    glow: "hover:shadow-pink-500/10",
  },
  {
    label: "Future Worlds",
    description: "Sci-fi, space & tomorrow",
    emoji: "🚀",
    query: "science fiction space dystopia",
    gradient: "from-cyan-600/20 to-teal-500/10",
    border: "hover:border-cyan-400/40",
    glow: "hover:shadow-cyan-500/10",
  },
  {
    label: "Magic & Wonder",
    description: "Fantasy, myths & enchantment",
    emoji: "🧙",
    query: "fantasy magic epic wizards",
    gradient: "from-emerald-600/20 to-green-500/10",
    border: "hover:border-emerald-400/40",
    glow: "hover:shadow-emerald-500/10",
  },
  {
    label: "Grow & Learn",
    description: "Self-help, habits & mindset",
    emoji: "🌱",
    query: "self help personal development growth",
    gradient: "from-lime-600/20 to-green-400/10",
    border: "hover:border-lime-400/40",
    glow: "hover:shadow-lime-500/10",
  },
  {
    label: "History & Culture",
    description: "The past that shapes today",
    emoji: "🏛️",
    query: "history culture civilization",
    gradient: "from-orange-600/20 to-amber-500/10",
    border: "hover:border-orange-400/40",
    glow: "hover:shadow-orange-500/10",
  },
  {
    label: "Classic Lit",
    description: "Timeless masterworks",
    emoji: "📜",
    query: "classic literature masterpiece",
    gradient: "from-stone-500/20 to-zinc-400/10",
    border: "hover:border-stone-400/40",
    glow: "hover:shadow-stone-500/10",
  },
];

export default function MoodGrid() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Mood-Based Discovery
        </p>
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          How do you want to feel?
        </h2>
        <p className="mt-2 text-sm text-white/50">
          Pick a mood and find your next read
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {MOODS.map((mood) => (
          <Link
            key={mood.label}
            href={`/search?q=${encodeURIComponent(mood.query)}`}
            className={`group relative flex flex-col gap-2 overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br ${mood.gradient} p-4 transition-all duration-300 ${mood.border} hover:shadow-lg ${mood.glow} hover:-translate-y-0.5`}
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

            <span className="text-3xl">{mood.emoji}</span>
            <div>
              <p className="font-semibold text-white text-sm leading-tight">
                {mood.label}
              </p>
              <p className="mt-0.5 text-[11px] text-white/50 leading-snug">
                {mood.description}
              </p>
            </div>

            {/* Arrow on hover */}
            <span className="absolute right-3 bottom-3 text-white/20 text-lg transition-all duration-200 group-hover:text-white/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
