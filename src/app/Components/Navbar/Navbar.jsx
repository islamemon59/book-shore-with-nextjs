// components/Navbar.jsx
import Link from "next/link";
import NavLinks from "./NavLinks";
import UserMenu from "./UserMenu";

export default async function Navbar() {
  const isAdmin = false; // later replace with session/role check

  return (
    <div className="navbar bg-base-100 shadow-md px-4 sticky top-0 z-50">
      {/* Left Section: Logo */}
      <div className="flex-1">
        <Link
          href="/"
          className="text-2xl font-bold transition hover:text-primary"
        >
          📚 BookShore
        </Link>
      </div>

      {/* Mobile Dropdown */}
      <div className="dropdown lg:hidden">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow bg-base-100 rounded-box w-56 animate-fadeIn"
        >
          <NavLinks isAdmin={isAdmin} />
          <UserMenu />
        </ul>
      </div>

      {/* Desktop Menu */}
      <div className="flex-none hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          <NavLinks isAdmin={isAdmin} />
          <UserMenu />
        </ul>
      </div>
    </div>
  );
}
