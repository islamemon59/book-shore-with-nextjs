import { notFound } from "next/navigation";
import BookDetails from "./Components/BookDetails/BookDetails";
import { collectionObj, dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const booksCollection = await dbConnect(collectionObj.booksCollection);
  const book = await booksCollection.findOne({ _id: new ObjectId(id) });

  return {
    title: book ? `BookShore | ${book.title}` : "BookShore | Book Not Found",
  };
}

export default async function BookDetailsPage({ params }) {
  const { id } = await params;

  let book = null;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/books/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch book details");
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
