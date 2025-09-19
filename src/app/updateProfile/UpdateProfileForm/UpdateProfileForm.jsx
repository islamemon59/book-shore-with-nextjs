"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import Image from "next/image";

export default function UpdateProfileForm() {
  const { data: session, update } = useSession();
  const user = session?.user;
  console.log(user);
  const [preview, setPreview] = useState(user?.image || null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // 🔹 Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = e.target;
      const name = form.name.value;
      const email = form.email.value;
      const file = form.image.files[0];

      let imageUrl = user?.image;

      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        const uploadRes = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");

        imageUrl = uploadData.url;
      }

      const res = await fetch("/api/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, image: imageUrl }),
      });

      const data = await res.json();
      console.log(data);
      if (!res.ok || !data.user) throw new Error(data.error || "Update failed");

      // ✅ Update session instantly
      await update({
        name: data?.user?.name,
        email: data?.user?.email,
        image: data?.user?.image,
      });

      setLoading(false);

      Swal.fire("✅ Success!", "Profile updated successfully", "success");
    } catch (err) {
      Swal.fire("❌ Error", err.message, "error");
    }
  };

  return (
    <div className="p-8 bg-base-100 rounded-3xl shadow-2xl max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Preview and Upload */}
        <div className="flex flex-col items-center">
          <div className="relative w-28 h-28 mb-4">
            <Image
              src={preview || "/default-avatar.png"}
              alt="Profile Preview"
              fill
              className="rounded-full object-cover border-4 border-primary shadow-lg"
            />
          </div>
          <label className="block w-full text-center cursor-pointer font-medium text-info transition-colors duration-300 hover:text-info-focus">
            Change Profile Picture
            <input
              name="image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* Name Input */}
        <div>
          <label
            htmlFor="name"
            className="text-sm font-semibold text-neutral block mb-2"
          >
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="w-full px-4 py-3 rounded-xl bg-base-200 border-2 border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
            placeholder="Your Name"
            defaultValue={user?.name}
          />
        </div>

        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="text-sm font-semibold text-neutral block mb-2"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full px-4 py-3 rounded-xl bg-base-200 border-2 border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
            placeholder="Your Email"
            defaultValue={user?.email}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-xl font-bold text-lg text-primary-content bg-gradient-to-r from-primary to-secondary shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          {loading ? (
            <span className="loading loading-spinner text-base-100"></span>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
}
