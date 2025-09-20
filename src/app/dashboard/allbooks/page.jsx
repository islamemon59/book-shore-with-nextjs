import Image from "next/image";
import ActionButtons from "./Components/ActionButtons/ActionButtons";
import Pagination from "@/app/books/Components/Pagination/Pagination";
import SortByGenre from "@/app/books/Components/SortByGenre/SortByGenre";
import SortOptions from "@/app/books/Components/SortBooks/SortBooks";
import { getServerSession } from "next-auth";
import UnauthorizedPage from "@/app/UnauthorizedPage";
import { authOptions } from "@/lib/authOptions";

export const generateMetadata = () => {
  return {
    title: "BookShore | Dashboard | All Books",
  };
};

export default async function BooksPage({ searchParams }) {
    const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return <UnauthorizedPage/>
  }
  const search = searchParams?.search || "";
  const sort = searchParams?.sort || "newest";
  const genre = searchParams?.genre;
  const page = parseInt(searchParams?.page) || 1;
  const limit = parseInt(searchParams?.limit) || 12; // show 6 per page
  let books = [];
  let pagination = [];
  try {
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
    <section className="container mx-auto px-4 py-12">
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-center mb-12">
        <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          📚 All Books
        </span>
        <div className="mt-3 flex justify-center">
          <span className="h-1 w-24 rounded-full bg-gradient-to-r from-primary via-secondary to-accent"></span>
        </div>
      </h1>

      <div className="grid grid-cols-12 gap-6">
        {/* sorting books */}
        <aside className="lg:col-span-3 col-span-12">
          <div className="bg-base-100 dark:bg-gray-900 shadow-lg rounded-2xl p-6 space-y-8">
            {/* Section: Sort by */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                Sort By
              </h2>
              <SortOptions />
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
        {/* Table */}
        <div className="overflow-x-auto rounded-2xl shadow-xl border border-base-200 lg:col-span-9 col-span-12">
          <table className="table w-full bg-base-100">
            {/* Table Header */}
            <thead className="sticky top-0 z-10 bg-gradient-to-r from-primary to-secondary text-white text-base">
              <tr>
                <th className="p-4 rounded-tl-2xl">#</th>
                <th>Cover</th>
                <th>Title</th>
                <th>Author</th>
                <th>Price</th>
                <th>Discount</th>
                <th className="text-center p-4 rounded-tr-2xl">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {books.map((book, index) => {
                const discountedPrice =
                  book.discount > 0
                    ? (book.price * (100 - book.discount)) / 100
                    : book.price;

                return (
                  <tr
                    key={book._id}
                    className="border-b border-base-200 hover:bg-base-200/60 transition-all duration-200"
                  >
                    {/* Index */}
                    <td className="font-medium text-base-content">
                      {index + 1}
                    </td>

                    {/* Cover */}
                    <td>
                      <div className="relative w-14 h-20 rounded-md overflow-hidden shadow-md ring-1 ring-base-300">
                        <Image
                          src={book.imageURL}
                          alt={book.title}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                    </td>

                    {/* Title */}
                    <td className="font-semibold text-base text-base-content">
                      {book.title}
                    </td>

                    {/* Author */}
                    <td className="text-sm text-base-content/70">
                      {book.author}
                    </td>

                    {/* Price */}
                    <td>
                      <div className="flex flex-col items-start gap-1">
                        {book.discount > 0 && (
                          <span className="text-sm text-base-content/50 line-through">
                            ${book.price.toFixed(2)}
                          </span>
                        )}
                        <span className="text-secondary font-bold">
                          ${discountedPrice.toFixed(2)}
                        </span>
                      </div>
                    </td>

                    {/* Discount */}
                    <td>
                      {book.discount > 0 ? (
                        <span className="badge badge-md bg-gradient-to-r from-primary to-secondary text-white border-none font-bold shadow-md">
                          -{book.discount}%
                        </span>
                      ) : (
                        <span className="badge badge-sm bg-base-200 text-base-content/70">
                          —
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="text-center">
                      <ActionButtons id={book._id} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
            <Pagination pagination={pagination} />
    </section>
  );
}
