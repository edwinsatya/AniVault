import { anilistFetchSafe } from "./client";
import { BROWSE_QUERY, DETAIL_QUERY, HOME_QUERY } from "./queries";
import type {
  DetailMedia,
  ListMedia,
  MediaFormat,
  MediaPage,
  MediaSeason,
  MediaSort,
  MediaStatus,
} from "./types";
import { currentSeason, nextSeason } from "@/lib/utils";

export interface HomeData {
  trending: ListMedia[];
  season: ListMedia[];
  top: ListMedia[];
  upcoming: ListMedia[];
}

export async function getHomeData(): Promise<HomeData | null> {
  const now = currentSeason();
  const next = nextSeason();
  const data = await anilistFetchSafe<{
    trending: { media: ListMedia[] };
    season: { media: ListMedia[] };
    top: { media: ListMedia[] };
    upcoming: { media: ListMedia[] };
  }>(
    HOME_QUERY,
    {
      season: now.season,
      seasonYear: now.year,
      nextSeason: next.season,
      nextSeasonYear: next.year,
    },
    1800,
  );
  if (!data) return null;
  return {
    trending: data.trending.media,
    season: data.season.media,
    top: data.top.media,
    upcoming: data.upcoming.media,
  };
}

export interface BrowseFilters {
  page?: number;
  perPage?: number;
  search?: string;
  genres?: string[];
  tags?: string[];
  season?: MediaSeason;
  seasonYear?: number;
  formats?: MediaFormat[];
  status?: MediaStatus;
  minScore?: number;
  sort?: MediaSort;
}

export async function browseAnime(
  filters: BrowseFilters,
): Promise<MediaPage | null> {
  const data = await anilistFetchSafe<{ Page: MediaPage }>(
    BROWSE_QUERY,
    {
      page: filters.page ?? 1,
      perPage: filters.perPage ?? 24,
      search: filters.search,
      genres: filters.genres,
      tags: filters.tags,
      season: filters.season,
      seasonYear: filters.seasonYear,
      formats: filters.formats,
      status: filters.status,
      minScore: filters.minScore,
      sort: filters.sort ? [filters.sort] : undefined,
    },
    900,
  );
  return data?.Page ?? null;
}

export async function getAnimeDetail(id: number): Promise<DetailMedia | null> {
  if (!Number.isFinite(id) || id <= 0) return null;
  const data = await anilistFetchSafe<{ Media: DetailMedia }>(
    DETAIL_QUERY,
    { id },
    3600,
  );
  return data?.Media ?? null;
}

export async function getSeasonalAnime(
  season: MediaSeason,
  year: number,
  page = 1,
): Promise<MediaPage | null> {
  const data = await anilistFetchSafe<{ Page: MediaPage }>(
    BROWSE_QUERY,
    { page, perPage: 24, season, seasonYear: year, sort: ["POPULARITY_DESC"] },
    1800,
  );
  return data?.Page ?? null;
}
