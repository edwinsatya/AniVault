"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical, Minus, Plus, Trash2 } from "lucide-react";
import {
  VAULT_STATUSES,
  entriesFor,
  useVaultStore,
  type VaultEntry,
  type VaultStatus,
} from "@/lib/store/vault";
import { cn, formatFormat } from "@/lib/utils";
import { AiringWidget } from "./airing-widget";
import { RatingDots } from "./rating-dots";
import { SkeletonGrid } from "@/components/ui/skeleton";

const emptySubscribe = () => () => {};

export function VaultClient() {
  // False during SSR/hydration so persisted entries don't cause a mismatch
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const [tab, setTab] = useState<VaultStatus>("watching");

  const entries = useVaultStore((s) => s.entries);
  const reorder = useVaultStore((s) => s.reorder);

  const list = useMemo(() => entriesFor(entries, tab), [entries, tab]);
  const ids = useMemo(() => list.map((e) => e.mediaId), [list]);

  const watchingIds = useMemo(
    () =>
      entriesFor(entries, "watching").map((e) => e.mediaId),
    [entries],
  );

  const stats = useMemo(() => {
    const completed = entries.filter((e) => e.status === "completed");
    const minutes = entries.reduce(
      (sum, e) => sum + e.progress * (e.media.duration ?? 24),
      0,
    );
    const rated = entries.filter((e) => e.rating != null);
    const meanRating = rated.length
      ? (
          rated.reduce((sum, e) => sum + (e.rating ?? 0), 0) / rated.length
        ).toFixed(1)
      : null;
    return {
      total: entries.length,
      completed: completed.length,
      hours: Math.round(minutes / 60),
      meanRating,
    };
  }, [entries]);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-5xl px-4 pb-24 pt-24 md:px-8 md:pt-28">
        <SkeletonGrid count={6} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-24 md:px-8 md:pt-28">
      <header className="mb-8">
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-soft">
          Your personal collection
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight text-snow md:text-5xl">
          My Vault
        </h1>

        {stats.total > 0 && (
          <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
            {[
              { label: "Titles", value: String(stats.total) },
              { label: "Completed", value: String(stats.completed) },
              { label: "Hours watched", value: `~${stats.hours}` },
              ...(stats.meanRating
                ? [{ label: "Avg rating", value: stats.meanRating }]
                : []),
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-2xl font-bold text-snow">
                  {stat.value}
                </p>
                <p className="text-[11px] uppercase tracking-wider text-mist">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </header>

      <AiringWidget mediaIds={watchingIds} />

      {/* Status tabs */}
      <div className="no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
        {VAULT_STATUSES.map((status) => {
          const count = entries.filter((e) => e.status === status.key).length;
          return (
            <button
              key={status.key}
              type="button"
              onClick={() => setTab(status.key)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                tab === status.key
                  ? "border-accent bg-accent/15 text-snow"
                  : "border-line text-mist hover:border-white/25 hover:text-fog",
              )}
            >
              {status.label}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                  tab === status.key
                    ? "bg-accent text-white"
                    : "bg-elev text-mist",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {list.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line py-20 text-center">
          <p className="font-display text-xl font-bold text-snow">
            Nothing here yet
          </p>
          <p className="mx-auto mt-2 max-w-xs text-sm text-mist">
            Find something worth vaulting and add it with the bookmark button.
          </p>
          <Link
            href="/discover"
            className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-soft"
          >
            Explore the Vault
          </Link>
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={ids}
          onReorder={(next) => reorder(tab, next as number[])}
          className="space-y-3"
        >
          {list.map((entry) => (
            <VaultRow key={entry.mediaId} entry={entry} />
          ))}
        </Reorder.Group>
      )}
    </div>
  );
}

function VaultRow({ entry }: { entry: VaultEntry }) {
  const controls = useDragControls();
  const setStatus = useVaultStore((s) => s.setStatus);
  const setRating = useVaultStore((s) => s.setRating);
  const setProgress = useVaultStore((s) => s.setProgress);
  const remove = useVaultStore((s) => s.remove);

  const { media } = entry;
  const total = media.episodes;

  return (
    <Reorder.Item
      value={entry.mediaId}
      dragListener={false}
      dragControls={controls}
      className="flex items-center gap-3 rounded-2xl border border-line/60 bg-panel/70 p-3 md:gap-4"
    >
      <button
        type="button"
        aria-label="Drag to reorder"
        onPointerDown={(e) => controls.start(e)}
        className="shrink-0 cursor-grab touch-none p-1 text-mist/60 transition-colors hover:text-fog active:cursor-grabbing"
      >
        <GripVertical className="size-5" />
      </button>

      <Link
        href={`/anime/${media.id}`}
        className="relative h-20 w-14 shrink-0 overflow-hidden rounded-lg bg-elev"
      >
        {media.cover && (
          <Image
            src={media.cover}
            alt={media.title}
            fill
            sizes="56px"
            className="object-cover"
          />
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <Link
            href={`/anime/${media.id}`}
            className="truncate text-sm font-semibold text-snow transition-colors hover:text-accent-soft"
          >
            {media.title}
          </Link>
          <div className="flex items-center gap-2">
            <select
              value={entry.status}
              onChange={(e) =>
                setStatus(media.id, e.target.value as VaultStatus)
              }
              aria-label="Status"
              className="rounded-lg border border-line bg-elev px-2 py-1 text-xs text-fog outline-none focus:border-accent"
            >
              {VAULT_STATUSES.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              aria-label={`Remove ${media.title}`}
              onClick={() => remove(media.id)}
              className="rounded-lg p-1.5 text-mist/60 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>

        <p className="mt-0.5 text-xs text-mist">
          {[
            formatFormat(media.format),
            media.seasonYear,
            media.studio,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2">
          {/* Episode progress */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Decrease progress"
              onClick={() => setProgress(media.id, entry.progress - 1)}
              disabled={entry.progress <= 0}
              className="rounded-md border border-line p-1 text-mist transition-colors hover:border-white/25 hover:text-snow disabled:opacity-30"
            >
              <Minus className="size-3" />
            </button>
            <span className="min-w-14 text-center text-xs tabular-nums text-fog">
              {entry.progress}
              {total ? ` / ${total}` : ""} ep
            </span>
            <button
              type="button"
              aria-label="Increase progress"
              onClick={() => setProgress(media.id, entry.progress + 1)}
              disabled={total != null && entry.progress >= total}
              className="rounded-md border border-line p-1 text-mist transition-colors hover:border-white/25 hover:text-snow disabled:opacity-30"
            >
              <Plus className="size-3" />
            </button>
          </div>

          <RatingDots
            value={entry.rating}
            onChange={(value) => setRating(media.id, value)}
          />
        </div>
      </div>
    </Reorder.Item>
  );
}
