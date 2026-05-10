"use client";

import { useEffect, useState } from "react";

export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 900;
    const frameRate = 16;
    const totalFrames = Math.max(1, Math.round(duration / frameRate));
    let frame = 0;

    const interval = window.setInterval(() => {
      frame += 1;
      const progress = frame / totalFrames;
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));

      if (frame >= totalFrames) {
        window.clearInterval(interval);
      }
    }, frameRate);

    return () => window.clearInterval(interval);
  }, [value]);

  return (
    <span>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}
