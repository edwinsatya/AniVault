import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/motion";
import { TopNav } from "@/components/layout/top-nav";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { Footer } from "@/components/layout/footer";
import { CompareTray } from "@/components/anime/compare-tray";

const display = Space_Grotesk({
  variable: "--font-display-src",
  subsets: ["latin"],
  display: "swap",
});

const body = Inter({
  variable: "--font-body-src",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AniVault — Cinematic Anime Discovery",
    template: "%s — AniVault",
  },
  description:
    "A cinematic vault for anime discovery and tracking. Explore trending series, seasonal charts, and build your personal watchlist.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen antialiased">
        <MotionProvider>
          <TopNav />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CompareTray />
          <MobileTabBar />
        </MotionProvider>
      </body>
    </html>
  );
}
