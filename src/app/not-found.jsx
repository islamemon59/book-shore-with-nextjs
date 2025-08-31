import React from "react";

// NOTE: This component is a self-contained, improved version
// of your NotFound page. next/link and react-icons/bi have been
// replaced with standard HTML elements and an inline SVG to make
// the component fully runnable and modern.

export default function NotFoundPage() {
  const colorPrimary = "#3489BD";
  const colorAccent = "#2E7A7A";
  const colorNeutral = "#144D75";
  const colorBase100 = "#EDF6F8";

  // Home icon as an inline SVG to avoid external dependencies
  const HomeIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5 transition-transform duration-300 transform group-hover:scale-110"
    >
      <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a1.5 1.5 0 01.41 1.06V19.5a2.25 2.25 0 01-2.25 2.25H15a2.25 2.25 0 01-2.25-2.25V15a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75v4.5a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 19.5v-5.914a1.5 1.5 0 01.41-1.06l8.69-8.69z" />
    </svg>
  );

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen text-center p-4 transition-colors duration-500"
      style={{ backgroundColor: colorBase100 }}
    >
      {/* Container for content, with a subtle backdrop */}
      <div
        className="relative flex flex-col items-center p-10 md:p-16 rounded-3xl shadow-2xl backdrop-blur-md bg-white/70"
        style={{ color: colorNeutral }}
      >
        <div className="flex flex-col items-center space-y-4 animate-fadeIn">
          {/* Main 404 Heading */}
          <h1
            className="text-7xl sm:text-9xl font-extrabold tracking-tight drop-shadow-lg"
            style={{ color: colorPrimary }}
          >
            404
          </h1>
          {/* Subheading */}
          <p className="mt-4 text-xl sm:text-2xl font-semibold opacity-90">
            Oops! The page you're looking for doesn't exist.
          </p>
          {/* Action Button */}
          <a
            href="/"
            className="group mt-6 inline-flex items-center gap-3 px-8 py-4 text-white rounded-full font-bold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            style={{ backgroundColor: colorAccent }}
          >
            {HomeIcon}
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
