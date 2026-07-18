import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MediaSnapshot } from "@/lib/anilist/types";
import { createVaultStorage } from "./storage";

export type VaultStatus = "watching" | "completed" | "planning" | "dropped";

export const VAULT_STATUSES: { key: VaultStatus; label: string }[] = [
  { key: "watching", label: "Watching" },
  { key: "completed", label: "Completed" },
  { key: "planning", label: "Plan to Watch" },
  { key: "dropped", label: "Dropped" },
];

export interface VaultEntry {
  mediaId: number;
  status: VaultStatus;
  /** Personal rating, 1–10. */
  rating: number | null;
  /** Episodes watched. */
  progress: number;
  /** Manual sort position within its status list. */
  order: number;
  addedAt: number;
  updatedAt: number;
  media: MediaSnapshot;
}

interface VaultState {
  entries: VaultEntry[];
  upsert: (media: MediaSnapshot, status: VaultStatus) => void;
  remove: (mediaId: number) => void;
  setStatus: (mediaId: number, status: VaultStatus) => void;
  setRating: (mediaId: number, rating: number | null) => void;
  setProgress: (mediaId: number, progress: number) => void;
  reorder: (status: VaultStatus, orderedIds: number[]) => void;
}

export const useVaultStore = create<VaultState>()(
  persist(
    (set) => ({
      entries: [],

      upsert: (media, status) =>
        set((state) => {
          const now = Date.now();
          const existing = state.entries.find((e) => e.mediaId === media.id);
          if (existing) {
            return {
              entries: state.entries.map((e) =>
                e.mediaId === media.id
                  ? { ...e, status, media, updatedAt: now }
                  : e,
              ),
            };
          }
          const maxOrder = Math.max(
            -1,
            ...state.entries
              .filter((e) => e.status === status)
              .map((e) => e.order),
          );
          const entry: VaultEntry = {
            mediaId: media.id,
            status,
            rating: null,
            progress: status === "completed" ? (media.episodes ?? 0) : 0,
            order: maxOrder + 1,
            addedAt: now,
            updatedAt: now,
            media,
          };
          return { entries: [...state.entries, entry] };
        }),

      remove: (mediaId) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.mediaId !== mediaId),
        })),

      setStatus: (mediaId, status) =>
        set((state) => ({
          entries: state.entries.map((e) =>
            e.mediaId === mediaId
              ? {
                  ...e,
                  status,
                  progress:
                    status === "completed"
                      ? (e.media.episodes ?? e.progress)
                      : e.progress,
                  updatedAt: Date.now(),
                }
              : e,
          ),
        })),

      setRating: (mediaId, rating) =>
        set((state) => ({
          entries: state.entries.map((e) =>
            e.mediaId === mediaId
              ? { ...e, rating, updatedAt: Date.now() }
              : e,
          ),
        })),

      setProgress: (mediaId, progress) =>
        set((state) => ({
          entries: state.entries.map((e) =>
            e.mediaId === mediaId
              ? {
                  ...e,
                  progress: Math.max(0, progress),
                  updatedAt: Date.now(),
                }
              : e,
          ),
        })),

      reorder: (status, orderedIds) =>
        set((state) => ({
          entries: state.entries.map((e) =>
            e.status === status && orderedIds.includes(e.mediaId)
              ? { ...e, order: orderedIds.indexOf(e.mediaId) }
              : e,
          ),
        })),
    }),
    {
      name: "anivault.vault.v1",
      storage: createVaultStorage(),
      version: 1,
    },
  ),
);

export function entriesFor(
  entries: VaultEntry[],
  status: VaultStatus,
): VaultEntry[] {
  return entries
    .filter((e) => e.status === status)
    .sort((a, b) => a.order - b.order || a.addedAt - b.addedAt);
}
