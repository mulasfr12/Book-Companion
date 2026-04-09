import { Book } from "@/lib/utils/bookMapper";
import { ShelfId } from "@/constants/shelves";

/* ── Types ─────────────────────────────────────────────────────────────── */

export interface SavedBook {
  book: Book;
  shelf: ShelfId;
  addedAt: string;     // ISO date
  progress?: number;   // pages read
  notes?: string;
  highlights?: string[];
}

const LIBRARY_KEY = "bc_library";
const RECENT_KEY = "bc_recent";
const MAX_RECENT = 20;

/* ── Helpers ─────────────────────────────────────────────────────────── */

function getLibrary(): Record<string, SavedBook> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(LIBRARY_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function saveLibrary(lib: Record<string, SavedBook>) {
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(lib));
}

/* ── Library operations ─────────────────────────────────────────────── */

export function getSavedBook(bookId: string): SavedBook | undefined {
  return getLibrary()[bookId];
}

export function getAllSavedBooks(): SavedBook[] {
  return Object.values(getLibrary());
}

export function getBooksByShelf(shelf: ShelfId): SavedBook[] {
  return getAllSavedBooks().filter((b) => b.shelf === shelf);
}

export function saveBookToShelf(book: Book, shelf: ShelfId): SavedBook {
  const lib = getLibrary();
  const existing = lib[book.id];
  const saved: SavedBook = {
    ...(existing ?? {}),
    book,
    shelf,
    addedAt: existing?.addedAt ?? new Date().toISOString(),
  };
  lib[book.id] = saved;
  saveLibrary(lib);
  return saved;
}

export function removeBook(bookId: string) {
  const lib = getLibrary();
  delete lib[bookId];
  saveLibrary(lib);
}

export function updateProgress(bookId: string, pages: number) {
  const lib = getLibrary();
  if (lib[bookId]) {
    lib[bookId].progress = pages;
    saveLibrary(lib);
  }
}

export function updateNotes(bookId: string, notes: string) {
  const lib = getLibrary();
  if (lib[bookId]) {
    lib[bookId].notes = notes;
    saveLibrary(lib);
  }
}

export function addHighlight(bookId: string, highlight: string) {
  const lib = getLibrary();
  if (lib[bookId]) {
    lib[bookId].highlights = [...(lib[bookId].highlights ?? []), highlight];
    saveLibrary(lib);
  }
}

/* ── Recently viewed ────────────────────────────────────────────────── */

export function getRecentlyViewed(): Book[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function addRecentlyViewed(book: Book) {
  const recent = getRecentlyViewed().filter((b) => b.id !== book.id);
  recent.unshift(book);
  localStorage.setItem(
    RECENT_KEY,
    JSON.stringify(recent.slice(0, MAX_RECENT))
  );
}
