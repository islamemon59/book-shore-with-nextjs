"use client";

import { useRouter } from "next/navigation";



export default function UpdateProfileButton() {
  const router = useRouter()
  const handleUpdate = () => {
router.push("/updateProfile")
  };

  return (
    <button onClick={handleUpdate} className="btn btn-primary w-full">
      Update Profile
    </button>
  );
}