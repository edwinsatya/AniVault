# AniVault

Cinematic anime discovery + tracking app. Next.js 16 (App Router, Turbopack), Tailwind CSS 4, TypeScript, Framer Motion, Zustand. Data from the public AniList GraphQL API (no key). No backend — user data persists to localStorage.

## Commands

- `npm run dev` — dev server
- `npm run build` — production build (TypeScript checked here; ESLint is separate)
- `npx eslint .` — lint (build does not run it)

## Architecture

- `lib/anilist/` — GraphQL layer. `client.ts` posts to `https://graphql.anilist.co` through the Next Data Cache (`next: { revalidate }` per query — this is the rate-limit strategy; pages are `force-dynamic` but every fetch is cached). `queries.ts` holds query strings; the homepage batches four rails into one aliased request. Always filter `isAdult: false`.
- `lib/store/` — Zustand stores. `vault.ts` persists via `storage.ts` (the swap point for a future DB backend — keep persistence details behind it). `compare.ts` is session-only.
- `lib/utils.ts` — `toSnapshot()` converts API media to the flat `MediaSnapshot` persisted in stores.
- Ambient theming: `--ambient` CSS variable (raw `R G B` channels) set per anime page by `components/anime/ambient-scope.tsx` from `coverImage.color`, canvas extraction as fallback. Used via `rgb(var(--ambient) / a)`, `.ambient-glow`, `.ambient-ring`.
- Design tokens live in `@theme` in `app/globals.css` (abyss/panel/elev surfaces, mist/fog/snow text, single `accent` violet). Fonts: Space Grotesk (`font-display`) + Inter (`font-body`) wired through next/font variables.
- Mobile: bottom tab bar (`components/layout/mobile-tab-bar.tsx`) replaces top-nav links under `md:`; rails are snap-scroll carousels; the discover filter panel becomes a bottom sheet. Fixed overlays must clear the tab bar on mobile (see CompareTray's `bottom-24 md:bottom-6`).

## Conventions

- Server Components by default; `"use client"` only where interactivity requires it. Client components receive plain serializable props.
- Grids that can hold long unbreakable text need explicit `grid-cols-1` (Tailwind's `minmax(0,1fr)`) — implicit auto columns blow out mobile layouts.
- Hydration-sensitive reads of persisted stores use the `useSyncExternalStore` mounted-flag pattern (see `vault-client.tsx`), not setState-in-effect.
- Respect `prefers-reduced-motion`: framer-motion is globally configured via `MotionConfig reducedMotion="user"` in `components/motion.tsx`; gate imperative animation (hero rotation, trailer autoplay) on `useReducedMotion()`.
