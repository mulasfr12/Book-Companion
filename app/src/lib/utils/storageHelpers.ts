import { Book } from "@/lib/utils/bookMapper";
import { ShelfId } from "@/constants/shelves";

/* ── Types ─────────────────────────────────────────────────────────────── */

export interface SavedBook {
  book: Book;
  shelf: ShelfId;
  addedAt: string;
  progress?: number;
  notes?: string;
  highlights?: string[];
}

export interface ReadingGoal {
  target: number;   // books to finish this month
  month: string;    // "YYYY-MM"
}

const LIBRARY_KEY  = "bc_library";
const RECENT_KEY   = "bc_recent";
const GOAL_KEY     = "bc_goal";
const MAX_RECENT   = 20;

/* ── Internal helpers ────────────────────────────────────────────────── */

function getLibrary(): Record<string, SavedBook> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(LIBRARY_KEY) ?? "{}"); }
  catch { return {}; }
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
  if (lib[bookId]) { lib[bookId].progress = pages; saveLibrary(lib); }
}

export function updateNotes(bookId: string, notes: string) {
  const lib = getLibrary();
  if (lib[bookId]) { lib[bookId].notes = notes; saveLibrary(lib); }
}

export function addHighlight(bookId: string, highlight: string) {
  const lib = getLibrary();
  if (lib[bookId]) {
    lib[bookId].highlights = [...(lib[bookId].highlights ?? []), highlight];
    saveLibrary(lib);
  }
}

export function removeHighlight(bookId: string, index: number) {
  const lib = getLibrary();
  if (lib[bookId]?.highlights) {
    lib[bookId].highlights = lib[bookId].highlights!.filter((_, i) => i !== index);
    saveLibrary(lib);
  }
}

/* ── Recently viewed ────────────────────────────────────────────────── */

export function getRecentlyViewed(): Book[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]"); }
  catch { return []; }
}

export function addRecentlyViewed(book: Book) {
  const recent = getRecentlyViewed().filter((b) => b.id !== book.id);
  recent.unshift(book);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
}

/* ── Reading goals ──────────────────────────────────────────────────── */

function currentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function getReadingGoal(): ReadingGoal | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(GOAL_KEY) ?? "null"); }
  catch { return null; }
}

export function setReadingGoal(target: number): ReadingGoal {
  const goal: ReadingGoal = { target, month: currentMonth() };
  localStorage.setItem(GOAL_KEY, JSON.stringify(goal));
  return goal;
}

/** Books finished in the goal's month */
export function getBooksFinishedThisMonth(): number {
  const goal = getReadingGoal();
  const month = goal?.month ?? currentMonth();
  return getAllSavedBooks().filter((b) => {
    if (b.shelf !== "finished") return false;
    return b.addedAt.startsWith(month);
  }).length;
}
