"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Library, LayoutDashboard, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/",          label: "Discover",   icon: Search },
  { href: "/library",   label: "My Library", icon: Library },
  { href: "/dashboard", label: "Dashboard",  icon: LayoutDashboard },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "z-50 w-full transition-all duration-200",
        isHome
          // On homepage: float above the hero gradient
          ? "absolute top-0 left-0 right-0"
          // On other pages: sticky dark bar
          : "sticky top-0 border-b border-white/8 bg-background/85 backdrop-blur-md"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 font-bold text-white/90 hover:text-white transition-colors"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 border border-cyan-400/30 text-cyan-400 group-hover:bg-cyan-500/30 transition-colors">
            <BookOpen className="h-4 w-4" />
          </div>
          <span className="text-sm sm:text-base tracking-wide">BookCompanion</span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition-all duration-150",
                  active
                    ? "bg-white/10 text-cyan-400"
                    : "text-white/60 hover:bg-white/8 hover:text-white/90"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
