import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Flame, Heart, Star } from "lucide-react";
import { getAnimeDetail } from "@/lib/anilist/api";
import {
  compactNumber,
  formatFormat,
  formatScore,
  formatTimeUntil,
  mediaTitle,
  sanitizeDescription,
  stripHtml,
  titleCase,
  toSnapshot,
} from "@/lib/utils";
import { AmbientScope } from "@/components/anime/ambient-scope";
import { DetailHero } from "@/components/anime/detail-hero";
import { CompareButton, VaultActions } from "@/components/anime/vault-actions";
import { CharacterGrid } from "@/components/anime/characters";
import { RelationsStrip } from "@/components/anime/relations";
import { MediaRail } from "@/components/media/media-rail";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/motion";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const media = await getAnimeDetail(Number(id));
  if (!media) return { title: "Not found" };
  const title = mediaTitle(media.title);
  const description = media.description
    ? stripHtml(media.description).slice(0, 200)
    : `${title} on AniVault`;
  const image = media.bannerImage ?? media.coverImage.extraLarge;
  return {
    title,
    description,
    openGraph: {
      title: `${title} — AniVault`,
      description,
      ...(image ? { images: [{ url: image }] } : {}),
    },
  };
}

export default async function AnimePage({ params }: { params: Params }) {
  const { id } = await params;
  const media = await getAnimeDetail(Number(id));
  if (!media || media.isAdult) notFound();

  const title = mediaTitle(media.title);
  const cover = media.coverImage.extraLarge ?? media.coverImage.large;
  const snapshot = toSnapshot(media);
  const studio = media.studios?.nodes[0]?.name;
  const trailerId =
    media.trailer?.site === "youtube" ? media.trailer.id : null;

  const characters = media.characters?.edges ?? [];
  const relations = media.relations?.edges ?? [];
  const recommendations = (media.recommendations?.nodes ?? [])
    .map((n) => n.mediaRecommendation)
    .filter((m): m is NonNullable<typeof m> => m != null && !m.isAdult);

  const tags = media.tags
    .filter((t) => !t.isMediaSpoiler && !t.isGeneralSpoiler)
    .slice(0, 10);

  const metaPills = [
    formatFormat(media.format),
    media.season && media.seasonYear
      ? `${titleCase(media.season)} ${media.seasonYear}`
      : media.seasonYear?.toString(),
    media.episodes ? `${media.episodes} eps` : null,
    media.duration ? `${media.duration} min` : null,
    media.status ? titleCase(media.status) : null,
  ].filter(Boolean) as string[];

  return (
    <AmbientScope
      colorHex={media.coverImage.color}
      coverUrl={media.coverImage.large}
    >
      <DetailHero
        banner={media.bannerImage}
        cover={cover}
        trailerId={trailerId}
        title={title}
      />

      <div className="relative z-10 mx-auto -mt-24 max-w-7xl px-4 md:-mt-36 md:px-8">
        {/* Identity row: cover + title */}
        <div className="flex items-end gap-4 md:gap-8">
          <div className="ambient-ring relative aspect-[2/3] w-28 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10 sm:w-36 md:w-52 md:rounded-2xl">
            {cover && (
              <Image
                src={cover}
                alt={title}
                fill
                priority
                sizes="(max-width: 768px) 144px, 208px"
                className="object-cover"
              />
            )}
          </div>
          <div className="min-w-0 pb-1 md:pb-4">
            {media.nextAiringEpisode && (
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-accent-soft">
                <Clock className="size-3.5" />
                Ep {media.nextAiringEpisode.episode} airs in{" "}
                {formatTimeUntil(media.nextAiringEpisode.timeUntilAiring)}
              </p>
            )}
            <h1 className="font-display text-2xl font-bold leading-tight tracking-tight text-snow sm:text-4xl md:text-5xl">
              {title}
            </h1>
            {media.title.romaji && media.title.romaji !== title && (
              <p className="mt-1.5 line-clamp-1 text-sm text-mist">
                {media.title.romaji}
              </p>
            )}
            <div className="mt-3 hidden flex-wrap gap-2 sm:flex">
              {metaPills.map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-white/15 px-3 py-1 text-xs text-fog"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <VaultActions media={snapshot} />
          <CompareButton media={snapshot} />
        </div>

        {/* Synopsis + stats */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            {media.description && (
              <>
                <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-mist">
                  Synopsis
                </h2>
                <div
                  className="synopsis max-w-3xl text-[15px] leading-relaxed text-fog/90"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeDescription(media.description),
                  }}
                />
              </>
            )}

            {media.genres.length > 0 && (
              <div className="mt-7 flex flex-wrap gap-2">
                {media.genres.map((genre) => (
                  <Link
                    key={genre}
                    href={`/discover?genres=${encodeURIComponent(genre)}`}
                    className="rounded-full bg-accent/15 px-4 py-1.5 text-xs font-semibold text-accent-soft transition-colors hover:bg-accent/25 hover:text-snow"
                  >
                    {genre}
                  </Link>
                ))}
              </div>
            )}

            {tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded-full border border-line/70 px-3 py-1 text-[11px] text-mist"
                    title={tag.rank != null ? `${tag.rank}% match` : undefined}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <aside className="glass h-fit rounded-2xl p-5">
            <div className="grid grid-cols-3 gap-4 border-b border-line/60 pb-5">
              <div>
                <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-mist">
                  <Star className="size-3 fill-amber-300 text-amber-300" />
                  Score
                </p>
                <p className="mt-1 font-display text-2xl font-bold text-snow">
                  {media.averageScore != null
                    ? formatScore(media.averageScore)
                    : "—"}
                </p>
              </div>
              <div>
                <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-mist">
                  <Flame className="size-3 text-accent-soft" />
                  Members
                </p>
                <p className="mt-1 font-display text-2xl font-bold text-snow">
                  {media.popularity != null
                    ? compactNumber(media.popularity)
                    : "—"}
                </p>
              </div>
              <div>
                <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-mist">
                  <Heart className="size-3 text-rose-400" />
                  Loves
                </p>
                <p className="mt-1 font-display text-2xl font-bold text-snow">
                  {media.favourites != null
                    ? compactNumber(media.favourites)
                    : "—"}
                </p>
              </div>
            </div>
            <dl className="space-y-3 pt-5 text-sm">
              {studio && (
                <div className="flex justify-between gap-4">
                  <dt className="text-mist">Studio</dt>
                  <dd className="text-right font-medium text-snow">{studio}</dd>
                </div>
              )}
              {media.startDate?.year && (
                <div className="flex justify-between gap-4">
                  <dt className="text-mist">Premiered</dt>
                  <dd className="text-right font-medium text-snow">
                    {media.startDate.year}
                  </dd>
                </div>
              )}
              {metaPills.slice(0, 5).map((pill, i) => (
                <div key={pill} className="flex justify-between gap-4 sm:hidden">
                  <dt className="text-mist">
                    {["Format", "Season", "Episodes", "Length", "Status"][i]}
                  </dt>
                  <dd className="text-right font-medium text-snow">{pill}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>

        {/* Sections */}
        <div className="mt-16 space-y-16 pb-24">
          {characters.length > 0 && (
            <Reveal>
              <section>
                <SectionHeader kicker="The cast" title="Characters" />
                <CharacterGrid edges={characters} />
              </section>
            </Reveal>
          )}

          {relations.filter((r) => r.node.type === "ANIME").length > 0 && (
            <Reveal>
              <section>
                <SectionHeader kicker="The franchise" title="Relations" />
                <RelationsStrip edges={relations} />
              </section>
            </Reveal>
          )}

          {recommendations.length > 0 && (
            <Reveal>
              <section>
                <SectionHeader
                  kicker="If you liked this"
                  title="Recommendations"
                />
                <MediaRail items={recommendations} />
              </section>
            </Reveal>
          )}
        </div>
      </div>
    </AmbientScope>
  );
}
