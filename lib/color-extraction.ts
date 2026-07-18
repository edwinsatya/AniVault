/**
 * Dynamic ambient theming. AniList already ships a hand-tuned accent for most
 * covers (coverImage.color), so that is the primary source. When it's missing
 * we fall back to sampling the cover on a canvas client-side.
 */

/** Average-color canvas sampling; resolves null on CORS or decode failure. */
export function extractDominantColor(imageUrl: string): Promise<string | null> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const size = 32;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);
        let r = 0;
        let g = 0;
        let b = 0;
        let count = 0;
        for (let i = 0; i < data.length; i += 4) {
          const [pr, pg, pb, pa] = [
            data[i],
            data[i + 1],
            data[i + 2],
            data[i + 3],
          ];
          if (pa < 128) continue;
          // Skip near-black/near-white pixels so the accent stays saturated
          const max = Math.max(pr, pg, pb);
          const min = Math.min(pr, pg, pb);
          if (max < 32 || min > 224) continue;
          r += pr;
          g += pg;
          b += pb;
          count++;
        }
        if (count === 0) return resolve(null);
        resolve(
          `${Math.round(r / count)} ${Math.round(g / count)} ${Math.round(b / count)}`,
        );
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = imageUrl;
  });
}

/** Clamp an "r g b" channel string to a floor of brightness for glow use. */
export function brightenChannels(channels: string, floor = 70): string {
  const parts = channels.split(" ").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return channels;
  const max = Math.max(...parts);
  if (max >= floor) return channels;
  const scale = floor / Math.max(max, 1);
  return parts.map((c) => Math.min(255, Math.round(c * scale))).join(" ");
}
