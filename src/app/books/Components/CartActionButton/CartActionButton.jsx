"use client";

import { useState } from "react";
import { BsCartPlusFill } from "react-icons/bs";
import Swal from "sweetalert2";

const CartActionButton = ({ book }) => {
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: book._id,
          title: book.title,
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
        setLoading(false);
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
    <button onClick={handleAddToCart}>
      <div className="bg-base-100 p-3 rounded-full shadow-md hover:bg-base-100 transition-all duration-200">
        {loading ? (
          <span className="loading loading-spinner loading-sm text-primary"></span>
        ) : (
          <BsCartPlusFill
            className="text-primary text-2xl cursor-pointer"
            title="Add to Cart"
          />
        )}
      </div>
    </button>
  );
};

export default CartActionButton;
