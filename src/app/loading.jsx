import React from "react";

export default function Loading() {
  return (
    <div className="hero min-h-screen" style={{ backgroundColor: "#EDF6F8" }}>
      <div className="hero-content text-center flex flex-col items-center">
        <span
          className="loading loading-spinner loading-lg mb-4"
          style={{ color: "#3489BD" }}
        ></span>
        <p className="text-xl font-semibold" style={{ color: "#144D75" }}>
          Loading, please wait...
        </p>
        <progress
          className="progress w-56 mt-4"
          style={{ accentColor: "#2E7A7A" }}
        ></progress>
      </div>
    </div>
  );
}
