"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import type { ListMedia } from "@/lib/anilist/types";
import { cn, formatScore, mediaTitle, stripHtml } from "@/lib/utils";

const ROTATE_MS = 7000;

export function Hero({ items }: { items: ListMedia[] }) {
  const [idx, setIdx] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || items.length < 2) return;
    const timer = setInterval(
      () => setIdx((i) => (i + 1) % items.length),
      ROTATE_MS,
    );
    return () => clearInterval(timer);
  }, [items.length, reduced]);

  if (items.length === 0) return null;
  const item = items[idx];
  const title = mediaTitle(item.title);

  return (
    <section className="relative h-[72svh] min-h-[480px] w-full overflow-hidden md:h-[84svh]">
      {/* Rotating banner art with slow Ken Burns drift */}
      <AnimatePresence>
        <motion.div
          key={item.id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.1, ease: "easeOut" },
            scale: { duration: ROTATE_MS / 1000 + 1, ease: "linear" },
          }}
        >
          {item.bannerImage && (
            <Image
              src={item.bannerImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Cinematic scrims */}
      <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/45 to-abyss/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-abyss/85 via-abyss/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-abyss to-transparent" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-14 md:px-8 md:pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.55, ease: [0.21, 0.65, 0.36, 1] }}
          >
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-accent-soft">
              Now Trending · {String(idx + 1).padStart(2, "0")} /{" "}
              {String(items.length).padStart(2, "0")}
            </p>
            <h1 className="max-w-3xl font-display text-4xl font-bold leading-[1.04] tracking-tight text-snow sm:text-5xl md:text-7xl">
              {title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-fog">
              {item.averageScore != null && (
                <span className="flex items-center gap-1.5 font-semibold text-snow">
                  <Star className="size-4 fill-amber-300 text-amber-300" />
                  {formatScore(item.averageScore)}
                </span>
              )}
              {item.seasonYear && <span>{item.seasonYear}</span>}
              {item.genres.slice(0, 3).map((g) => (
                <span
                  key={g}
                  className="rounded-full border border-white/15 px-3 py-0.5 text-xs text-fog/90"
                >
                  {g}
                </span>
              ))}
            </div>

            {item.description && (
              <p className="mt-4 hidden max-w-xl text-sm leading-relaxed text-fog/75 md:line-clamp-2">
                {stripHtml(item.description)}
              </p>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/discover"
                className="rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/30 transition-all hover:bg-accent-soft hover:shadow-accent/40"
              >
                Explore the Vault
              </Link>
              <Link
                href={`/anime/${item.id}`}
                className="group flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-snow backdrop-blur-sm transition-colors hover:border-white/40 hover:bg-white/5"
              >
                View title
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Rotation progress dots */}
        {items.length > 1 && (
          <div className="mt-8 flex gap-2">
            {items.map((m, i) => (
              <button
                key={m.id}
                type="button"
                aria-label={`Show slide ${i + 1}`}
                onClick={() => setIdx(i)}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  i === idx
                    ? "w-10 bg-accent"
                    : "w-5 bg-white/20 hover:bg-white/40",
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
