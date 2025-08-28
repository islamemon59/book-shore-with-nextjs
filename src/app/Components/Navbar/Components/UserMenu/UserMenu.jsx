"use client";

import { useSession, signOut } from "next-auth/react";
import { FaUser, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";

export default function UserMenu() {
  const { data: session } = useSession();

  // Define a base class for the menu items
  const menuLinkClass = "flex items-center gap-2 p-2 rounded-lg font-medium transition-colors duration-200";
  const hoverClass = "hover:bg-gray-100";
  const iconColorClass = "text-[#144D75]"; // Neutral color from your palette

  if (!session) {
    return (
      <>
        <li>
          <Link
            href="/login"
            className={`${menuLinkClass} ${hoverClass} hover:text-[#3489BD]`}
          >
            <FaSignInAlt className={iconColorClass} />
            Login
          </Link>
        </li>
        <li>
          <Link
            href="/register"
            className={`${menuLinkClass} ${hoverClass} hover:text-[#3489BD]`}
          >
            <FaUser className={iconColorClass} />
            Register
          </Link>
        </li>
      </>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <li className="list-none">
        <Link
          href="/profile"
          className={`${menuLinkClass} ${hoverClass} hover:text-[#3489BD]`}
        >
          <FaUser className={iconColorClass} />
          Profile
        </Link>
      </li>
      <li className="list-none">
        <button
          onClick={() => signOut()}
          className={`${menuLinkClass} ${hoverClass} hover:text-error`}
        >
          <FaSignOutAlt className={iconColorClass} />
          Logout
        </button>
      </li>
    </motion.div>
  );
}