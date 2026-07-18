import type { ListMedia } from "@/lib/anilist/types";
import { MediaCard } from "./media-card";
import { Rail, RailItem } from "./rail";

export function MediaRail({
  items,
  showAiring = false,
}: {
  items: ListMedia[];
  showAiring?: boolean;
}) {
  if (items.length === 0) return null;
  return (
    <Rail>
      {items.map((media) => (
        <RailItem key={media.id}>
          <MediaCard media={media} showAiring={showAiring} />
        </RailItem>
      ))}
    </Rail>
  );
}
