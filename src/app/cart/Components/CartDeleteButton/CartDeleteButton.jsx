"use client"
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";
import Swal from "sweetalert2";

const CartDeleteButton = ({ item, setCart, cart }) => {
    const router = useRouter()
  // Delete handler
  const handleDelete = async (id) => {
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
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/cart/${id}`,
          {
            method: "DELETE",
          }
        );

        if (res.ok) {
          setCart(cart.filter((item) => item._id !== id));
          toast.success("The book has been removed.");
          router.refresh();
        }
      } catch (error) {
        toast.error(error);
      }
    }
  };
  return (
    <button
      onClick={() => handleDelete(item._id)}
      className="btn btn-sm btn-circle bg-red-500 text-base-100 border-none hover:scale-110 transition"
    >
      <MdClose />
    </button>
  );
};

export default CartDeleteButton;
