"use client";

import { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaBook,
  FaPlus,
  FaShoppingBag,
  FaClipboardList,
  FaTruck,
} from "react-icons/fa";
import Profile from "../Profile/Profile";
import Link from "next/link";

const Sidebar = ({ navLinks, pathname }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Use an object to map link names to icons for cleaner code.
  const iconMap = {
    Home: <FaHome className="w-5 h-5" />,
    "List of all books": <FaBook className="w-5 h-5" />,
    "Add New Book": <FaPlus className="w-5 h-5" />,
    "View list of all orders": <FaShoppingBag className="w-5 h-5" />,
    "Order details": <FaClipboardList className="w-5 h-5" />,
    "Update order status": <FaTruck className="w-5 h-5" />,
  };

  return (
    <>
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-base-100 shadow-md transition-all duration-300 hover:bg-base-200 hover:scale-105"
        aria-label="Toggle Sidebar"
      >
        <FaBars className="w-6 h-6" />
      </button>

      {/* Sidebar Overlay (Mobile) */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 lg:hidden ${
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar Content */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-72 bg-base-100 p-8 shadow-2xl rounded-tr-3xl rounded-br-3xl lg:rounded-none lg:shadow-none z-50 transition-transform duration-300 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Dashboard Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              BookShore
            </h1>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden btn btn-sm btn-ghost"
              aria-label="Close Sidebar"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>

          {/* Admin profile */}
          <Profile />

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="menu space-y-2">
              {navLinks.map((link) => (
                <li key={link.name} className="relative">
                  <Link
                    href={link.href}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-300 hover:bg-base-300 ${
                      pathname === link.href
                        ? "bg-primary text-primary-content font-bold shadow-md"
                        : ""
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    {iconMap[link.name]}
                    {link.name}
                  </Link>
                  {pathname === link.href && (
                    <span className="absolute left-0 top-0 w-1 h-full bg-secondary rounded-full transition-all duration-300 transform scale-y-0 lg:scale-y-100" />
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;