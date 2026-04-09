const BASE_URL = "https://openlibrary.org";
const COVERS_URL = "https://covers.openlibrary.org";

export interface OLSearchDoc {
  key: string;
  title: string;
  author_name?: string[];
  author_key?: string[];
  cover_i?: number;
  first_publish_year?: number;
  subject?: string[];
  isbn?: string[];
  number_of_pages_median?: number;
  ratings_average?: number;
  ratings_count?: number;
  edition_count?: number;
  language?: string[];
}

export interface OLSearchResult {
  numFound: number;
  docs: OLSearchDoc[];
}

export interface OLWork {
  key: string;
  title: string;
  description?: string | { value: string };
  subjects?: string[];
  subject_places?: string[];
  subject_times?: string[];
  covers?: number[];
  authors?: { author: { key: string } }[];
  created?: { value: string };
  first_publish_date?: string;
}

export interface OLAuthor {
  key: string;
  name: string;
  bio?: string | { value: string };
  photos?: number[];
  birth_date?: string;
  death_date?: string;
}

export function getCoverUrl(
  coverId: number | undefined,
  size: "S" | "M" | "L" = "M"
): string {
  if (!coverId) return "/placeholder-book.svg";
  return `${COVERS_URL}/b/id/${coverId}-${size}.jpg`;
}

export async function searchBooks(
  query: string,
  page = 1,
  limit = 20
): Promise<OLSearchResult> {
  const offset = (page - 1) * limit;
  const url = `${BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

export async function getWorkDetails(workId: string): Promise<OLWork> {
  // workId may come as "/works/OL123W" or just "OL123W"
  const id = workId.startsWith("/works/") ? workId : `/works/${workId}`;
  const res = await fetch(`${BASE_URL}${id}.json`);
  if (!res.ok) throw new Error("Failed to fetch work details");
  return res.json();
}

export async function getAuthor(authorKey: string): Promise<OLAuthor> {
  const key = authorKey.startsWith("/authors/")
    ? authorKey
    : `/authors/${authorKey}`;
  const res = await fetch(`${BASE_URL}${key}.json`);
  if (!res.ok) throw new Error("Failed to fetch author");
  return res.json();
}
