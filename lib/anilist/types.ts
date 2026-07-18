/** AniList GraphQL types — only the fields AniVault queries. */

export type MediaSeason = "WINTER" | "SPRING" | "SUMMER" | "FALL";
export type MediaFormat =
  | "TV"
  | "TV_SHORT"
  | "MOVIE"
  | "SPECIAL"
  | "OVA"
  | "ONA"
  | "MUSIC";
export type MediaStatus =
  | "FINISHED"
  | "RELEASING"
  | "NOT_YET_RELEASED"
  | "CANCELLED"
  | "HIATUS";
export type MediaSort =
  | "TRENDING_DESC"
  | "POPULARITY_DESC"
  | "SCORE_DESC"
  | "START_DATE_DESC"
  | "FAVOURITES_DESC"
  | "TITLE_ROMAJI";

export interface MediaTitle {
  romaji: string | null;
  english: string | null;
  native: string | null;
}

export interface CoverImage {
  extraLarge: string | null;
  large: string | null;
  color: string | null;
}

export interface FuzzyDate {
  year: number | null;
  month: number | null;
  day: number | null;
}

export interface AiringEpisode {
  airingAt: number;
  timeUntilAiring: number;
  episode: number;
}

export interface StudioNode {
  id: number;
  name: string;
}

export interface Trailer {
  id: string | null;
  site: string | null;
  thumbnail: string | null;
}

/** Compact shape used in rails, grids and cards. */
export interface ListMedia {
  id: number;
  title: MediaTitle;
  coverImage: CoverImage;
  bannerImage: string | null;
  format: MediaFormat | null;
  status: MediaStatus | null;
  season: MediaSeason | null;
  seasonYear: number | null;
  episodes: number | null;
  duration: number | null;
  averageScore: number | null;
  popularity: number | null;
  favourites: number | null;
  genres: string[];
  description: string | null;
  studios: { nodes: StudioNode[] } | null;
  nextAiringEpisode: AiringEpisode | null;
  isAdult: boolean;
}

export interface CharacterEdge {
  id: number;
  role: string;
  node: {
    id: number;
    name: { full: string | null };
    image: { large: string | null };
  };
  voiceActors: {
    id: number;
    name: { full: string | null };
    image: { large: string | null };
  }[];
}

export interface RelationEdge {
  id: number;
  relationType: string;
  node: {
    id: number;
    type: "ANIME" | "MANGA";
    format: MediaFormat | null;
    title: MediaTitle;
    coverImage: CoverImage;
    averageScore: number | null;
    seasonYear: number | null;
  };
}

export interface MediaTag {
  id: number;
  name: string;
  rank: number | null;
  isMediaSpoiler: boolean;
  isGeneralSpoiler: boolean;
}

/** Full shape for the detail page. */
export interface DetailMedia extends ListMedia {
  startDate: FuzzyDate | null;
  trailer: Trailer | null;
  tags: MediaTag[];
  characters: { edges: CharacterEdge[] } | null;
  relations: { edges: RelationEdge[] } | null;
  recommendations: {
    nodes: { rating: number; mediaRecommendation: ListMedia | null }[];
  } | null;
}

export interface PageInfo {
  total: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
}

export interface MediaPage {
  pageInfo: PageInfo;
  media: ListMedia[];
}

/**
 * Snapshot persisted into the vault / compare tray so those surfaces render
 * without refetching. Kept flat and minimal so it maps 1:1 onto a future DB row.
 */
export interface MediaSnapshot {
  id: number;
  title: string;
  cover: string;
  color: string | null;
  format: MediaFormat | null;
  status: MediaStatus | null;
  season: MediaSeason | null;
  seasonYear: number | null;
  episodes: number | null;
  duration: number | null;
  averageScore: number | null;
  popularity: number | null;
  favourites: number | null;
  genres: string[];
  studio: string | null;
}
