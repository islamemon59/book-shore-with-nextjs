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
    <div className="min-h-screen bg-base-100 flex items-center justify-center">
      <div className="w-full max-w-lg bg-base-100 shadow-xl rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-neutral mb-6">Update Profile</h1>
        {/* Pass user info into client form */}
        <UpdateProfileForm user={session.user} />
      </div>
    </div>
  );
}
