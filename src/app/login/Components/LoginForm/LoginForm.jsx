"use client";

import { useState } from "react";
import SocialLogin from "../SocialLogin/SocialLogin";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "react-hot-toast"; // You can remove this import if no longer used
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2"; // Import SweetAlert2

// 1. Define Zod schema for validation
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data) => {
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        // Use react-hot-toast for errors as it's non-blocking
        toast.error("Invalid email or password.");
        setLoading(false);
      } else {
        // Use SweetAlert for successful login
        await Swal.fire({
          icon: "success",
          title: "Login Successful!",
          text: "Redirecting to your dashboard...",
          showConfirmButton: false,
          timer: 1500,
        });

        router.push("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Email / Password Form */}
      <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-neutral mb-2">
            Email Address
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            className={`input input-bordered w-full transition-colors duration-200 ${
              errors.email ? "input-error" : ""
            }`}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-error text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className={`input input-bordered w-full transition-colors duration-200 ${
              errors.password ? "input-error" : ""
            }`}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-error text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Remember me + Forgot password */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-neutral cursor-pointer">
            <input type="checkbox" className="checkbox checkbox-sm" />
            Remember me
          </label>
          <Link
            href="/forgot-password"
            className="text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {loading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Login"
          )}
        </button>
      </form>

      {/* Divider with improved styling */}
      <div className="divider text-sm text-neutral-content opacity-70">OR</div>

      {/* Social Login */}
      <SocialLogin />
    </div>
  );
}
