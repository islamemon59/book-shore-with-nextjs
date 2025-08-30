"use client";

import { useState } from "react";
import SocialLogin from "@/app/login/Components/SocialLogin/SocialLogin";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  photo: z.any().optional(),
});

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const handleRegister = async (data) => {
    setLoading(true);
    let photoUrl = "";

    try {
      // 1. Upload the image file if it exists
      if (data.photo && data.photo.length > 0) {
        const imageFile = data.photo[0];
        const formData = new FormData();
        formData.append("image", imageFile);

        const uploadResponse = await fetch(`/api/upload-image`, {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
          toast.error(uploadData.message || "Failed to upload image.");
          setLoading(false);
          return;
        }
        photoUrl = uploadData.url;
      }

      // 2. Submit the registration data with the new photo URL
      const registrationData = {
        name: data.name,
        email: data.email,
        password: data.password,
        image: photoUrl || null, // Use the URL or null if no photo was uploaded
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registrationData),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          toast.error(responseData.message);
        } else {
          toast.error(
            responseData.message || "Registration failed. Please try again."
          );
        }
      } else {
        await Swal.fire({
          icon: "success",
          title: "Registration Successful!",
          text: "You can now log in.",
          showConfirmButton: false,
          timer: 2000,
        });
        router.push("/login");
      }
    } catch (error) {
      console.error("Client-side error:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(handleRegister)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-neutral mb-2">
            Name
          </label>
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
          <label className="block text-sm font-medium text-neutral mb-2">
            Email
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

        {/* Changed input type to "file" and removed URL validation from schema */}
        <div>
          <label className="block text-sm font-medium text-neutral mb-2">
            Photo
          </label>
          <input
            type="file"
            className={`file-input file-input-bordered w-full transition-colors duration-200 ${
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

      <div className="divider text-sm text-neutral-content opacity-70">OR</div>
      <SocialLogin loading={loading} setLoading={setLoading} />
    </div>
  );
}
