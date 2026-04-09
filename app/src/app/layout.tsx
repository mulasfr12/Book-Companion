import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CommandPaletteProvider from "@/components/CommandPaletteProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookCompanion — Your Personal Reading Space",
  description:
    "Search millions of books, build reading shelves, track progress, and keep personal notes — your elegant reading companion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <CommandPaletteProvider />
        <div className="flex-1">{children}</div>

        <footer className="border-t border-white/6 mt-auto py-6 text-center text-xs text-white/30">
          <p>
            BookCompanion · Book data powered by{" "}
            <a
              href="https://openlibrary.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white/60 transition-colors"
            >
              Open Library
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
