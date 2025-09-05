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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
        {featuredBooks.map((book) => {
          const discountedPrice =
            book.discount && book.discount > 0
              ? (book.price * (100 - book.discount)) / 100
              : null;

          return (
            <Link
              key={book._id}
              href={`/books/${book._id}`}
              className="group relative flex flex-col items-center p-4 bg-base-100 rounded-3xl shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Discount Badge */}
              {book.discount > 0 && (
                <span className="absolute top-3 left-3 bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold px-2 py-1 rounded-full shadow-md z-10">
                  -{book.discount}%
                </span>
              )}

              <div className="flex flex-col items-center w-full">
                {/* Book Cover */}
                <div className="relative w-full h-60 md:h-72 mb-4 rounded-xl overflow-hidden shadow-lg border border-gray-200">
                  <Image
                    src={book.imageURL}
                    alt={book.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    priority
                  />
                </div>

                {/* Book Title */}
                <p className="text-center font-bold text-lg text-neutral truncate w-full mb-1">
                  {book.title}
                </p>

                {/* Author */}
                <p className="text-sm text-neutral opacity-70 mb-2">
                  {book.author}
                </p>
              </div>

              {/* Price at the bottom */}
              <div className="flex items-center gap-2 mt-auto">
                {discountedPrice ? (
                  <>
                    <span className="text-sm text-neutral opacity-50 line-through">
                      ${book.price.toFixed(2)}
                    </span>
                    <span className="text-secondary font-bold text-lg">
                      ${discountedPrice.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-secondary font-bold text-lg">
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
