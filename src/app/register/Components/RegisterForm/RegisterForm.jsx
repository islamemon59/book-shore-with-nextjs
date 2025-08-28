"use client";

import { useState } from "react";
import SocialLogin from "@/app/login/Components/SocialLogin/SocialLogin";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from 'react-hot-toast';

// 1. Define Zod schema for validation
const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  photo: z.string().url({ message: "Invalid URL" }).optional().or(z.literal('')),
});

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const handleRegister = (data) => {
    setLoading(true);
    // 👉 Add actual registration logic here
    toast.success("Registration successful!");
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div>
      {/* Name, Email, Password, Photo */}
      <form onSubmit={handleSubmit(handleRegister)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-neutral mb-2">Name</label>
          <input
            type="text"
            placeholder="John Doe"
            className={`input input-bordered w-full transition-colors duration-200 ${
              errors.name ? "input-error" : ""
            }`}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-error text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral mb-2">Email</label>
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
          <label className="block text-sm font-medium text-neutral mb-2">Password</label>
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

        <div>
          <label className="block text-sm font-medium text-neutral mb-2">Photo URL</label>
          <input
            type="url"
            placeholder="https://example.com/photo.jpg"
            className={`input input-bordered w-full transition-colors duration-200 ${
              errors.photo ? "input-error" : ""
            }`}
            {...register("photo")}
          />
          {errors.photo && (
            <p className="text-error text-xs mt-1">{errors.photo.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {loading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Register"
          )}
        </button>
      </form>

      {/* Divider with improved styling */}
      <div className="divider text-sm text-neutral-content opacity-70">
        OR
      </div>

      {/* Social Register */}
      <SocialLogin loading={loading} setLoading={setLoading} />
    </div>
  );
}