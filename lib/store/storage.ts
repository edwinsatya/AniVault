import { createJSONStorage } from "zustand/middleware";

/**
 * Persistence boundary for user data. v1 writes to localStorage; swapping to
 * Supabase/Postgres later means replacing this adapter (async storage is
 * supported by zustand/persist) without touching the stores or UI.
 */
export function createVaultStorage<T>() {
  return createJSONStorage<T>(() => localStorage);
}
