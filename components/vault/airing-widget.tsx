"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { ANILIST_ENDPOINT } from "@/lib/anilist/client";
import { AIRING_QUERY } from "@/lib/anilist/queries";
import type { AiringEpisode, MediaTitle } from "@/lib/anilist/types";
import { mediaTitle } from "@/lib/utils";

interface AiringMedia {
  id: number;
  title: MediaTitle;
  coverImage: { large: string | null; color: string | null };
  nextAiringEpisode: AiringEpisode | null;
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return "Airing now";
  const total = Math.floor(ms / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return days > 0
    ? `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

/** Live countdown to the next episode of everything in the Watching list. */
export function AiringWidget({ mediaIds }: { mediaIds: number[] }) {
  const [airing, setAiring] = useState<AiringMedia[]>([]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (mediaIds.length === 0) return;
    const controller = new AbortController();
    fetch(ANILIST_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: AIRING_QUERY,
        variables: { ids: mediaIds.slice(0, 25) },
      }),
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((json: { data?: { Page: { media: AiringMedia[] } } }) => {
        const list = (json.data?.Page.media ?? [])
          .filter((m) => m.nextAiringEpisode)
          .sort(
            (a, b) =>
              a.nextAiringEpisode!.airingAt - b.nextAiringEpisode!.airingAt,
          );
        setAiring(list);
      })
      .catch(() => {});
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaIds.join(",")]);

  useEffect(() => {
    if (airing.length === 0) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [airing.length]);

  // Derive from current ids so removed entries disappear without extra state
  const visible =
    mediaIds.length === 0
      ? []
      : airing.filter((m) => mediaIds.includes(m.id));
  if (visible.length === 0) return null;

  return (
    <section className="mb-10">
      <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-soft">
        <Clock className="size-3.5" />
        Airing next
      </p>
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 md:mx-0 md:px-0">
        {visible.map((media) => {
          const ep = media.nextAiringEpisode!;
          const msLeft = ep.airingAt * 1000 - now;
          return (
            <Link
              key={media.id}
              href={`/anime/${media.id}`}
              className="glass group flex w-64 shrink-0 items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-white/8"
            >
              <div className="relative h-16 w-11 shrink-0 overflow-hidden rounded-lg bg-elev">
                {media.coverImage.large && (
                  <Image
                    src={media.coverImage.large}
                    alt={mediaTitle(media.title)}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-snow">
                  {mediaTitle(media.title)}
                </p>
                <p className="mt-0.5 text-xs text-mist">Episode {ep.episode}</p>
                <p className="mt-1 font-mono text-sm font-semibold tabular-nums text-accent-soft">
                  {formatCountdown(msLeft)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
