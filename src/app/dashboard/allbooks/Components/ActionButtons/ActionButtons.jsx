"use client";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function ActionButtons({ id }) {
  const router = useRouter();

  // Delete handler
  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This book will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`/api/books/${id}`, { method: "DELETE" });

        if (res.ok) {
          Swal.fire("Deleted!", "The book has been removed.", "success");
          router.refresh(); // reload data from server
        } else {
          Swal.fire("Error!", "Failed to delete book.", "error");
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };

  // Update handler
  const handleUpdate = () => {
    router.push(`/dashboard/books/update/${id}`);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleUpdate}
        className="flex items-center gap-2 px-4 py-2 text-info transition-all duration-300 hover:bg-info hover:text-info-content rounded-xl shadow-md hover:shadow-lg"
      >
        <FaEdit />
        <span className="font-medium">Edit</span>
      </button>
      <button
        onClick={handleDelete}
        className="flex items-center gap-2 px-4 py-2 text-error transition-all duration-300 hover:bg-error hover:text-error-content rounded-xl shadow-md hover:shadow-lg"
      >
        <FaTrash />
        <span className="font-medium">Delete</span>
      </button>
    </div>
  );
}
