import { getHomeData } from "@/lib/anilist/api";
import { nextSeason } from "@/lib/utils";
import { Hero } from "@/components/home/hero";
import { VibeCards } from "@/components/home/vibe-cards";
import { MediaRail } from "@/components/media/media-rail";
import { SectionHeader } from "@/components/ui/section-header";
import { VaultOffline } from "@/components/ui/offline";
import { Reveal } from "@/components/motion";

// Rendered per-request; AniList responses are cached in the Data Cache with
// per-query revalidation, so this stays fast and rate-limit friendly.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getHomeData();
  if (!data) return <VaultOffline />;

  const heroItems = data.trending.filter((m) => m.bannerImage).slice(0, 6);
  const upcoming = nextSeason();

  return (
    <div>
      <Hero items={heroItems} />

      <div className="mx-auto max-w-7xl space-y-16 px-4 pb-24 pt-4 md:space-y-24 md:px-8">
        <Reveal>
          <section>
            <SectionHeader kicker="Find your vibe" title="Browse by mood" />
            <VibeCards />
          </section>
        </Reveal>

        <Reveal>
          <section>
            <SectionHeader
              kicker="What everyone's watching"
              title="Trending Now"
              href="/discover?sort=TRENDING_DESC"
            />
            <MediaRail items={data.trending} />
          </section>
        </Reveal>

        <Reveal>
          <section>
            <SectionHeader
              kicker="Airing right now"
              title="This Season"
              href="/seasonal"
            />
            <MediaRail items={data.season} showAiring />
          </section>
        </Reveal>

        <Reveal>
          <section>
            <SectionHeader
              kicker="The canon"
              title="All-Time Top Rated"
              href="/discover?sort=SCORE_DESC"
            />
            <MediaRail items={data.top} />
          </section>
        </Reveal>

        <Reveal>
          <section>
            <SectionHeader
              kicker="On the horizon"
              title="Upcoming"
              href={`/discover?season=${upcoming.season}&year=${upcoming.year}`}
            />
            <MediaRail items={data.upcoming} />
          </section>
        </Reveal>
      </div>
    </div>
  );
}
