export const SHELF_LABELS = {
  wantToRead: "Want to Read",
  reading: "Reading",
  finished: "Finished",
  paused: "Paused",
  favorites: "Favorites",
} as const;

export type ShelfId = keyof typeof SHELF_LABELS;

export const SHELVES: { id: ShelfId; label: string; emoji: string }[] = [
  { id: "wantToRead", label: "Want to Read", emoji: "📚" },
  { id: "reading",    label: "Reading",       emoji: "📖" },
  { id: "finished",  label: "Finished",      emoji: "✅" },
  { id: "paused",    label: "Paused",        emoji: "⏸️" },
  { id: "favorites", label: "Favorites",     emoji: "⭐" },
];
