"use client";

import { useState } from "react";
import SocialLogin from "../SocialLogin/SocialLogin";


export default function LoginForm() {
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    // 👉 Add email/password login logic later
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div>
      {/* Email / Password Form */}
      <form onSubmit={handleLogin} className="space-y-4">
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

        {/* Remember me + Forgot password */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="checkbox checkbox-sm" />
            Remember me
          </label>
          <a href="/forgot-password" className="text-primary hover:underline">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>

      {/* Divider */}
      <div className="divider text-sm">OR</div>

      {/* Social Login */}
      <SocialLogin loading={loading} setLoading={setLoading} />
    </div>
  );
}
