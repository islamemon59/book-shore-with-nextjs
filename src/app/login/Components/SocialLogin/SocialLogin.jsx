"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useState } from "react";

export default function SocialLogin() {
  const [loading, setLoading] = useState(false);
  const handleSocialLogin = (provider) => {
    setLoading(true);
    // Placeholder for social login logic
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="space-y-4">
      {/* Google Login Button */}
      <button
        onClick={() => handleSocialLogin("google")}
        disabled={loading}
        // Added justify-center and items-center for centering
        className="btn btn-outline w-full flex items-center justify-center gap-2 hover:bg-base-100 transition-colors duration-200"
      >
        {loading ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
          </>
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
