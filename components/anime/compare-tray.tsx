"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeftRight, ExternalLink, X } from "lucide-react";
import type { MediaSnapshot } from "@/lib/anilist/types";
import { useCompareStore } from "@/lib/store/compare";
import {
  cn,
  compactNumber,
  formatFormat,
  formatScore,
  titleCase,
} from "@/lib/utils";

interface CompareRow {
  label: string;
  render: (m: MediaSnapshot) => string;
  /** Numeric accessor — the highest value across the tray gets highlighted. */
  metric?: (m: MediaSnapshot) => number | null;
}

const ROWS: CompareRow[] = [
  {
    label: "Score",
    render: (m) =>
      m.averageScore != null ? `${formatScore(m.averageScore)} / 10` : "—",
    metric: (m) => m.averageScore,
  },
  {
    label: "Popularity",
    render: (m) => (m.popularity != null ? compactNumber(m.popularity) : "—"),
    metric: (m) => m.popularity,
  },
  {
    label: "Favourites",
    render: (m) => (m.favourites != null ? compactNumber(m.favourites) : "—"),
    metric: (m) => m.favourites,
  },
  { label: "Format", render: (m) => formatFormat(m.format) || "—" },
  {
    label: "Episodes",
    render: (m) => (m.episodes != null ? String(m.episodes) : "—"),
  },
  {
    label: "Ep length",
    render: (m) => (m.duration != null ? `${m.duration} min` : "—"),
  },
  {
    label: "Season",
    render: (m) =>
      m.season && m.seasonYear ? `${titleCase(m.season)} ${m.seasonYear}` : "—",
  },
  { label: "Studio", render: (m) => m.studio ?? "—" },
  { label: "Status", render: (m) => (m.status ? titleCase(m.status) : "—") },
  { label: "Genres", render: (m) => m.genres.slice(0, 4).join(", ") || "—" },
];

export function CompareTray() {
  const { items, open, setOpen, remove, clear } = useCompareStore();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return (
    <>
      {/* Floating tray pill */}
      <AnimatePresence>
        {items.length > 0 && !open && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="glass fixed bottom-24 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full py-2 pl-3 pr-2 shadow-2xl shadow-black/50 md:bottom-6"
          >
            <div className="flex">
              {items.map((m, i) => (
                <div
                  key={m.id}
                  className={cn(
                    "relative h-10 w-7 overflow-hidden rounded-md ring-2 ring-abyss",
                    i > 0 && "-ml-2",
                  )}
                >
                  {m.cover && (
                    <Image
                      src={m.cover}
                      alt={m.title}
                      fill
                      sizes="28px"
                      className="object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => items.length > 1 && setOpen(true)}
              disabled={items.length < 2}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                items.length > 1
                  ? "bg-accent text-white hover:bg-accent-soft"
                  : "bg-white/10 text-mist",
              )}
            >
              <ArrowLeftRight className="size-4" />
              {items.length > 1 ? `Compare ${items.length}` : "Pick one more"}
            </button>
            <button
              type="button"
              aria-label="Clear compare tray"
              onClick={clear}
              className="rounded-full p-2 text-mist transition-colors hover:bg-white/10 hover:text-snow"
            >
              <X className="size-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide-up comparison drawer */}
      <AnimatePresence>
        {open && items.length > 1 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[88svh] overflow-y-auto rounded-t-3xl border-t border-line bg-panel shadow-2xl"
            >
              <div className="mx-auto max-w-4xl px-4 pb-10 pt-3 md:px-8">
                <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line" />
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold tracking-tight text-snow md:text-2xl">
                    Side by side
                  </h2>
                  <button
                    type="button"
                    aria-label="Close comparison"
                    onClick={() => setOpen(false)}
                    className="rounded-full p-2 text-mist transition-colors hover:bg-white/10 hover:text-snow"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <div
                    className="grid min-w-[560px] gap-x-4"
                    style={{
                      gridTemplateColumns: `88px repeat(${items.length}, minmax(0, 1fr))`,
                    }}
                  >
                    {/* Header: covers + titles */}
                    <div />
                    {items.map((m) => (
                      <div key={m.id} className="pb-4">
                        <div className="relative mx-auto aspect-[2/3] w-24 overflow-hidden rounded-xl ring-1 ring-white/10 md:w-28">
                          {m.cover && (
                            <Image
                              src={m.cover}
                              alt={m.title}
                              fill
                              sizes="112px"
                              className="object-cover"
                            />
                          )}
                          <button
                            type="button"
                            aria-label={`Remove ${m.title}`}
                            onClick={() => remove(m.id)}
                            className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-fog backdrop-blur transition-colors hover:bg-black/80 hover:text-snow"
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                        <div className="mt-2 flex items-start justify-center gap-1 text-center">
                          <Link
                            href={`/anime/${m.id}`}
                            onClick={() => setOpen(false)}
                            className="line-clamp-2 text-sm font-semibold text-snow transition-colors hover:text-accent-soft"
                          >
                            {m.title}
                            <ExternalLink className="ml-1 inline size-3 text-mist" />
                          </Link>
                        </div>
                      </div>
                    ))}

                    {/* Stat rows */}
                    {ROWS.map((row) => {
                      const values = row.metric
                        ? items.map((m) => row.metric!(m) ?? -Infinity)
                        : null;
                      const best = values ? Math.max(...values) : null;
                      return (
                        <div key={row.label} className="contents">
                          <div className="border-t border-line/60 py-3 text-xs font-semibold uppercase tracking-wider text-mist">
                            {row.label}
                          </div>
                          {items.map((m, i) => (
                            <div
                              key={m.id}
                              className={cn(
                                "border-t border-line/60 py-3 text-center text-sm",
                                values &&
                                  best !== null &&
                                  best !== -Infinity &&
                                  values[i] === best
                                  ? "font-semibold text-accent-soft"
                                  : "text-fog",
                              )}
                            >
                              {row.render(m)}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
