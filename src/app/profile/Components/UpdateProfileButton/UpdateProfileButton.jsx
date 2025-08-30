"use client";

import Swal from "sweetalert2";

export default function UpdateProfileButton() {
  const handleUpdate = () => {
    // Implement your profile update logic here
    // e.g., redirect to an update form
    Swal.fire({
      icon: "info",
      title: "Update Profile",
      text: "Functionality for updating the profile will be added here.",
    });
  };

  return (
    <button onClick={handleUpdate} className="btn btn-primary w-full">
      Update Profile
    </button>
  );
}