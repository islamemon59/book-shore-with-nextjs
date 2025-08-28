import { FaHome, FaBook, FaShoppingCart, FaTachometerAlt } from "react-icons/fa";
import Link from "next/link";

export default function NavLinks({ isAdmin }) {
  // Define a base class for link styling
  const linkBaseClass = "flex items-center gap-2 p-2 rounded-lg font-medium transition-colors duration-200";
  // Define classes for hover and active state
  const linkHoverClass = "hover:bg-gray-100 hover:text-[#3489BD]";
  const iconColorClass = "text-[#144D75]";

  return (
    <>
      <li>
        <Link href="/" className={`${linkBaseClass} ${linkHoverClass}`}>
          <FaHome className={iconColorClass} />
          Home
        </Link>
      </li>
      <li>
        <Link href="/books" className={`${linkBaseClass} ${linkHoverClass}`}>
          <FaBook className={iconColorClass} />
          All Books
        </Link>
      </li>
      <li>
        <Link href="/cart" className={`${linkBaseClass} ${linkHoverClass}`}>
          <FaShoppingCart className={iconColorClass} />
          Cart
        </Link>
      </li>
      {isAdmin && (
        <li>
          <Link href="/dashboard" className={`${linkBaseClass} ${linkHoverClass}`}>
            <FaTachometerAlt className={iconColorClass} />
            Dashboard
          </Link>
        </li>
      )}
    </>
  );
}