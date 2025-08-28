"use client";

import { useState } from "react";
import SocialLogin from "@/app/login/Components/SocialLogin/SocialLogin";

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    // 👉 Add register logic later
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div>
      {/* Name, Email, Password, Photo */}
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            placeholder="John Doe"
            className="input input-bordered w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="input input-bordered w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="input input-bordered w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Photo URL</label>
          <input
            type="url"
            placeholder="https://example.com/photo.jpg"
            className="input input-bordered w-full"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      {/* Divider */}
      <div className="divider text-sm">OR</div>

      {/* Social Register */}
      <SocialLogin loading={loading} setLoading={setLoading} />
    </div>
  );
}
