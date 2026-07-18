import Image from "next/image";
import type { CharacterEdge } from "@/lib/anilist/types";
import { titleCase } from "@/lib/utils";

export function CharacterGrid({ edges }: { edges: CharacterEdge[] }) {
  if (edges.length === 0) return null;
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {edges.map((edge) => {
        const va = edge.voiceActors[0];
        return (
          <div
            key={edge.id}
            className="flex items-center justify-between gap-3 rounded-2xl border border-line/60 bg-panel/70 p-2.5"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-elev">
                {edge.node.image.large && (
                  <Image
                    src={edge.node.image.large}
                    alt={edge.node.name.full ?? "Character"}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-snow">
                  {edge.node.name.full}
                </p>
                <p className="text-xs text-mist">{titleCase(edge.role)}</p>
              </div>
            </div>
            {va && (
              <div className="flex min-w-0 items-center gap-3 text-right">
                <div className="min-w-0">
                  <p className="truncate text-sm text-fog">{va.name.full}</p>
                  <p className="text-xs text-mist">Voice</p>
                </div>
                <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-elev">
                  {va.image.large && (
                    <Image
                      src={va.image.large}
                      alt={va.name.full ?? "Voice actor"}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
