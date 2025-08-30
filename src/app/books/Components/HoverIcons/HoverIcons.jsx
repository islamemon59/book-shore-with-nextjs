import Link from "next/link";
import { FaHeart, FaEye } from "react-icons/fa";
import { BsCartPlusFill } from "react-icons/bs";

const HoverIcons = ({book}) => {
  return (
    <div className="absolute inset-x-0 bottom-0 flex items-end justify-center space-x-4 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      {/* Add to Cart Icon Button */}
      <Link href={`/add-to-cart/${book._id}`} passHref>
        <div className="bg-base-100 p-3 rounded-full shadow-md hover:bg-base-100 transition-all duration-200">
          <BsCartPlusFill
            className="text-primary text-2xl cursor-pointer"
            title="Add to Cart"
          />
        </div>
      </Link>
      {/* Add to Wishlist Icon Button */}
      <Link href={`/wishlist/${book._id}`} passHref>
        <div className="bg-base-100 p-3 rounded-full shadow-md hover:bg-base-100 transition-all duration-200">
          <FaHeart
            className="text-primary text-2xl cursor-pointer"
            title="Add to Wishlist"
          />
        </div>
      </Link>
      {/* View Details Icon Button */}
      <Link href={`/book/${book._id}`} passHref>
        <div className="bg-base-100 p-3 rounded-full shadow-md hover:bg-base-100 transition-all duration-200">
          <FaEye
            className="text-primary text-2xl cursor-pointer"
            title="View Details"
          />
        </div>
      </Link>
    </div>
  );
};

export default HoverIcons;
