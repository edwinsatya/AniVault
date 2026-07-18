import { create } from "zustand";
import type { MediaSnapshot } from "@/lib/anilist/types";

export const COMPARE_LIMIT = 3;

interface CompareState {
  items: MediaSnapshot[];
  open: boolean;
  toggle: (media: MediaSnapshot) => void;
  remove: (id: number) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
}

export const useCompareStore = create<CompareState>()((set) => ({
  items: [],
  open: false,

  toggle: (media) =>
    set((state) => {
      if (state.items.some((m) => m.id === media.id)) {
        const items = state.items.filter((m) => m.id !== media.id);
        return { items, open: items.length > 1 ? state.open : false };
      }
      if (state.items.length >= COMPARE_LIMIT) return state;
      return { items: [...state.items, media] };
    }),

  remove: (id) =>
    set((state) => {
      const items = state.items.filter((m) => m.id !== id);
      return { items, open: items.length > 1 ? state.open : false };
    }),

  clear: () => set({ items: [], open: false }),
  setOpen: (open) => set({ open }),
}));
