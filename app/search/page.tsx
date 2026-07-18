import type { Metadata } from "next";
import { SearchClient } from "@/components/search/search-client";

export const metadata: Metadata = {
  title: "Search",
  description: "Instant search across every anime on AniList.",
};

export default function SearchPage() {
  return <SearchClient />;
}
