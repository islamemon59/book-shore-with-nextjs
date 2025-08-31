"use client";

import { useSession, signOut } from "next-auth/react";
import { FaUser, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function UserMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const menuLinkClass =
    "flex items-center gap-2 p-2 rounded-lg font-medium transition-colors duration-200";
  const hoverClass = "hover:bg-gray-100";
  const iconColorClass = "text-[#144D75]";

  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0][0].toUpperCase();
  };

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
    <div className="relative list-none">
      {/* Avatar Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition "
      >
        {session.user?.image ? (
          <Image
            src={session.user.image}
            alt="User Avatar"
            width={36}
            height={36}
            className="rounded-full object-cover border-2 border-primary"
          />
        ) : (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
            style={{ backgroundColor: "#EDF6F8", color: "#144D75" }}
          >
            {getInitials(session.user?.name)}
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-xl p-2 z-50"
          >
            <li>
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className={`${menuLinkClass} ${hoverClass} hover:text-[#3489BD]`}
              >
                <FaUser className={iconColorClass} />
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  setOpen(false);
                  signOut({ callbackUrl: "/login" });
                }}
                className={`${menuLinkClass} ${hoverClass} hover:text-red-500 w-full text-left`}
              >
                <FaSignOutAlt className={iconColorClass} />
                Logout
              </button>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
