import { OLSearchDoc, OLWork, OLAuthor, getCoverUrl } from "@/lib/api/booksApi";

export interface Book {
  id: string;
  workKey: string;
  title: string;
  authors: string[];
  authorKeys: string[];   // e.g. ["OL9388A"]
  coverUrl: string;
  coverMediumUrl: string;
  publishYear?: number;
  subjects: string[];
  isbn?: string;
  pageCount?: number;
  rating?: number;
  ratingCount?: number;
  editionCount?: number;
}

export interface BookDetails extends Book {
  description?: string;
  firstPublishDate?: string;
}

export function mapSearchDoc(doc: OLSearchDoc): Book {
  const workKey = doc.key;
  const id = workKey.replace("/works/", "");

  return {
    id,
    workKey,
    title: doc.title,
    authors: doc.author_name ?? [],
    authorKeys: (doc.author_key ?? []).map((k) => k.replace("/authors/", "")),
    coverUrl: getCoverUrl(doc.cover_i, "L"),
    coverMediumUrl: getCoverUrl(doc.cover_i, "M"),
    publishYear: doc.first_publish_year,
    subjects: (doc.subject ?? []).slice(0, 8),
    isbn: doc.isbn?.[0],
    pageCount: doc.number_of_pages_median,
    rating: doc.ratings_average,
    ratingCount: doc.ratings_count,
    editionCount: doc.edition_count,
  };
}

export function mapWorkDetails(
  work: OLWork,
  searchDoc?: OLSearchDoc
): BookDetails {
  const id = work.key.replace("/works/", "");
  const description =
    typeof work.description === "string"
      ? work.description
      : work.description?.value;

  return {
    id,
    workKey: work.key,
    title: work.title,
    authors: searchDoc?.author_name ?? [],
    authorKeys: (searchDoc?.author_key ?? []).map((k) => k.replace("/authors/", "")),
    coverUrl: getCoverUrl(work.covers?.[0] ?? searchDoc?.cover_i, "L"),
    coverMediumUrl: getCoverUrl(work.covers?.[0] ?? searchDoc?.cover_i, "M"),
    publishYear: searchDoc?.first_publish_year,
    subjects: (work.subjects ?? searchDoc?.subject ?? []).slice(0, 12),
    isbn: searchDoc?.isbn?.[0],
    pageCount: searchDoc?.number_of_pages_median,
    rating: searchDoc?.ratings_average,
    ratingCount: searchDoc?.ratings_count,
    editionCount: searchDoc?.edition_count,
    description,
    firstPublishDate: work.first_publish_date,
  };
}

export function mapAuthor(author: OLAuthor) {
  const bio =
    typeof author.bio === "string" ? author.bio : author.bio?.value;
  return {
    id: author.key.replace("/authors/", ""),
    name: author.name,
    bio,
    birthDate: author.birth_date,
    deathDate: author.death_date,
    photoUrl: author.photos?.[0]
      ? `https://covers.openlibrary.org/a/id/${author.photos[0]}-M.jpg`
      : undefined,
  };
}
