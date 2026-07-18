import type { MediaSort } from "@/lib/anilist/types";

/**
 * Mood-based discovery: each vibe maps to a curated genre/tag combination
 * that feeds straight into the AniList browse query.
 */
export interface Mood {
  slug: string;
  label: string;
  tagline: string;
  genres: string[];
  tags?: string[];
  sort: MediaSort;
  /** Tailwind gradient classes for the vibe card art direction. */
  gradient: string;
}

export const MOODS: Mood[] = [
  {
    slug: "comfort",
    label: "Comfort Watch",
    tagline: "Warm, low-stakes, healing",
    genres: ["Slice of Life"],
    tags: ["Iyashikei"],
    sort: "SCORE_DESC",
    gradient: "from-emerald-500/25 via-teal-500/10 to-transparent",
  },
  {
    slug: "gut-punch",
    label: "Gut-Punch",
    tagline: "Bring tissues. You'll need them",
    genres: ["Drama"],
    tags: ["Tragedy"],
    sort: "SCORE_DESC",
    gradient: "from-rose-600/25 via-red-500/10 to-transparent",
  },
  {
    slug: "adrenaline",
    label: "Hype & Adrenaline",
    tagline: "Sakuga. Screaming. Goosebumps",
    genres: ["Action"],
    sort: "POPULARITY_DESC",
    gradient: "from-orange-500/25 via-amber-500/10 to-transparent",
  },
  {
    slug: "slow-burn",
    label: "Slow Burn",
    tagline: "Mind games and quiet dread",
    genres: ["Mystery", "Psychological", "Thriller"],
    sort: "SCORE_DESC",
    gradient: "from-indigo-500/25 via-violet-500/10 to-transparent",
  },
  {
    slug: "otherworldly",
    label: "Otherworldly",
    tagline: "Escape into somewhere vast",
    genres: ["Fantasy", "Adventure"],
    sort: "POPULARITY_DESC",
    gradient: "from-sky-500/25 via-cyan-500/10 to-transparent",
  },
];

export function findMood(slug: string | undefined): Mood | undefined {
  return MOODS.find((mood) => mood.slug === slug);
}
