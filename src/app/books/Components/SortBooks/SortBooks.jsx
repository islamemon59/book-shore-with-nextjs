"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaChevronDown } from "react-icons/fa";
import { Calendar, DollarSign } from "lucide-react";

// Map sort options to their respective Lucide icons
const sortIcons = {
  newest: Calendar,
  oldest: Calendar,
  priceLow: DollarSign,
  priceHigh: DollarSign,
};

const SortOptions = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State to manage dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Static list of sort options
  const sortOptions = [
    { value: "newest", label: "Newest → Oldest" },
    { value: "oldest", label: "Oldest → Newest" },
    { value: "priceLow", label: "Price: Low → High" },
    { value: "priceHigh", label: "Price: High → Low" },
  ];

  const handleSortChange = (newSort) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    router.push(`${pathname}?${params.toString()}`);
    setIsDropdownOpen(false); // Close the dropdown after selection
  };

  const currentSort = searchParams.get("sort") || "newest";
  const currentSortLabel = sortOptions.find(
    (option) => option.value === currentSort
  )?.label;
  const CurrentIcon = sortIcons[currentSort];

  // Hook to close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative w-full mb-6" ref={dropdownRef}>
      {/* Dropdown button */}
      <button
        type="button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="w-full flex justify-between items-center bg-base-100 border border-secondary text-neutral py-3 px-4 rounded-xl leading-tight focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary transition-colors"
      >
        <div className="flex items-center space-x-2">
          {CurrentIcon && <CurrentIcon className="w-5 h-5 text-accent" />}
          <span>{currentSortLabel}</span>
        </div>
        <FaChevronDown
          className={`h-4 w-4 transform transition-transform duration-200 ${
            isDropdownOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Dropdown menu */}
      {isDropdownOpen && (
        <ul className="absolute z-10 w-full mt-2 rounded-xl border border-secondary bg-base-100 shadow-lg max-h-60 overflow-y-auto">
          {sortOptions.map((option) => {
            const Icon = sortIcons[option.value];
            return (
              <li
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className="flex items-center space-x-3 px-4 py-3 cursor-pointer hover:bg-neutral-100 transition-colors"
              >
                {Icon && <Icon className="w-5 h-5 text-accent" />}
                <span>{option.label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SortOptions;
