"use client"
import React from "react";
import toast from "react-hot-toast";
import { MdAdd, MdRemove } from "react-icons/md";

const UpdateQuantityButton = ({item, cart, setCart}) => {

      // Quantity update
  const handleUpdate = async (id, change) => {
    setCart(
      cart.map((item) =>
        item._id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/cart/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ change }),
        }
      );
      const data = await res.json();
      if (data.remove) {
        toast(<span className="text-primary font-bold">Quantity updated</span>);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="flex items-center space-x-2 bg-base-100 rounded-full p-1 shadow">
      <button
        className="btn btn-sm btn-circle text-neutral hover:bg-secondary hover:text-base-100"
        onClick={() => handleUpdate(item._id, -1)}
        disabled={item.quantity <= 1}
      >
        <MdRemove />
      </button>
      <span className="font-bold text-neutral w-6 text-center">
        {item.quantity}
      </span>
      <button
        className="btn btn-sm btn-circle text-neutral hover:bg-secondary hover:text-base-100"
        onClick={() => handleUpdate(item._id, 1)}
      >
        <MdAdd />
      </button>
    </div>
  );
};

export default UpdateQuantityButton;
