import BookDetailsClient from "./BookDetailsClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BookDetailsPage({ params }: Props) {
  const { id } = await params;
  return <BookDetailsClient id={id} />;
}
