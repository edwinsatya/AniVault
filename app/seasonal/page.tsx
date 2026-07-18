import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getSeasonalAnime } from "@/lib/anilist/api";
import type { MediaSeason } from "@/lib/anilist/types";
import { SEASONS, cn, currentSeason, titleCase } from "@/lib/utils";
import { MediaGrid } from "@/components/media/media-grid";
import { Pagination } from "@/components/ui/pagination";
import { VaultOffline } from "@/components/ui/offline";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Seasonal Chart",
  description: "Every anime airing by season and year.",
};

type SearchParams = { [key: string]: string | string[] | undefined };

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SeasonalPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const fallback = currentSeason();

  const seasonRaw = first(sp.season)?.toUpperCase();
  const season: MediaSeason = SEASONS.includes(seasonRaw as MediaSeason)
    ? (seasonRaw as MediaSeason)
    : fallback.season;

  const yearRaw = Number(first(sp.year));
  const year =
    Number.isFinite(yearRaw) && yearRaw >= 1970 && yearRaw <= fallback.year + 2
      ? yearRaw
      : fallback.year;

  const pageRaw = Number(first(sp.page));
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  const result = await getSeasonalAnime(season, year, page);
  const isCurrent =
    season === fallback.season && year === fallback.year;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-24 md:px-8 md:pt-28">
      <header className="mb-8">
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-soft">
          {isCurrent ? "Airing right now" : "The seasonal chart"}
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight text-snow md:text-5xl">
          {titleCase(season)} {year}
        </h1>
      </header>

      {/* Season / year switcher */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 rounded-full border border-line p-1">
          <Link
            href={`/seasonal?season=${season}&year=${year - 1}`}
            aria-label="Previous year"
            className="rounded-full p-2 text-mist transition-colors hover:bg-white/5 hover:text-snow"
          >
            <ChevronLeft className="size-4" />
          </Link>
          <span className="min-w-12 text-center text-sm font-semibold text-snow">
            {year}
          </span>
          <Link
            href={`/seasonal?season=${season}&year=${year + 1}`}
            aria-label="Next year"
            className="rounded-full p-2 text-mist transition-colors hover:bg-white/5 hover:text-snow"
          >
            <ChevronRight className="size-4" />
          </Link>
        </div>

        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {SEASONS.map((s) => (
            <Link
              key={s}
              href={`/seasonal?season=${s}&year=${year}`}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                s === season
                  ? "border-accent bg-accent/15 text-snow"
                  : "border-line text-mist hover:border-white/25 hover:text-fog",
              )}
            >
              {titleCase(s)}
            </Link>
          ))}
        </div>
      </div>

      {!result ? (
        <VaultOffline />
      ) : result.media.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-xl font-bold text-snow">
            Nothing charted for {titleCase(season)} {year}
          </p>
          <p className="mt-2 text-sm text-mist">
            Too far in the future — or too deep in the archive.
          </p>
        </div>
      ) : (
        <>
          <MediaGrid items={result.media} showAiring={isCurrent} />
          <Pagination
            path="/seasonal"
            params={{ season, year: String(year) }}
            current={result.pageInfo.currentPage}
            last={result.pageInfo.lastPage}
          />
        </>
      )}
    </div>
  );
}
