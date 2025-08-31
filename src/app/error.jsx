"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiAlertTriangle } from "react-icons/fi";

export default function Error({ error, reset }) {
  const router = useRouter();

  useEffect(() => {
    console.error("Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-base-200">
      <div className="bg-base-100 shadow-xl rounded-2xl p-8 max-w-md">
        <FiAlertTriangle className="w-16 h-16 text-error mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-error">
          Something went wrong
        </h1>
        <p className="text-base-content mb-6">
          We couldn’t complete your request. Please try again.
        </p>

        <div className="flex gap-4 justify-center">
          <button onClick={() => reset()} className="btn btn-error btn-outline">
            Retry
          </button>
          <button onClick={() => router.push("/")} className="btn btn-primary">
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
