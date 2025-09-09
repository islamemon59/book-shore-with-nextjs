"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";

// React Icons
import {
  MdAdd,
  MdRemove,
  MdClose,
  MdLocalShipping,
  MdDiscount,
  MdAttachMoney,
  MdCreditCard,
} from "react-icons/md";
import toast from "react-hot-toast";

export default function CartTable({ items }) {
  const [cart, setCart] = useState(items);
  const shipping = 5.99; // Mock shipping
  const taxRate = 0.08; // 8% tax

  // Subtotal
  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
);

  // Total = subtotal + shipping + tax
  const total = useMemo(
    () => subtotal + shipping + subtotal * taxRate,
    [subtotal]
  );

  // Delete handler
  const handleDelete = async (id) => {
    setCart(cart.filter((item) => item._id !== id));
    Swal.fire("Deleted!", "Item removed from cart.", "success");
  };

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
      console.log(data);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl bg-base-100 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-neutral mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 text-neutral">
            <h2 className="text-4xl font-extrabold mb-4">
              🛒 Your cart is empty
            </h2>
            <p className="text-lg font-light mb-6">
              Looks like you haven't added anything yet.
            </p>
            <Link
              href="/books"
              className="mt-6 btn btn-lg bg-primary text-base-100 rounded-full border-none shadow-lg hover:scale-105 hover:shadow-xl transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-6">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col md:flex-row items-center bg-base-100 rounded-2xl p-4 shadow-sm hover:shadow-lg transition"
                >
                  {/* Book Image */}
                  <div className="relative w-full h-40 md:w-32 md:h-32 mb-4 md:mb-0 md:mr-6">
                    <Image
                      src={item.imageURL}
                      alt={item.title}
                      fill
                      className="rounded-lg shadow-md object-cover"
                    />
                  </div>

                  {/* Info & Actions */}
                  <div className="flex-grow flex flex-col md:flex-row items-center justify-between w-full">
                    {/* Title */}
                    <div className="text-center md:text-left mb-4 md:mb-0">
                      <h3 className="text-lg font-semibold text-neutral">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Price: ${item.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity & Total */}
                    <div className="flex items-center gap-4">
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
                      <span className="text-lg font-bold text-accent min-w-[70px] text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="btn btn-sm btn-circle bg-red-500 text-base-100 border-none hover:scale-110 transition"
                      >
                        <MdClose />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="md:col-span-1">
              <div className="bg-secondary text-base-100 rounded-3xl p-8 shadow-xl sticky top-8">
                <h3 className="text-2xl font-bold mb-6 border-b pb-4 border-base-100/40">
                  Order Summary
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <MdAttachMoney /> Subtotal
                    </span>
                    <span className="font-semibold">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <MdLocalShipping /> Shipping
                    </span>
                    <span className="font-semibold">
                      ${shipping.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <MdDiscount /> Tax ({taxRate * 100}%)
                    </span>
                    <span className="font-semibold">
                      ${(subtotal * taxRate).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-base-100/40 mt-6 pt-6">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="mt-8 btn btn-lg w-full bg-accent text-base-100 rounded-full shadow-lg hover:scale-105 transition"
                >
                  <MdCreditCard className="mr-2 text-xl" />
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
