"use client";

import { useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Horizontal rail: swipeable snap-scroll carousel on touch, arrow buttons on
 * desktop (revealed on hover).
 */
export function Rail({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <div className="group/rail relative">
      <div
        ref={ref}
        className="no-scrollbar mask-fade-x -mx-4 flex snap-x gap-4 overflow-x-auto scroll-px-4 px-4 pb-1 md:-mx-8 md:scroll-px-8 md:px-8"
      >
        {children}
      </div>

      <button
        type="button"
        aria-label="Scroll left"
        onClick={() => scrollBy(-1)}
        className="glass absolute -left-4 top-[34%] z-10 hidden rounded-full p-2.5 text-snow opacity-0 transition-opacity duration-200 hover:bg-white/10 group-hover/rail:opacity-100 md:flex"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => scrollBy(1)}
        className="glass absolute -right-4 top-[34%] z-10 hidden rounded-full p-2.5 text-snow opacity-0 transition-opacity duration-200 hover:bg-white/10 group-hover/rail:opacity-100 md:flex"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}

export function RailItem({ children }: { children: ReactNode }) {
  return (
    <div className="w-36 shrink-0 snap-start sm:w-40 lg:w-44">{children}</div>
  );
}
