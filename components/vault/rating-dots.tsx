"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/** Compact 1–10 personal rating control. Click the active value to clear. */
export function RatingDots({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (value: number | null) => void;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? value ?? 0;

  return (
    <div
      className="flex items-center gap-1"
      onMouseLeave={() => setHover(null)}
      role="radiogroup"
      aria-label="Personal rating"
    >
      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`Rate ${n}`}
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(value === n ? null : n)}
          className={cn(
            "size-2.5 rounded-full transition-all duration-150",
            n <= shown
              ? "scale-110 bg-accent"
              : "bg-line hover:bg-mist/50",
          )}
        />
      ))}
      <span className="ml-1.5 w-6 text-xs font-semibold text-snow">
        {value ?? "—"}
      </span>
    </div>
  );
}
