"use client";

import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  FaBook,
  FaUser,
  FaTags,
  FaDollarSign,
  FaPercent,
  FaImage,
} from "react-icons/fa";
import Swal from "sweetalert2";

const AddBookForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    discount: "",
    genre: "",
  });
  const [loading, setLoading] = useState(false);

  const genres = [
    "Fiction",
    "Non-fiction",
    "Fantasy",
    "Science Fiction",
    "Mystery",
    "Thriller",
    "Horror",
    "Romance",
    "Biography",
  ];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        imageURL: URL.createObjectURL(file),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        Swal.fire({
          icon: "success",
          title: "Book Added 🎉",
          text: "Your book has been successfully added!",
          confirmButtonColor: "#3085d6",
        });
        setLoading(false);
        setFormData({
          title: "",
          author: "",
          description: "",
          price: "",
          discount: "",
          genre: "",
          imageURL: "",
        });
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.message || "Failed to connect to server");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-5xl mx-auto p-8 md:p-12 space-y-10 bg-base-100 rounded-3xl shadow-xl"
    >
      {/* Section: Title & Author */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Book Title */}
        <div className="form-control">
          <label className="label font-semibold">Book Title</label>
          <div className="relative">
            <FaBook className="absolute left-3 top-3 text-secondary" />
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="The Midnight Library"
              className="w-full pl-10 py-3 rounded-lg border-2 border-primary bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              required
            />
          </div>
        </div>

        {/* Author */}
        <div className="form-control">
          <label className="label font-semibold">Author</label>
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-secondary" />
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Matt Haig"
              className="w-full pl-10 py-3 rounded-lg border-2 border-primary bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              required
            />
          </div>
        </div>
      </div>

      {/* Section: Pricing & Genre */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Price */}
        <div className="form-control">
          <label className="label font-semibold">Price ($)</label>
          <div className="relative">
            <FaDollarSign className="absolute left-3 top-3 text-secondary" />
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="19.99"
              className="w-full pl-10 py-3 rounded-lg border-2 border-primary bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        {/* Discount */}
        <div className="form-control">
          <label className="label font-semibold">Discount (%)</label>
          <div className="relative">
            <FaPercent className="absolute left-3 top-3 text-secondary" />
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              placeholder="15"
              className="w-full pl-10 py-3 rounded-lg border-2 border-primary bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              min="0"
              max="100"
            />
          </div>
        </div>

        {/* Genre */}
        <div className="form-control">
          <label className="label font-semibold">Genre</label>
          <div className="relative">
            <FaTags className="absolute left-3 top-3 text-secondary" />
            <select
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className="w-full pl-10 py-3 rounded-lg border-2 border-primary bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              required
            >
              <option value="" disabled>
                Select a genre
              </option>
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cover Image */}
        <div className="form-control">
          <label className="label font-semibold">Cover Image</label>
          <div className="relative">
            <FaImage className="absolute left-3 top-3 text-secondary" />
            <input
              type="file"
              name="coverImage"
              onChange={handleChange}
              accept="image/*"
              className="w-full pl-10 py-3 rounded-lg border-2 border-primary bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              required
            />
          </div>
          {formData.imageURL && (
            <Image
              src={formData.imageURL}
              alt="Cover Preview"
              width={80}
              height={40}
              className="mt-3 object-cover rounded-xl border shadow-sm"
            />
          )}
        </div>
      </div>

      {/* Section: Description */}
      <div className="form-control">
        <label className="label font-semibold">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Write a detailed description of the book..."
          className="w-full h-40 p-4 rounded-lg border-2 border-primary bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
          required
        ></textarea>
      </div>

      {/* Submit */}
      <button className="btn btn-primary w-full py-4 rounded-xl text-lg font-semibold hover:scale-105 transition-transform duration-200">
        {loading ? (
          <span className="loading loading-spinner"></span>
        ) : (
          "Add Book"
        )}
      </button>
    </form>
  );
};

export default AddBookForm;
