import BookCard from "./Components/BookCard/BookCard";
import Pagination from "./Components/Pagination/Pagination";
import SearchInput from "./Components/SearchInput/SearchInput";
import SortBooks from "./Components/SortBooks/SortBooks";
import SortByGenre from "./Components/SortByGenre/SortByGenre";

export const generateMetadata = () => {
  return {
    title: "BookShore | All Books",
  };
};

export default async function BookGrid({ searchParams }) {
  // Correct way to access searchParams: No await needed.
  const search = searchParams?.search || "";
  const sort = searchParams?.sort || "newest";
  const genre = searchParams?.genre;
  const page = parseInt(searchParams?.page) || 1;
  const limit = parseInt(searchParams?.limit) || 12; // show 6 per page

  let books = [];
  let pagination = [];
  try {
    // Build the URL based on the parameters
    let apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/books?search=${search}&sort=${sort}&page=${page}&limit=${limit}`;

    // Only add the genre parameter if it's not 'All'
    if (genre && genre !== "All") {
      apiUrl += `&genre=${genre}`;
    }

    const res = await fetch(apiUrl, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`API call failed with status: ${res.status}`);
    }

    const data = await res.json();
    if (data?.data && Array.isArray(data.data)) {
      books = data.data; // ✅ paginated books
      pagination = data.pagination; // ✅ store pagination info
    } else {
      console.error("API response format unexpected:", data);
    }
  } catch (error) {
    console.error("Failed to fetch books:", error);
  }

  return (
    <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
      {/* Sidebar: Visible on md screens and up */}
      <aside className="hidden md:block md:col-span-4">
        <div className="bg-base-100 dark:bg-gray-900 shadow-lg rounded-2xl p-6 space-y-8">
          {/* Section: Sort by */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Sort By
            </h2>
            <SortBooks />
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200" />

          {/* Section: Genre */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Filter by Genre
            </h2>
            <SortByGenre />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="col-span-1 md:col-span-8">
        {/* Always render SearchInput */}
        <SearchInput />

        {/* Conditional rendering for results */}
        {!books || books.length === 0 ? (
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
        {books.length > 0 && <Pagination pagination={pagination} />}
      </div>
    </div>
  );
}
