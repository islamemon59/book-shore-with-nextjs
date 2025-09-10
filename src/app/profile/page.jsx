import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import UpdateProfileButton from "./Components/UpdateProfileButton/UpdateProfileButton";
import LogoutButton from "./Components/LogoutButton/LogoutButton";
import { authOptions } from "@/lib/authOptions";

export const generateMetadata = () => {
  return {
    title: "BookShore | Profile",
  };
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = session?.user;

  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.split(" ");
    if (parts.length > 1) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return parts[0].charAt(0).toUpperCase();
  };

  const userInitials = getInitials(user?.name);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 bg-base-100 overflow-hidden">
      {/* Profile Card */}
      <div className="relative z-10 w-full max-w-sm backdrop-blur-md bg-white/90 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-neutral/20">
        <div className="flex flex-col items-center p-8 pt-16">
          {/* User Image or Initials */}
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary shadow-lg -mt-10 mb-4 bg-neutral flex items-center justify-center text-4xl font-bold text-base-100">
            {user?.image ? (
              <Image
                src={user.image}
                alt="User Avatar"
                fill
                className="object-cover"
              />
            ) : (
              <span>{userInitials}</span>
            )}
          </div>

          {/* User Name and Email */}
          <h2 className="text-3xl font-extrabold tracking-wide mb-1 text-primary">
            {user?.name || "User Name"}
          </h2>
          <p className="text-sm font-light text-secondary mb-6">
            {user?.email || "user@example.com"}
          </p>

          {/* Action Buttons */}
          <div className="w-full space-y-4">
            <UpdateProfileButton className="w-full bg-primary hover:bg-secondary text-base-100 font-semibold rounded-xl py-2 shadow-md transition-all duration-200" />
            <LogoutButton className="w-full bg-accent hover:bg-neutral text-base-100 font-semibold rounded-xl py-2 shadow-md transition-all duration-200" />
          </div>
        </div>
      </div>

      {/* Floating color accents */}
      <div className="absolute top-24 left-24 w-60 h-60 bg-secondary rounded-full opacity-30 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-24 right-24 w-72 h-72 bg-primary rounded-full opacity-25 blur-3xl animate-pulse"></div>
    </div>
  );
}
