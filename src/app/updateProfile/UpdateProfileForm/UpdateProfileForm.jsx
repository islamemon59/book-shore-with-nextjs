"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import Image from "next/image";

export default function UpdateProfileForm({ user }) {
  const { update } = useSession(); // session already passed from server
  const [preview, setPreview] = useState(user?.image || null);

  // 🔹 Handle image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // 🔹 Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

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
      if (!res.ok) throw new Error(data.error || "Update failed");

      // ✅ Update session instantly
      await update({
        name: data.user.name,
        email: data.user.email,
        image: data.user.image,
      });

      Swal.fire("✅ Success!", "Profile updated successfully", "success");
    } catch (err) {
      Swal.fire("❌ Error", err.message, "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Image Preview */}
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24 mb-2">
          <Image
            src={preview || "/default-avatar.png"}
            alt="Profile Preview"
            fill
            className="rounded-full object-cover"
          />
        </div>
      </div>

      {/* Name */}
      <input
        name="name"
        type="text"
        className="input input-bordered w-full"
        placeholder="Your Name"
        defaultValue={user?.name}
      />

      {/* Email */}
      <input
        name="email"
        type="email"
        className="input input-bordered w-full"
        placeholder="Your Email"
        defaultValue={user?.email}
      />

      {/* File Upload */}
      <input
        name="image"
        type="file"
        accept="image/*"
        className="file-input file-input-bordered w-full"
        onChange={handleImageChange}
      />

      <button type="submit" className="btn btn-primary w-full">
        Save Changes
      </button>
    </form>
  );
}
