"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeftRight, Bookmark, Check, ChevronDown, Trash2 } from "lucide-react";
import type { MediaSnapshot } from "@/lib/anilist/types";
import { useCompareStore } from "@/lib/store/compare";
import {
  VAULT_STATUSES,
  useVaultStore,
  type VaultStatus,
} from "@/lib/store/vault";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

/** Add/move/remove a title in the vault via a status dropdown. */
export function VaultActions({ media }: { media: MediaSnapshot }) {
  // False during SSR/hydration so the persisted vault state doesn't mismatch
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const entry = useVaultStore((s) =>
    s.entries.find((e) => e.mediaId === media.id),
  );
  const upsert = useVaultStore((s) => s.upsert);
  const remove = useVaultStore((s) => s.remove);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const current = mounted ? entry : undefined;
  const currentLabel = current
    ? VAULT_STATUSES.find((s) => s.key === current.status)?.label
    : null;

  const pick = (status: VaultStatus) => {
    upsert(media, status);
    setOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all",
          current
            ? "bg-white/10 text-snow ring-1 ring-white/20 hover:bg-white/15"
            : "bg-accent text-white shadow-lg shadow-accent/30 hover:bg-accent-soft",
        )}
      >
        {current ? (
          <>
            <Check className="size-4 text-accent-soft" />
            {currentLabel}
          </>
        ) : (
          <>
            <Bookmark className="size-4" />
            Add to Vault
          </>
        )}
        <ChevronDown
          className={cn("size-4 transition-transform", open && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-30 mt-2 w-52 overflow-hidden rounded-xl border border-line bg-elev shadow-2xl shadow-black/50"
          >
            {VAULT_STATUSES.map((status) => (
              <button
                key={status.key}
                type="button"
                onClick={() => pick(status.key)}
                className={cn(
                  "flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/5",
                  current?.status === status.key
                    ? "text-accent-soft"
                    : "text-fog",
                )}
              >
                {status.label}
                {current?.status === status.key && (
                  <Check className="size-4" />
                )}
              </button>
            ))}
            {current && (
              <button
                type="button"
                onClick={() => {
                  remove(media.id);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 border-t border-line/60 px-4 py-2.5 text-left text-sm text-rose-400 transition-colors hover:bg-rose-500/10"
              >
                <Trash2 className="size-4" />
                Remove from vault
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function CompareButton({ media }: { media: MediaSnapshot }) {
  const inCompare = useCompareStore((s) =>
    s.items.some((m) => m.id === media.id),
  );
  const toggle = useCompareStore((s) => s.toggle);

  return (
    <button
      type="button"
      onClick={() => toggle(media)}
      aria-pressed={inCompare}
      className={cn(
        "flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-colors",
        inCompare
          ? "border-accent bg-accent/15 text-snow"
          : "border-white/20 text-snow hover:border-white/40 hover:bg-white/5",
      )}
    >
      <ArrowLeftRight className="size-4" />
      {inCompare ? "In tray" : "Compare"}
    </button>
  );
}
