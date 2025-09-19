import Link from "next/link";
import NavLinks from "./Components/NavLinks/NavLinks";
import UserMenu from "./Components/UserMenu/UserMenu";

export default async function Navbar() {

  return (
    <div className="bg-base-100 shadow-lg">
      <div className="container mx-auto navbar px-6 sticky top-0 z-50">
        {/* Left Section: Logo */}
        <div className="flex-1">
          <Link
            href="/"
            className="text-3xl font-extrabold text-[#3489BD] hover:text-[#2E7A7A] transition-colors duration-300"
          >
            📚 BookShore
          </Link>
        </div>

        {/* Mobile Dropdown */}
        <div className="dropdown lg:hidden relative">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle text-[#144D75]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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
            className="menu absolute top-12 right-0 menu-sm dropdown-content z-[1] p-4 shadow-xl bg-base-100 rounded-box w-52 animate-fadeIn"
          >
            <NavLinks />
            <div className="divider my-2 bg-neutral-content h-px" />
            <UserMenu />
          </ul>
        </div>

        {/* Desktop Menu */}
        <div className="flex-none hidden lg:flex">
          <ul className="menu-horizontal px-1 gap-4 items-center">
            <NavLinks />
            <UserMenu />
          </ul>
        </div>
      </div>
    </div>
  );
}
