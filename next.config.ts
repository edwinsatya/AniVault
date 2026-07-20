import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AniList and YouTube already serve CDN-optimized derivatives at the sizes
    // we request (coverImage.extraLarge ~500px, large ~230px), so routing them
    // through Vercel's optimizer buys nothing and burns the Hobby-plan
    // transformation quota. Browsers fetch these hosts directly instead.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "**.anilist.co" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

export default nextConfig;
