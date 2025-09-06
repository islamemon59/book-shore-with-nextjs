import Image from "next/image";
import { FaHeart, FaShareAlt } from "react-icons/fa";
import CartButton from "../CartButton/CartButton";

export default function BookDetails({ book }) {
  return (
    <div className="card lg:card-side bg-base-100 shadow-xl p-6 md:p-12">
      <figure className="relative flex-none w-full lg:w-1/3 h-96 md:h-[600px] mb-8 lg:mb-0 rounded-lg overflow-hidden">
        <Image
          src={book.imageURL}
          alt={book.title}
          fill
          priority
          className="object-contain"
        />
      </figure>

      <div className="card-body p-0 lg:ml-12">
        <div className="flex justify-between items-start mb-4">
          <h1 className="card-title text-3xl md:text-4xl font-extrabold text-[var(--color-primary)]">
            {book.title}
          </h1>
          <div className="flex items-center space-x-2">
            <button className="btn btn-ghost btn-circle text-2xl text-[var(--color-neutral)]">
              <FaShareAlt />
            </button>
            <button className="btn btn-ghost btn-circle text-2xl text-red-500">
              <FaHeart />
            </button>
          </div>
        </div>

        <h2 className="text-xl text-[var(--color-neutral)] mb-6">
          by **{book.author}**
        </h2>

        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          {book.description}
        </p>

        <div className="divider"></div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-baseline space-x-4">
            {book.discount > 0 && (
              <span className="text-xl text-gray-500 line-through">
                BDT {book.price}
              </span>
            )}
            <span className="text-4xl font-extrabold text-[var(--color-accent)]">
              BDT {book.finalPrice.toFixed(2)}
            </span>
            {book.discount > 0 && (
              <div className="badge badge-accent text-white font-bold text-lg">
                {book.discount}% OFF
              </div>
            )}
          </div>
        </div>

        <CartButton book={book} />

        {/* More Relevant Information Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-gray-700">
            <span className="font-semibold">Genre:</span>
            <span>{book.genre}</span>
          </div>
          <div className="flex justify-between items-center text-gray-700">
            <span className="font-semibold">Publication Year:</span>
            <span>2024</span> {/* Static data for example */}
          </div>
          <div className="flex justify-between items-center text-gray-700">
            <span className="font-semibold">Publisher:</span>
            <span>Penguin Random House</span> {/* Static data for example */}
          </div>
          <div className="flex justify-between items-center text-gray-700">
            <span className="font-semibold">Language:</span>
            <span>English</span> {/* Static data for example */}
          </div>
        </div>
      </div>
    </div>
  );
}
