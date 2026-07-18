"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { brightenChannels, extractDominantColor } from "@/lib/color-extraction";
import { hexToRgbChannels } from "@/lib/utils";

/**
 * Dynamic ambient theming: retints `--ambient` for everything inside from the
 * anime's cover accent (AniList's coverImage.color, falling back to canvas
 * extraction when the API doesn't provide one).
 */
export function AmbientScope({
  colorHex,
  coverUrl,
  children,
}: {
  colorHex: string | null;
  coverUrl: string | null;
  children: ReactNode;
}) {
  const [channels, setChannels] = useState<string | null>(() =>
    hexToRgbChannels(colorHex),
  );

  useEffect(() => {
    if (channels || !coverUrl) return;
    let cancelled = false;
    extractDominantColor(coverUrl).then((extracted) => {
      if (!cancelled && extracted) setChannels(extracted);
    });
    return () => {
      cancelled = true;
    };
  }, [channels, coverUrl]);

  return (
    <div
      style={
        channels
          ? ({ "--ambient": brightenChannels(channels) } as CSSProperties)
          : undefined
      }
    >
      {children}
    </div>
  );
}
