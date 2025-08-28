"use client";

import { FcGoogle } from "react-icons/fc";

export default function SocialLogin({ loading, setLoading }) {
  const handleGoogle = () => {
    setLoading(true);
    // 👉 Add Google login logic later
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleGoogle}
        disabled={loading}
        className="btn btn-outline w-full flex items-center gap-2 hover:bg-base-100"
      >
        <FcGoogle className="text-xl" />
        {loading ? "Please wait..." : "Continue with Google"}
      </button>
    </div>
  );
}
