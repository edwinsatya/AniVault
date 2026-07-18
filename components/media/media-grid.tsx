import type { ListMedia } from "@/lib/anilist/types";
import { MediaCard } from "./media-card";

export function MediaGrid({
  items,
  showAiring = false,
}: {
  items: ListMedia[];
  showAiring?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((media) => (
        <MediaCard key={media.id} media={media} showAiring={showAiring} />
      ))}
    </div>
  );
}
