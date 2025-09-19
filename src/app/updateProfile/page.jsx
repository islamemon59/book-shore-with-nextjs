import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import UpdateProfileForm from "./UpdateProfileForm/UpdateProfileForm";

export default async function UpdateProfilePage() {
  // ✅ Get session on the server
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl text-red-500 font-semibold">
          Please login to update your profile
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-extrabold text-center mb-8">
          <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Update Profile
          </span>
          <div className="mt-2 flex justify-center">
            <span className="h-1 w-16 rounded-full bg-gradient-to-r from-primary via-secondary to-accent"></span>
          </div>
        </h1>
        {/* Pass user info into client form */}
        <UpdateProfileForm />
      </div>
    </div>
  );
}
