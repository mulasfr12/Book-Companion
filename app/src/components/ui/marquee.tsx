"use client";

import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";

interface MarqueeProps {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  vertical?: boolean;
  repeat?: number;
  children: React.ReactNode;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  vertical = false,
  repeat = 4,
  children,
}: MarqueeProps) {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div
      className={cn(
        "group flex overflow-hidden [--duration:40s] [--gap:1rem]",
        vertical ? "flex-col" : "flex-row",
        className
      )}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex shrink-0 justify-around gap-[--gap]",
              vertical
                ? "animate-[marquee-vertical_var(--duration)_linear_infinite] flex-col"
                : "animate-[marquee_var(--duration)_linear_infinite] flex-row",
              reverse && "[animation-direction:reverse]",
              isPaused && "[animation-play-state:paused]"
            )}
          >
            {children}
          </div>
        ))}
    </div>
  );
}
