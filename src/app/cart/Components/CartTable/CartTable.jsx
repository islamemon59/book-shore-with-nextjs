"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import CartDeleteButton from "../CartDeleteButton/CartDeleteButton";
import OrderSummary from "../OrderSummary/OrderSummary";
import UpdateQuantityButton from "../UpdateQuantityButton/UpdateQuantityButton";
import { div } from "framer-motion/client";

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

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-7xl bg-base-100 rounded-3xl p-8 shadow-2xl">
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
          <div>
            <h1 className="text-3xl text-center font-bold text-neutral my-8">
              🛒 Shopping Cart
            </h1>
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
                        <UpdateQuantityButton
                          item={item}
                          cart={cart}
                          setCart={setCart}
                        />
                        <span className="text-lg font-bold text-accent min-w-[70px] text-right">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <CartDeleteButton
                          cart={cart}
                          setCart={setCart}
                          item={item}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <OrderSummary
                subtotal={subtotal}
                shipping={shipping}
                taxRate={taxRate}
                total={total}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
