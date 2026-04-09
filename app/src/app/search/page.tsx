import { Suspense } from "react";
import SearchResultsClient from "./SearchResultsClient";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
            <p className="text-sm">Searching…</p>
          </div>
        </div>
      }
    >
      <SearchResultsClient />
    </Suspense>
  );
}
