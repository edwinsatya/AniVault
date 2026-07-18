import type { Metadata } from "next";
import { browseAnime } from "@/lib/anilist/api";
import type {
  MediaFormat,
  MediaSeason,
  MediaSort,
  MediaStatus,
} from "@/lib/anilist/types";
import { findMood } from "@/lib/moods";
import { MediaGrid } from "@/components/media/media-grid";
import {
  FilterControls,
  type DiscoverFilters,
} from "@/components/discover/filter-controls";
import { Pagination } from "@/components/ui/pagination";
import { VaultOffline } from "@/components/ui/offline";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Discover",
  description: "Browse the full anime catalog with filters, moods and sorting.",
};

type SearchParams = { [key: string]: string | string[] | undefined };

const VALID_SORTS = new Set([
  "TRENDING_DESC",
  "POPULARITY_DESC",
  "SCORE_DESC",
  "START_DATE_DESC",
  "FAVOURITES_DESC",
  "TITLE_ROMAJI",
]);
const VALID_SEASONS = new Set(["WINTER", "SPRING", "SUMMER", "FALL"]);
const VALID_FORMATS = new Set([
  "TV",
  "TV_SHORT",
  "MOVIE",
  "SPECIAL",
  "OVA",
  "ONA",
]);
const VALID_STATUS = new Set(["RELEASING", "FINISHED", "NOT_YET_RELEASED"]);

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseList(value: string | string[] | undefined): string[] {
  const raw = first(value);
  return raw ? raw.split(",").filter(Boolean) : [];
}

function parseNum(value: string | string[] | undefined): number | undefined {
  const n = Number(first(value));
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const mood = findMood(first(sp.mood));
  const explicitGenres = parseList(sp.genres);
  const genres = explicitGenres.length
    ? explicitGenres
    : (mood?.genres ?? []);

  const seasonRaw = first(sp.season)?.toUpperCase();
  const season = VALID_SEASONS.has(seasonRaw ?? "")
    ? (seasonRaw as MediaSeason)
    : undefined;

  const formats = parseList(sp.format)
    .map((f) => f.toUpperCase())
    .filter((f) => VALID_FORMATS.has(f)) as MediaFormat[];

  const statusRaw = first(sp.status)?.toUpperCase();
  const status = VALID_STATUS.has(statusRaw ?? "")
    ? (statusRaw as MediaStatus)
    : undefined;

  const sortRaw = first(sp.sort)?.toUpperCase();
  const sort: MediaSort = VALID_SORTS.has(sortRaw ?? "")
    ? (sortRaw as MediaSort)
    : (mood?.sort ?? "POPULARITY_DESC");

  const year = parseNum(sp.year);
  const minScore = parseNum(sp.minScore);
  const page = parseNum(sp.page) ?? 1;

  const result = await browseAnime({
    page,
    genres: genres.length ? genres : undefined,
    tags: mood?.tags,
    season,
    seasonYear: year,
    formats: formats.length ? formats : undefined,
    status,
    minScore,
    sort,
  });

  const filters: DiscoverFilters = {
    genres,
    season,
    year,
    formats,
    status,
    minScore,
    sort,
  };

  // Preserved on pagination links
  const currentParams: Record<string, string> = {};
  for (const key of [
    "mood",
    "genres",
    "season",
    "year",
    "format",
    "status",
    "minScore",
    "sort",
  ]) {
    const value = first(sp[key]);
    if (value) currentParams[key] = value;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-24 md:px-8 md:pt-28">
      <header className="mb-8">
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-soft">
          {mood ? `Mood · ${mood.tagline}` : "The full catalog"}
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight text-snow md:text-5xl">
          {mood ? mood.label : "Discover"}
        </h1>
        {result && (
          <p className="mt-2 text-sm text-mist">
            {result.pageInfo.total.toLocaleString()} titles in the vault
          </p>
        )}
      </header>

      <FilterControls
        key={JSON.stringify(filters) + (mood?.slug ?? "")}
        filters={filters}
        moodLabel={mood?.label}
      />

      {!result ? (
        <VaultOffline />
      ) : result.media.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-xl font-bold text-snow">
            Nothing in the vault matches
          </p>
          <p className="mt-2 text-sm text-mist">
            Loosen a filter or two and try again.
          </p>
        </div>
      ) : (
        <>
          <MediaGrid items={result.media} />
          <Pagination
            path="/discover"
            params={currentParams}
            current={result.pageInfo.currentPage}
            last={result.pageInfo.lastPage}
          />
        </>
      )}
    </div>
  );
}
