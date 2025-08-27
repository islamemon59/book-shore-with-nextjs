"use client";

import { useSession, signOut } from "next-auth/react";
import { FaUser, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";

export default function UserMenu() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <>
        <li>
          <Link
            href="/login"
            className="flex items-center gap-2 transition hover:text-primary"
          >
            <FaSignInAlt /> Login
          </Link>
        </li>
        <li>
          <Link
            href="/register"
            className="flex items-center gap-2 transition hover:text-primary"
          >
            <FaUser /> Register
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
      <li>
        <Link
          href="/profile"
          className="flex items-center gap-2 transition hover:text-primary"
        >
          <FaUser /> Profile
        </Link>
      </li>
      <li>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 transition hover:text-error"
        >
          <FaSignOutAlt /> Logout
        </button>
      </li>
    </motion.div>
  );
}
