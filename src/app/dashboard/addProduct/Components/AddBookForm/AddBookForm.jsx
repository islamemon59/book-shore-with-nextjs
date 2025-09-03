"use client";

import React, { useState } from "react";

const AddBookForm = () => {
  // State to manage all form inputs
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    discount: "",
    genre: "",
    coverImage: null,
  });

  // Handle changes for all input fields
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);
    // In a real application, you would send this data to a database.
    // Example: sendFormDataToAPI(formData);
  };

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

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-base-100 p-6 md:p-8 rounded-2xl shadow-xl space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-neutral">Book Title</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., The Midnight Library"
            className="input input-bordered w-full rounded-lg bg-base-200"
            required
          />
        </div>

        {/* Author */}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-neutral">Author</span>
          </label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="e.g., Matt Haig"
            className="input input-bordered w-full rounded-lg bg-base-200"
            required
          />
        </div>
      </div>

      {/* Description */}
      <div className="form-control">
        <label className="label">
          <span className="label-text text-neutral">Description</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="A brief summary of the book..."
          className="textarea textarea-bordered h-32 rounded-lg bg-base-200"
          required
        ></textarea>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Price */}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-neutral">Price</span>
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="e.g., 19.99"
            className="input input-bordered rounded-lg bg-base-200"
            min="0"
            step="0.01"
            required
          />
        </div>

        {/* Discount (%) */}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-neutral">Discount (%)</span>
          </label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            placeholder="e.g., 15"
            className="input input-bordered rounded-lg bg-base-200"
            min="0"
            max="100"
          />
        </div>

        {/* Genre */}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-neutral">Genre</span>
          </label>
          <select
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            className="select select-bordered w-full rounded-lg bg-base-200"
            required
          >
            <option value="" disabled>
              Select a genre
            </option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        {/* Upload cover image */}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-neutral">Cover Image</span>
          </label>
          <input
            type="file"
            name="coverImage"
            onChange={handleChange}
            className="file-input file-input-bordered w-full rounded-lg bg-base-200"
            accept="image/*"
            required
          />
        </div>
      </div>

      <button type="submit" className="btn btn-primary w-full mt-8 rounded-lg">
        Add Book
      </button>
    </form>
  );
};

export default AddBookForm;
