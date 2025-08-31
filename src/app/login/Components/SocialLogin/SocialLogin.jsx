"use client";

import { FcGoogle } from "react-icons/fc";
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function SocialLogin() {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  // Watch for session changes and redirect
  useEffect(() => {
    if (session) {
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Redirecting to home page...",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        router.push("/"); // Redirect to home after SweetAlert
      });
    }
  }, [session, router]);

  const handleSocialLogin = async (provider) => {
    setLoading(true);
    try {
      // Redirect false so we can handle manually
      await signIn(provider, { redirect: false });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => handleSocialLogin("google")}
        disabled={loading}
        className="btn btn-outline w-full flex items-center justify-center gap-2 hover:bg-base-100 transition-colors duration-200"
      >
        {loading ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : (
          <>
            <FcGoogle className="text-xl" />
            <span className="text-base-content">Continue with Google</span>
          </>
        )}
      </button>
    </div>
  );
}
