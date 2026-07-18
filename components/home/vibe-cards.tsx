import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MOODS } from "@/lib/moods";
import { cn } from "@/lib/utils";

/** Mood-based discovery entry points — each maps to a curated AniList query. */
export function VibeCards() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-5">
      {MOODS.map((mood) => (
        <Link
          key={mood.slug}
          href={`/discover?mood=${mood.slug}`}
          className="group relative overflow-hidden rounded-2xl border border-line/70 bg-panel p-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 md:p-5"
        >
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-60 transition-opacity duration-300 group-hover:opacity-100",
              mood.gradient,
            )}
          />
          <div className="relative flex h-full min-h-24 flex-col justify-between gap-4 md:min-h-28">
            <div>
              <p className="font-display text-base font-bold tracking-tight text-snow md:text-lg">
                {mood.label}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-fog/70">
                {mood.tagline}
              </p>
            </div>
            <ArrowUpRight className="size-4 self-end text-mist opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-snow group-hover:opacity-100" />
          </div>
        </Link>
      ))}
    </div>
  );
}
