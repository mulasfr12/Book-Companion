"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface SearchBarProps {
  initialQuery?: string;
  placeholder?: string;
  className?: string;
  size?: "default" | "large";
}

export default function SearchBar({
  initialQuery = "",
  placeholder = "Search by title, author, or subject…",
  className = "",
  size = "default",
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  const isLarge = size === "large";

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative flex items-center">
        <Search
          className={`absolute left-4 text-muted-foreground ${isLarge ? "h-5 w-5" : "h-4 w-4"}`}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`
            w-full rounded-xl border border-border bg-card text-foreground
            placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
            transition-all duration-200
            ${isLarge ? "pl-12 pr-36 py-4 text-base" : "pl-10 pr-28 py-3 text-sm"}
          `}
        />
        <button
          type="submit"
          className={`
            absolute right-2 rounded-lg bg-primary text-primary-foreground font-medium
            hover:bg-primary/90 active:scale-95 transition-all duration-150
            ${isLarge ? "px-5 py-2.5 text-sm" : "px-4 py-1.5 text-xs"}
          `}
        >
          Search
        </button>
      </div>
    </form>
  );
}
