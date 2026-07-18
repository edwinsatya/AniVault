"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowLeftRight, Star } from "lucide-react";
import type { ListMedia } from "@/lib/anilist/types";
import { useCompareStore } from "@/lib/store/compare";
import {
  cn,
  formatFormat,
  formatScore,
  formatTimeUntil,
  hexToRgbChannels,
  mediaTitle,
  toSnapshot,
} from "@/lib/utils";

export function MediaCard({
  media,
  priority = false,
  showAiring = false,
  sizes = "(max-width: 640px) 44vw, (max-width: 1024px) 28vw, 200px",
}: {
  media: ListMedia;
  priority?: boolean;
  showAiring?: boolean;
  sizes?: string;
}) {
  const title = mediaTitle(media.title);
  const cover = media.coverImage.extraLarge ?? media.coverImage.large;
  const glow = hexToRgbChannels(media.coverImage.color) ?? "124 90 255";
  const inCompare = useCompareStore((s) =>
    s.items.some((m) => m.id === media.id),
  );
  const toggleCompare = useCompareStore((s) => s.toggle);
  const airing = media.nextAiringEpisode;

  return (
    <Link href={`/anime/${media.id}`} className="group block">
      <div
        className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-elev ring-1 ring-white/5 transition-all duration-300 group-hover:ring-accent/50"
        style={{ "--glow": glow } as CSSProperties}
      >
        {cover && (
          <Image
            src={cover}
            alt={title}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          />
        )}

        {/* per-cover glow keyed to the anime's own accent color */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ boxShadow: "inset 0 0 70px -18px rgb(var(--glow) / 0.6)" }}
        />

        {media.averageScore != null && (
          <span className="glass absolute left-2 top-2 flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold text-snow">
            <Star className="size-3 fill-amber-300 text-amber-300" />
            {formatScore(media.averageScore)}
          </span>
        )}

        <button
          type="button"
          aria-label={inCompare ? "Remove from compare" : "Add to compare"}
          aria-pressed={inCompare}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleCompare(toSnapshot(media));
          }}
          className={cn(
            "absolute right-2 top-2 rounded-full p-1.5 backdrop-blur-md transition-all duration-200",
            inCompare
              ? "bg-accent text-white"
              : "bg-black/50 text-fog opacity-0 hover:bg-accent hover:text-white focus-visible:opacity-100 group-hover:opacity-100",
          )}
        >
          <ArrowLeftRight className="size-3.5" />
        </button>

        {showAiring && airing ? (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2.5 pt-7">
            <p className="text-[11px] font-semibold text-accent-soft">
              Ep {airing.episode} in {formatTimeUntil(airing.timeUntilAiring)}
            </p>
          </div>
        ) : (
          <div className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/90 via-black/55 to-transparent p-3 pt-8 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <p className="line-clamp-1 text-[11px] text-fog">
              {media.genres.slice(0, 3).join(" · ")}
            </p>
          </div>
        )}
      </div>

      <div className="mt-2.5 space-y-0.5 px-0.5">
        <p className="line-clamp-2 text-sm font-medium leading-snug text-snow/90 transition-colors group-hover:text-snow">
          {title}
        </p>
        <p className="text-xs text-mist">
          {[media.seasonYear, formatFormat(media.format)]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>
    </Link>
  );
}
