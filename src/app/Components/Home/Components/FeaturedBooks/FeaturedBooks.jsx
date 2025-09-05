import Link from "next/link";
import Image from "next/image";

export default async function FeaturedBooksSection() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/books/featured`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to fetch featured books");

  const featuredBooks = await res.json();

  return (
    <section className="container mx-auto px-4 py-12">
      {/* Section Title */}
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">
        <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Featured Books
        </span>
        <div className="mt-3 flex justify-center">
          <span className="h-1 w-24 rounded-full bg-gradient-to-r from-primary via-secondary to-accent"></span>
        </div>
      </h2>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {featuredBooks.map((book) => {
          const discountedPrice =
            book.discount && book.discount > 0
              ? (book.price * (100 - book.discount)) / 100
              : null;

          return (
            <Link
              key={book._id}
              href={`/books/${book._id}`}
              className="group relative bg-base-100 border border-gray-200 rounded-2xl shadow-md hover:shadow-xl p-4 flex flex-col justify-between transition-transform transform hover:scale-105"
            >
              {/* Discount Badge */}
              {book.discount > 0 && (
                <span className="absolute top-3 left-3 bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold px-2 py-1 rounded-full shadow-md z-10">
                  -{book.discount}%
                </span>
              )}

              <div className="flex flex-col items-center">
                {/* Book Cover */}
                <div className="relative w-36 h-48 mb-3 rounded-lg overflow-hidden shadow-sm">
                  <Image
                    src={book.imageURL}
                    alt={book.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    priority
                  />
                </div>

                {/* Book Title */}
                <p className="text-center font-semibold text-lg text-primary group-hover:text-secondary transition-colors">
                  {book.title}
                </p>

                {/* Author */}
                <p className="text-sm text-gray-500 mb-2">{book.author}</p>
              </div>

              {/* Price at the bottom */}
              <div className="flex items-center gap-2 mt-3 justify-center">
                {discountedPrice ? (
                  <>
                    <span className="text-sm text-gray-400 line-through">
                      ${book.price.toFixed(2)}
                    </span>
                    <span className="text-primary font-bold">
                      ${discountedPrice.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-primary font-bold">
                    ${book.price.toFixed(2)}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
