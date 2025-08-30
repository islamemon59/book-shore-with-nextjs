import BookCard from "./Components/BookCard/BookCard";

export default async function BookGrid() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/books`, {
    cache: "no-store",
  });
  const books = await res.json();

  if (!books || books.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-bold text-[var(--color-neutral)] mb-4">
          📚 No Books Found 📚
        </h2>
        <p className="text-lg text-gray-600">
          We're sorry, but it seems there are no books available at the moment. 
          Please check back later!
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
      {/* Sidebar: Visible on md screens and up */}
      <div className="hidden md:block md:col-span-4">
        {/* Your sidebar content goes here. It will be a `col-span-4` on medium screens and up, but hidden on smaller screens. */}
      </div>

      {/* Main Content: Full width on small screens, adjusts on md and up */}
      <div className="col-span-1 md:col-span-8 grid">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      </div>
    </div>
  );
}
