"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaChevronDown } from "react-icons/fa";
import {
  ShieldAlert,
  Ghost,
  Compass,
  User,
  Sword,
  Landmark,
  Rocket,
  Feather,
  Theater,
  Baby,
  Utensils,
  Sparkles,
  Lightbulb,
  BookOpen,
  Plane,
  Laugh,
  Heart,
  Users,
  AlertTriangle,
  BookMarked,
} from "lucide-react";

// Map genres to their respective Lucide icons
const genreIcons = {
  Thriller: ShieldAlert,
  Horror: Ghost,
  Adventure: Compass,
  Biography: User,
  Action: Sword,
  "Historical Fiction": Landmark,
  "Science Fiction": Rocket,
  Poetry: Feather,
  Drama: Theater,
  "Children's": Baby,
  Cookbook: Utensils,
  Crime: ShieldAlert,
  Fantasy: Sparkles,
  "Self-Help": Lightbulb,
  Mystery: BookOpen,
  Travel: Plane,
  Humor: Laugh,
  Romance: Heart,
  "Young Adult": Users,
  Dystopian: AlertTriangle,
  "Non-Fiction": BookMarked,
};

const SortByGenre = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State to manage dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Static list of genres
  const genres = [
    "All",
    "Thriller",
    "Horror",
    "Adventure",
    "Biography",
    "Action",
    "Historical Fiction",
    "Science Fiction",
    "Poetry",
    "Drama",
    "Children's",
    "Cookbook",
    "Crime",
    "Fantasy",
    "Self-Help",
    "Mystery",
    "Travel",
    "Humor",
    "Romance",
    "Young Adult",
    "Dystopian",
    "Non-Fiction",
  ];

  const handleGenreChange = (newGenre) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newGenre === "All") {
      params.delete("genre");
    } else {
      params.set("genre", newGenre);
    }

    router.push(`${pathname}?${params.toString()}`);
    setIsDropdownOpen(false); // Close the dropdown after selection
  };

  const currentGenre = searchParams.get("genre") || "All";

  // Function to get the current genre's icon
  const CurrentIcon = genreIcons[currentGenre];

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
          {currentGenre !== "All" && CurrentIcon && (
            <CurrentIcon className="w-5 h-5 text-accent" />
          )}
          <span>
            {currentGenre === "All" ? "Filter by Genre" : currentGenre}
          </span>
        </div>
        <FaChevronDown
          className={`h-4 w-4 transform transition-transform duration-200 ${
            isDropdownOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Dropdown menu */}
      {isDropdownOpen && (
        <ul className="absolute z-10 w-full mt-2 rounded-xl border border-secondary bg-base-100 shadow-lg max-h-70 overflow-y-auto">
          {genres.map((g) => {
            const Icon = genreIcons[g] || BookOpen; // Default icon
            return (
              <li
                key={g}
                onClick={() => handleGenreChange(g)}
                className="flex items-center space-x-3 px-4 py-3 cursor-pointer hover:bg-neutral-100 transition-colors"
              >
                {g !== "All" ? (
                  <Icon className="w-5 h-5 text-accent" />
                ) : (
                  <BookOpen className="w-5 h-5 text-accent" />
                )}
                <span>{g}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SortByGenre;
