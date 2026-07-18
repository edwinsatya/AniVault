"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { ANILIST_GENRES, SEASONS, cn, titleCase } from "@/lib/utils";

export interface DiscoverFilters {
  genres: string[];
  season?: string;
  year?: number;
  formats: string[];
  status?: string;
  minScore?: number;
  sort: string;
}

const SORT_OPTIONS = [
  { value: "TRENDING_DESC", label: "Trending" },
  { value: "POPULARITY_DESC", label: "Most Popular" },
  { value: "SCORE_DESC", label: "Top Rated" },
  { value: "START_DATE_DESC", label: "Newest" },
  { value: "FAVOURITES_DESC", label: "Most Loved" },
  { value: "TITLE_ROMAJI", label: "A – Z" },
];

const FORMAT_OPTIONS = ["TV", "MOVIE", "OVA", "ONA", "SPECIAL", "TV_SHORT"];

const STATUS_OPTIONS = [
  { value: "RELEASING", label: "Airing" },
  { value: "FINISHED", label: "Finished" },
  { value: "NOT_YET_RELEASED", label: "Upcoming" },
];

const YEARS = Array.from(
  { length: new Date().getFullYear() + 2 - 1970 },
  (_, i) => new Date().getFullYear() + 1 - i,
);

function toQuery(f: DiscoverFilters): string {
  const q = new URLSearchParams();
  if (f.genres.length) q.set("genres", f.genres.join(","));
  if (f.season) q.set("season", f.season);
  if (f.year) q.set("year", String(f.year));
  if (f.formats.length) q.set("format", f.formats.join(","));
  if (f.status) q.set("status", f.status);
  if (f.minScore) q.set("minScore", String(f.minScore));
  if (f.sort !== "POPULARITY_DESC") q.set("sort", f.sort);
  return q.toString();
}

export function FilterControls({
  filters,
  moodLabel,
}: {
  filters: DiscoverFilters;
  moodLabel?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DiscoverFilters>(filters);

  const activeCount =
    filters.genres.length +
    filters.formats.length +
    (filters.season ? 1 : 0) +
    (filters.year ? 1 : 0) +
    (filters.status ? 1 : 0) +
    (filters.minScore ? 1 : 0);

  const push = (f: DiscoverFilters) => {
    setOpen(false);
    router.push(`/discover?${toQuery(f)}`, { scroll: false });
  };

  const toggleIn = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const chipClass = (active: boolean) =>
    cn(
      "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
      active
        ? "border-accent bg-accent/20 text-snow"
        : "border-line text-mist hover:border-white/25 hover:text-fog",
    );

  const panel = (
    <div className="space-y-6">
      <div>
        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">
          Genres
        </p>
        <div className="flex flex-wrap gap-2">
          {ANILIST_GENRES.map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() =>
                setDraft((d) => ({ ...d, genres: toggleIn(d.genres, genre) }))
              }
              className={chipClass(draft.genres.includes(genre))}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        <div>
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">
            Season
          </p>
          <div className="flex flex-wrap gap-2">
            {SEASONS.map((season) => (
              <button
                key={season}
                type="button"
                onClick={() =>
                  setDraft((d) => ({
                    ...d,
                    season: d.season === season ? undefined : season,
                  }))
                }
                className={chipClass(draft.season === season)}
              >
                {titleCase(season)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">
            Year
          </p>
          <select
            value={draft.year ?? ""}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                year: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
            className="w-full rounded-lg border border-line bg-elev px-3 py-2 text-sm text-snow outline-none focus:border-accent"
          >
            <option value="">Any year</option>
            {YEARS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">
            Status
          </p>
          <select
            value={draft.status ?? ""}
            onChange={(e) =>
              setDraft((d) => ({ ...d, status: e.target.value || undefined }))
            }
            className="w-full rounded-lg border border-line bg-elev px-3 py-2 text-sm text-snow outline-none focus:border-accent"
          >
            <option value="">Any status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">
            Min score{" "}
            <span className="normal-case tracking-normal text-fog">
              {draft.minScore ? `≥ ${draft.minScore / 10}` : "any"}
            </span>
          </p>
          <input
            type="range"
            min={0}
            max={90}
            step={10}
            value={draft.minScore ?? 0}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                minScore: Number(e.target.value) || undefined,
              }))
            }
            className="w-full accent-accent"
          />
        </div>
      </div>

      <div>
        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">
          Format
        </p>
        <div className="flex flex-wrap gap-2">
          {FORMAT_OPTIONS.map((format) => (
            <button
              key={format}
              type="button"
              onClick={() =>
                setDraft((d) => ({
                  ...d,
                  formats: toggleIn(d.formats, format),
                }))
              }
              className={chipClass(draft.formats.includes(format))}
            >
              {format === "TV_SHORT" ? "TV Short" : titleCase(format)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-line/60 pt-5">
        <button
          type="button"
          onClick={() =>
            push({ genres: [], formats: [], sort: "POPULARITY_DESC" })
          }
          className="rounded-full px-5 py-2.5 text-sm font-medium text-mist transition-colors hover:text-snow"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={() => push(draft)}
          className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-soft"
        >
          Show results
        </button>
      </div>
    </div>
  );

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors",
            open || activeCount > 0
              ? "border-accent/60 bg-accent/10 text-snow"
              : "border-line text-fog hover:border-white/25",
          )}
        >
          <SlidersHorizontal className="size-4" />
          Filters
          {activeCount > 0 && (
            <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </button>

        {moodLabel && (
          <button
            type="button"
            onClick={() => router.push("/discover")}
            className="flex items-center gap-1.5 rounded-full border border-accent/60 bg-accent/15 px-4 py-2.5 text-sm font-medium text-snow transition-colors hover:bg-accent/25"
          >
            Mood: {moodLabel}
            <X className="size-3.5" />
          </button>
        )}

        <div className="ml-auto flex items-center gap-2">
          <label
            htmlFor="discover-sort"
            className="text-xs uppercase tracking-wider text-mist"
          >
            Sort
          </label>
          <select
            id="discover-sort"
            value={filters.sort}
            onChange={(e) => push({ ...filters, sort: e.target.value })}
            className="rounded-lg border border-line bg-panel px-3 py-2 text-sm text-snow outline-none focus:border-accent"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Desktop: inline glass panel. Mobile: bottom sheet. */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={cn(
                "fixed inset-x-0 bottom-0 z-50 max-h-[82svh] overflow-y-auto rounded-t-3xl border-t border-line bg-panel p-5 pb-10",
                "md:static md:z-auto md:mt-4 md:max-h-none md:rounded-2xl md:border md:bg-panel/70 md:p-6 md:pb-6 md:backdrop-blur-xl",
              )}
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line md:hidden" />
              {panel}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
