"use client";

import { useSession, signOut } from "next-auth/react";
import { FaSignOutAlt, FaEnvelope } from "react-icons/fa";
import Image from "next/image";

export default function Profile() {
  const { data: session } = useSession();

  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0][0].toUpperCase();
  };

  return (
    <div className="flex flex-col items-center text-center p-6 bg-white shadow-xl rounded-2xl border border-gray-200">
      {/* Avatar */}
      <div className="avatar mb-4">
        <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt="User Avatar"
              width={80}
              height={80}
              className="object-cover"
            />
          ) : (
            <div className="w-20 h-20 flex items-center justify-center text-xl font-bold bg-primary text-white">
              {getInitials(session?.user?.name || "U")}
            </div>
          )}
        </div>
      </div>

      {/* User Info */}
      <h2 className="font-bold text-xl text-gray-800">
        {session?.user?.name || "Unknown User"}
      </h2>
      <p className="flex items-center gap-2 text-sm text-gray-500 mt-1">
        <FaEnvelope className="text-primary" />
        {session?.user?.email || "No email"}
      </p>

      {/* Logout Button */}
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="btn btn-sm btn-error mt-4 flex text-base-100 items-center gap-2 rounded-full shadow hover:scale-105 transition"
      >
        <FaSignOutAlt />
        Logout
      </button>
    </div>
  );
}
