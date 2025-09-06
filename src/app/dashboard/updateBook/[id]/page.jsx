import UpdateBookForm from "../Components/UpdateBookForm";

export default async function UpdateBookPage({ params }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/books/${params.id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) throw new Error("Failed to fetch book data");

  const book = await res.json();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Update Book</h1>
      <UpdateBookForm book={book} />
    </div>
  );
}
