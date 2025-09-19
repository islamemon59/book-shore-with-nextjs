"use client"
import {
  FaHome,
  FaBook,
  FaShoppingCart,
  FaTachometerAlt,
} from "react-icons/fa";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function NavLinks() {
  const linkBaseClass =
    "flex group items-center gap-2 p-2 rounded-lg font-medium transition-colors duration-200";
  const linkHoverClass = " hover:bg-secondary hover:text-base-100";
  const iconColorClass = "text-[#144D75] group-hover:text-base-100";
  const {status} = useSession();
  const isUser = status === "authenticated"

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
      {isUser && (
        <li>
          <Link
            href="/dashboard"
            className={`${linkBaseClass} ${linkHoverClass}`}
          >
            <FaTachometerAlt className={iconColorClass} />
            Dashboard
          </Link>
        </li>
      )}
    </>
  );
}
