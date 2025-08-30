"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

export default function SearchInput() {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  console.log(searchParams);

  // Keep search text in sync with URL
  const [search, setSearch] = useState(searchParams.get("search") || "");

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);
  console.log(search);

  const handleSubmit = (e) => {
    e.preventDefault();

    const params = new URLSearchParams(window.location.search);
    console.log(params);
    if (search.trim()) {
      params.set("search", search.trim());
    } else {
      params.delete("search");
    }

    router.push(`${pathName}?${params.toString()}`);
  };

  const clearSearch = () => {
    setSearch("");
    const params = new URLSearchParams(window.location.search);
    params.delete("search");
    router.push(`${pathName}?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center w-full max-w-2xl mx-auto"
    >
      <input
        type="text"
        placeholder="Search for books by title or author..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-full border px-5 py-3 pr-12 shadow-sm transition
          border-[var(--color-neutral)]
          bg-[var(--color-base-100)]
          text-[var(--color-neutral)]
          focus:border-[var(--color-primary)]
          focus:ring-2 focus:ring-[var(--color-primary)]
          focus:outline-none"
      />

      {/* Clear button */}
      {search && (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute right-12 text-[var(--color-accent)] hover:text-[var(--color-neutral)]"
        >
          <FaTimes />
        </button>
      )}

      {/* Search button */}
      <button
        type="submit"
        className="absolute right-3 bg-[var(--color-primary)] text-white p-2 rounded-full shadow hover:bg-[var(--color-secondary)] transition"
      >
        <FaSearch />
      </button>
    </form>
  );
}
