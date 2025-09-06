"use client";
import React, { useState } from "react";
import { BsCartPlusFill } from "react-icons/bs";
import { FaMinus, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";

const CartButton = ({ book }) => {
  const [loading, setLoading] = useState(false)
  const [quantity, setQuantity] = useState(1);

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: book._id,
          title:book.title,
          author: book.author,
          genre: book.genre,
          price: book.price,
          discount: book.discount,
          imageURL: book.imageURL,
          quantity: 1,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setLoading(false)
        Swal.fire({
          icon: "success",
          title: "Added to Cart 🛒",
          text: `${book.title} has been added to your cart!`,
          confirmButtonColor: "#3085d6",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: data.error || "Something went wrong",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    }
  };
  return (
    <div>
      {/* Quantity Selector Section */}
      <div className="flex items-center space-x-4 mb-8">
        <span className="text-lg font-semibold text-gray-800">Quantity:</span>
        <div className="join border border-gray-300 rounded-full">
          <button
            className="join-item btn btn-ghost btn-circle"
            onClick={handleDecreaseQuantity}
          >
            <FaMinus />
          </button>
          <span className="join-item px-4 flex items-center text-lg font-bold">
            {quantity}
          </span>
          <button
            className="join-item btn btn-ghost btn-circle"
            onClick={handleIncreaseQuantity}
          >
            <FaPlus />
          </button>
        </div>
      </div>

      <div className="card-actions flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center mb-8">
        <button
          onClick={handleAddToCart}
          className={`btn btn-primary w-full md:w-auto`}
        >
          <BsCartPlusFill className="text-xl" />
          {loading ? <span className="loading loading-spinner loading-md text-base-100"></span> : "Add to Cart"}
        </button>
        <a className="btn btn-outline btn-neutral w-full md:w-auto">
          Add to Wishlist
        </a>
      </div>
    </div>
  );
};

export default CartButton;
