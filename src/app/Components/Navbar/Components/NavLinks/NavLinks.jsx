// components/NavLinks.jsx
import { FaHome, FaBook, FaShoppingCart, FaTachometerAlt } from "react-icons/fa";
import Link from "next/link";

export default function NavLinks({ isAdmin }) {
  return (
    <>
      <li>
        <Link href="/" className="flex items-center gap-2 transition hover:text-primary">
          <FaHome /> Home
        </Link>
      </li>
      <li>
        <Link href="/books" className="flex items-center gap-2 transition hover:text-primary">
          <FaBook /> All Books
        </Link>
      </li>
      <li>
        <Link href="/cart" className="flex items-center gap-2 transition hover:text-primary">
          <FaShoppingCart /> Cart
        </Link>
      </li>
      {isAdmin && (
        <li>
          <Link href="/dashboard" className="flex items-center gap-2 transition hover:text-primary">
            <FaTachometerAlt /> Dashboard
          </Link>
        </li>
      )}
    </>
  );
}
