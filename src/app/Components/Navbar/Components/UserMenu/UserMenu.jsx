"use client";

import { useSession, signOut } from "next-auth/react";
import { FaUser, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Loading from "@/app/loading";

export default function UserMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  const menuLinkClass =
    "flex items-center gap-2 p-2 rounded-lg group font-medium transition-colors duration-200";
  const hoverClass = "hover:bg-secondary hover:text-base-100";
  const iconColorClass = "text-[#144D75] group-hover:text-base-100";

  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0][0].toUpperCase();
  };

  // 🔹 Case 1: Still checking session → show loader
  if (status === "loading") return false


  // 🔹 Case 2: User not logged in
  if (status === "unauthenticated") {
    return (
      <>
        <li>
          <Link
            href="/login"
            className={`${menuLinkClass} ${hoverClass} hover:text-[#3489BD] hover:bg-gray-200`}
          >
            <FaSignInAlt className={iconColorClass} />
            Signin
          </Link>
        </li>
      </>
    );
  }

  // 🔹 Case 3: User logged in
  return (
    <div className="relative list-none">
      {/* Avatar Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition"
      >
        {session.user?.image ? (
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary relative">
            <Image
              src={session.user.image}
              alt="User Avatar"
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs"
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
                className={`${menuLinkClass} hover:bg-red-500 w-full hover:text-base-100 text-left`}
              >
                <FaSignOutAlt
                  className={`${iconColorClass} hover:text-base-100`}
                />
                Logout
              </button>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
