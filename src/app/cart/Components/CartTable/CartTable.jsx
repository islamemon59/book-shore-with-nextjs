"use client";
import Image from "next/image";
import { useState } from "react";
import Swal from "sweetalert2";
import Link from "next/link";

export default function CartTable({ items }) {
  const [cart, setCart] = useState(items);

  const handleDelete = async (id) => {
    const res = await fetch(`/api/cart/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCart(cart.filter((item) => item._id !== id));
      Swal.fire("Deleted!", "Item removed from cart.", "success");
    } else {
      Swal.fire("Error", "Failed to remove item.", "error");
    }
  };

  const handleUpdate = async (id, change) => {
    const res = await fetch(`/api/cart/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ change }),
    });

    if (res.ok) {
      const updated = await res.json();
      if (updated.removed) {
        setCart(cart.filter((item) => item._id !== id));
      } else {
        setCart(
          cart.map((item) =>
            item._id === id
              ? { ...item, quantity: item.quantity + change }
              : item
          )
        );
      }
    } else {
      Swal.fire("Error", "Failed to update quantity.", "error");
    }
  };

  return (
    <div className="overflow-x-auto bg-base-200 shadow-xl rounded-xl p-4">
      {cart.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-neutral">
            🛒 Your cart is empty
          </h2>
          <p className="text-base text-neutral mt-2">
            Start adding books to see them here.
          </p>
          <Link
            href="/books"
            className="mt-6 btn btn-primary rounded"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <table className="table w-full bg-base-100 rounded-lg">
          <thead className="bg-primary text-white sticky top-0">
            <tr>
              <th className="p-4">Cover</th>
              <th>Title</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
              <th className="text-center p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr
                key={item._id}
                className="hover:bg-base-200/70 transition-colors duration-200"
              >
                {/* Cover */}
                <td>
                  <div className="relative w-16 h-20 rounded-md overflow-hidden shadow-md ring-1 ring-base-300">
                    <Image
                      src={item.imageURL}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                </td>

                {/* Title */}
                <td className="font-semibold text-base text-neutral-content">
                  {item.title}
                </td>

                {/* Quantity */}
                <td>
                  <div className="flex items-center gap-2">
                    <button
                      className="btn btn-xs btn-outline"
                      onClick={() => handleUpdate(item._id, -1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="text-base font-medium">{item.quantity}</span>
                    <button
                      className="btn btn-xs btn-outline"
                      onClick={() => handleUpdate(item._id, 1)}
                    >
                      +
                    </button>
                  </div>
                </td>

                {/* Price */}
                <td className="text-base text-neutral-content">
                  ${item.price.toFixed(2)}
                </td>

                {/* Total */}
                <td className="text-base font-bold text-secondary">
                  ${(item.price * item.quantity).toFixed(2)}
                </td>

                {/* Actions */}
                <td className="text-center">
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="btn btn-xs btn-error"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
