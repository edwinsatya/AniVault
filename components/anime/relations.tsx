import Image from "next/image";
import Link from "next/link";
import type { RelationEdge } from "@/lib/anilist/types";
import { Rail } from "@/components/media/rail";
import { mediaTitle, titleCase } from "@/lib/utils";

/** Franchise timeline — prequels, sequels, spin-offs as a horizontal strip. */
export function RelationsStrip({ edges }: { edges: RelationEdge[] }) {
  const anime = edges.filter((edge) => edge.node.type === "ANIME");
  if (anime.length === 0) return null;

  return (
    <Rail>
      {anime.map((edge) => {
        const cover =
          edge.node.coverImage.extraLarge ?? edge.node.coverImage.large;
        return (
          <Link
            key={edge.id}
            href={`/anime/${edge.node.id}`}
            className="group w-32 shrink-0 snap-start sm:w-36"
          >
            <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-elev ring-1 ring-white/5 transition-all duration-300 group-hover:ring-accent/50">
              {cover && (
                <Image
                  src={cover}
                  alt={mediaTitle(edge.node.title)}
                  fill
                  sizes="144px"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                />
              )}
            </div>
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-soft">
              {titleCase(edge.relationType)}
            </p>
            <p className="mt-0.5 line-clamp-2 text-sm font-medium leading-snug text-snow/90 transition-colors group-hover:text-snow">
              {mediaTitle(edge.node.title)}
            </p>
          </Link>
        );
      })}
    </Rail>
  );
}
