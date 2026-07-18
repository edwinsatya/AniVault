import type {
  ListMedia,
  MediaSeason,
  MediaSnapshot,
  MediaTitle,
} from "@/lib/anilist/types";

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function mediaTitle(title: MediaTitle): string {
  return title.english ?? title.romaji ?? title.native ?? "Untitled";
}

export function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Allow only harmless inline tags from AniList descriptions. */
export function sanitizeDescription(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<(?!\/?(?:br|i|em|b|strong|p)\b)[^>]*>/gi, "");
}

export function formatScore(score: number): string {
  return (score / 10).toFixed(1);
}

const compactFormatter = new Intl.NumberFormat("en", { notation: "compact" });
export function compactNumber(n: number): string {
  return compactFormatter.format(n);
}

export function titleCase(value: string): string {
  return value
    .toLowerCase()
    .split(/[_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatFormat(format: string | null): string {
  if (!format) return "";
  if (format === "TV") return "TV";
  if (format === "TV_SHORT") return "TV Short";
  if (format === "OVA" || format === "ONA") return format;
  return titleCase(format);
}

export function seasonLabel(season: MediaSeason): string {
  return titleCase(season);
}

export const SEASONS: MediaSeason[] = ["WINTER", "SPRING", "SUMMER", "FALL"];

export function currentSeason(): { season: MediaSeason; year: number } {
  const now = new Date();
  const month = now.getMonth();
  const season: MediaSeason =
    month <= 1 || month === 11
      ? "WINTER"
      : month <= 4
        ? "SPRING"
        : month <= 7
          ? "SUMMER"
          : "FALL";
  // December belongs to next year's winter season on AniList
  const year =
    season === "WINTER" && month === 11
      ? now.getFullYear() + 1
      : now.getFullYear();
  return { season, year };
}

export function nextSeason(): { season: MediaSeason; year: number } {
  const { season, year } = currentSeason();
  const idx = SEASONS.indexOf(season);
  const next = SEASONS[(idx + 1) % 4];
  return { season: next, year: next === "WINTER" ? year + 1 : year };
}

/** "3d 4h" / "2h 18m" / "36m" from a duration in seconds. */
export function formatTimeUntil(seconds: number): string {
  if (seconds <= 0) return "now";
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

/** "#7c5aff" -> "124 90 255" for use inside rgb(var(--ambient) / a). */
export function hexToRgbChannels(hex: string | null | undefined): string | null {
  if (!hex) return null;
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return null;
  const n = parseInt(match[1], 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

export function toSnapshot(media: ListMedia): MediaSnapshot {
  return {
    id: media.id,
    title: mediaTitle(media.title),
    cover: media.coverImage.extraLarge ?? media.coverImage.large ?? "",
    color: media.coverImage.color,
    format: media.format,
    status: media.status,
    season: media.season,
    seasonYear: media.seasonYear,
    episodes: media.episodes,
    duration: media.duration,
    averageScore: media.averageScore,
    popularity: media.popularity,
    favourites: media.favourites,
    genres: media.genres,
    studio: media.studios?.nodes[0]?.name ?? null,
  };
}

export const ANILIST_GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mahou Shoujo",
  "Mecha",
  "Music",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
];
