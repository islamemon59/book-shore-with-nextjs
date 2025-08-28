"use client";

import Lottie from "lottie-react";
import login from "../.././login.json"

export default function DesktopLottie() {
  return (
    <div className={`hidden lg:block w-[650px]`}>
      <Lottie animationData={login} loop={true} />
    </div>
  );
}
