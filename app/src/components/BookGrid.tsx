import { Book } from "@/lib/utils/bookMapper";
import BookCard from "./BookCard";

interface BookGridProps {
  books: Book[];
  compact?: boolean;
}

export default function BookGrid({ books, compact = false }: BookGridProps) {
  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
        <span className="text-4xl">📭</span>
        <p className="text-base font-medium">No books found</p>
        <p className="text-sm">Try a different search term.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {books.map((book) => (
        <BookCard key={book.id} book={book} compact={compact} />
      ))}
    </div>
  );
}
