import { Suspense } from "react";
import BookLoader from "./Components/BookLoader/BookLoader";

export default function Loading() {
  return (
    <div className="hero min-h-screen" style={{ backgroundColor: "#EDF6F8" }}>
      <div className="hero-content text-center flex flex-col items-center">
        {/* Animated Book Loader */}
        <Suspense fallback={null}>
          <BookLoader />
        </Suspense>
        <progress
          className="progress w-56 mt-4 bg-base-100 text-primary"
        ></progress>
      </div>
    </div>
  );
}
