"use client";
import React, { useState } from "react";
import { BsCartPlusFill } from "react-icons/bs";
import { FaMinus, FaPlus } from "react-icons/fa";

const CartButton = ({book}) => {
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    setIsAddedToCart(true);

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
          className={`btn btn-primary w-full md:w-auto ${
            isAddedToCart ? "btn-success" : ""
          }`}
          disabled={isAddedToCart}
        >
          <BsCartPlusFill className="text-xl" />
          {isAddedToCart ? "Added to Cart" : "Add to Cart"}
        </button>
        <a className="btn btn-outline btn-neutral w-full md:w-auto">
          Add to Wishlist
        </a>
      </div>
    </div>
  );
};

export default CartButton;
