import { notFound } from 'next/navigation';
import BookDetails from './Components/BookDetails/BookDetails';

export default async function BookDetailsPage({ params }) {
  const { id } = params;

  let book = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/books/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error('Failed to fetch book details');
    }

    const data = await res.json();
    if (data && data._id) {
      book = data;
    }
  } catch (error) {
    console.error("Failed to fetch book:", error);
  }

  if (!book) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <BookDetails book={book} />
    </div>
  );
}