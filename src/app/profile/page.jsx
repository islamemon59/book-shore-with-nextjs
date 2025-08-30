// src/app/profile/page.jsx

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import UpdateProfileButton from "./Components/UpdateProfileButton/UpdateProfileButton";
import LogoutButton from "./Components/LogoutButton/LogoutButton";
import { authOptions } from "@/lib/authOptions";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = session?.user;
  console.log(user);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-gray-50 overflow-hidden">
      {/* Dynamic Background Circles */}
      <div className="absolute w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob top-16 left-1/4"></div>
      <div className="absolute w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000 bottom-16 right-1/4"></div>

      {/* Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-sm overflow-hidden bg-white/70 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl transition-all duration-500 hover:scale-105">
        <figure className="relative h-48 w-full">
          <Image
            src={user?.image || "https://i.ibb.co/68qJj2h/user-1.webp"}
            alt="User Avatar"
            fill
            className="object-cover"
          />
        </figure>
        <div className="p-8 text-center text-gray-900">
          <h2 className="text-3xl font-extrabold tracking-wide mb-2">
            {user?.name}
          </h2>
          <p className="text-sm font-light text-gray-500 mb-6">{user?.email}</p>
          <div className="flex flex-col space-y-4">
            <UpdateProfileButton />
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}
