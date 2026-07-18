# AniVault

A cinematic anime discovery and tracking web app — dark, motion-rich, and built like a personal media vault. Powered by the public [AniList GraphQL API](https://docs.anilist.co).

## Features

- **Home** — rotating full-bleed trending hero, mood-based "vibe" cards, and swipeable rails for Trending, This Season, All-Time Top Rated, and Upcoming.
- **Discover** — full catalog with genre/season/year/format/status/score filters (bottom sheet on mobile), sorting, and pagination.
- **Anime detail** — cinematic trailer hero (muted YouTube loop that pauses off-screen), ambient page theming extracted from each cover's accent color, characters & voice actors, franchise relations, and recommendations.
- **Search** — instant debounced search with full keyboard navigation.
- **My Vault** — Watching / Completed / Plan to Watch / Dropped with drag-to-reorder, episode progress, 1–10 ratings, collection stats, and a live airing countdown for everything you're watching. Persisted to localStorage behind a swappable storage adapter.
- **Seasonal chart** — any season, any year, with airing countdowns on current-season cards.
- **Compare tray** — pick up to three titles anywhere in the app and compare them side by side in a slide-up drawer.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Framer Motion · Zustand · AniList GraphQL

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No API key or environment variables needed.

## Notes

- AniList responses are cached server-side via the Next.js Data Cache with per-query revalidation windows, keeping the app comfortably under AniList's rate limits.
- Adult-flagged titles are filtered out everywhere.
- All personal data stays in your browser (localStorage). The store layer is structured so a real database can replace it without touching the UI.

Data from [AniList](https://anilist.co). Not affiliated with AniList.
