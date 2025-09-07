import Image from "next/image";
import ActionButtons from "../ActionsButtons/ActionButtons";
export default function BookCard({ book }) {
  // Calculate final price based on discount
  const finalPrice = book.price - (book.price * book.discount) / 100;

  return (
    <div className="group relative bg-base-100 rounded-xl shadow-lg overflow-hidden transition-transform duration-300 ease-in-out hover:scale-[1.03] hover:shadow-2xl flex flex-col">
      {/* Image Container */}
      <div className="relative w-full h-80 overflow-hidden flex items-center justify-center">
        <Image
          src={book.imageURL}
          alt={book.title}
          fill
          className="object-contain transition-transform duration-300 ease-in-out group-hover:scale-110"
        />

        {/* Discount Badge */}
        {book.discount > 0 && (
          <div className="absolute top-4 left-4 bg-accent text-base-100 text-sm font-bold px-3 py-1 rounded-full z-10">
            {book.discount}% OFF
          </div>
        )}

        {/* Hover Icons Overlay - Now with individual button backgrounds */}
        <ActionButtons book={book} />
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col items-center flex-grow">
        <h3 className="text-xl font-bold text-primary mb-1 text-center line-clamp-2">
          {book.title}
        </h3>
        <p className="text-sm text-neutral mb-3 text-center truncate w-full">
          by {book.author}
        </p>

        {/* Price and Discount */}
        <div className="mt-auto flex items-baseline space-x-2">
          {book.discount > 0 && (
            <span className="text-md text-gray-500 line-through">
              BDT {book.price}
            </span>
          )}
          <span className="text-2xl font-extrabold text-accent">
            BDT {finalPrice.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
