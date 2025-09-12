"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaChevronDown } from "react-icons/fa";

export default function SortBooks() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    router.push(`${pathname}?${params.toString()}`);
  };

  const currentSort = searchParams.get("sort") || "newest";

  return (
    <div className="mb-6">
      <div className="relative inline-block w-64">
        <select
          value={currentSort}
          onChange={handleSortChange}
          className="block w-full appearance-none bg-base-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 py-3 px-4 pr-10 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        >
          <option value="newest">Newest → Oldest</option>
          <option value="oldest">Oldest → Newest</option>
          <option value="priceLow">Price: Low → High</option>
          <option value="priceHigh">Price: High → Low</option>
        </select>

        {/* Dropdown Icon */}
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-400">
          <FaChevronDown className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
