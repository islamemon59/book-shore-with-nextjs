import BookCard from "./Components/BookCard/BookCard";
import SearchInput from "./Components/SearchInput/SearchInput";

export default async function BookGrid({ searchParams }) {
  const search = searchParams?.search || "";

  let books = [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/books?search=${search}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error(`API call failed with status: ${res.status}`);
    }

    const data = await res.json();
    if (Array.isArray(data)) {
      books = data;
    } else {
      console.error("API response is not an array:", data);
    }
  } catch (error) {
    console.error("Failed to fetch books:", error);
  }

  return (
    <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
      {/* Sidebar: Visible on md screens and up */}
      <div className="hidden md:block md:col-span-4">
        {/* Your sidebar content goes here. */}
      </div>

      {/* Main Content */}
      <div className="col-span-1 md:col-span-8">
        {/* Always render SearchInput */}
        <SearchInput />

        {/* Conditional rendering for results */}
        {(!books || books.length === 0) ? (
          <div className="text-center py-24">
            <h2 className="text-3xl font-bold text-[var(--color-neutral)] mb-4">
              📚 No Books Found 📚
            </h2>
            <p className="text-lg text-gray-600">
              We're sorry, no books matched your search. Try another keyword!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
