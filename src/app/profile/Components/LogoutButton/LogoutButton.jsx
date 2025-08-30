"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import Swal from "sweetalert2";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await signOut({ callbackUrl: "/login" });
      }
    });
    setLoading(false);
  };

  return (
    <button
      onClick={handleLogout}
      className="btn btn-neutral w-full mt-2"
      disabled={loading}
    >
      {loading ? (
        <span className="loading loading-spinner"></span>
      ) : (
        "Logout"
      )}
    </button>
  );
}