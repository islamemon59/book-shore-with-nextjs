"use client"
import React, { useState } from "react";
import { BsCartPlusFill } from "react-icons/bs";

const CartButton = () => {
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const handleAddToCart = () => {
    // Add logic to add the item to the cart
    console.log(`Adding ${book.title} to cart.`);
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000); // Reset button state
  };
  return (
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
  );
};

export default CartButton;
