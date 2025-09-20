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
import { useSession } from "next-auth/react";

const Sidebar = ({ navLinks, pathname }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: session } = useSession();

  const role = session?.user?.role || "guest";

  // Icon mapping
  const iconMap = {
    Home: <FaHome className="w-5 h-5" />,
    "List of all books": <FaBook className="w-5 h-5" />,
    "Add New Book": <FaPlus className="w-5 h-5" />,
    "View list of all orders": <FaShoppingBag className="w-5 h-5" />,
    "Order details": <FaClipboardList className="w-5 h-5" />,
    "Update order status": <FaTruck className="w-5 h-5" />,
  };

    // Filter links based on role
  const filteredLinks = navLinks.filter((link) =>
    link.roles.includes(role)
  );

  return (
    <>
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-base-100 shadow-md transition-all duration-300 hover:bg-secondary hover:scale-105"
        aria-label="Toggle Sidebar"
      >
        <FaBars className="w-6 h-6 text-neutral" />
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
        className={`fixed lg:static inset-y-0 left-0 w-72 
  bg-neutral/95 backdrop-blur-md text-base-100 
  p-8 shadow-xl rounded-tr-3xl rounded-br-3xl 
  lg:rounded-none lg:shadow-none z-50 transition-transform 
  duration-300 transform ${
    isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
  }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            >
              BookShore
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden btn btn-sm btn-ghost"
              aria-label="Close Sidebar"
            >
              <FaTimes className="w-6 h-6 text-base-100" />
            </button>
          </div>

          {/* Profile */}
          <Profile />

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto mt-4">
            <ul className="menu space-y-2">
              {filteredLinks.map((link) => (
                <li key={link.name} className="relative">
                  <Link
                    href={link.href}
                    className={`flex items-center font-semibold gap-3 p-3 rounded-lg text-[16px] transition-colors duration-300 ${
                      pathname === link.href
                        ? "bg-primary text-base-100 shadow-md"
                        : "hover:bg-secondary hover:text-base-100"
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    {iconMap[link.name]}
                    {link.name}
                  </Link>
                  {pathname === link.href && (
                    <span className="absolute left-0 top-0 w-1 h-full bg-accent rounded-full" />
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
