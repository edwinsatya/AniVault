"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Search, Star, X } from "lucide-react";
import { ANILIST_ENDPOINT } from "@/lib/anilist/client";
import { SEARCH_QUERY } from "@/lib/anilist/queries";
import type { MediaTitle } from "@/lib/anilist/types";
import { cn, formatFormat, formatScore, mediaTitle } from "@/lib/utils";

interface SearchResult {
  id: number;
  title: MediaTitle;
  coverImage: { large: string | null; color: string | null };
  format: string | null;
  seasonYear: number | null;
  episodes: number | null;
  averageScore: number | null;
  genres: string[];
}

const DEBOUNCE_MS = 300;

export function SearchClient() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(0);
  const [searched, setSearched] = useState(false);

  const runSearch = useCallback(async (term: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    try {
      const res = await fetch(ANILIST_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: SEARCH_QUERY,
          variables: { search: term, perPage: 8 },
        }),
        signal: controller.signal,
      });
      const json = (await res.json()) as {
        data?: { Page: { media: SearchResult[] } };
      };
      setResults(json.data?.Page.media ?? []);
      setSelected(0);
      setSearched(true);
      setLoading(false);
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        setResults([]);
        setSearched(true);
        setLoading(false);
      }
    }
  }, []);

  const onQueryChange = (value: string) => {
    setQuery(value);
    if (value.trim().length < 2) {
      abortRef.current?.abort();
      setResults([]);
      setSearched(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) return;
    const timer = setTimeout(() => runSearch(term), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query, runSearch]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = results[selected];
      if (target) router.push(`/anime/${target.id}`);
    } else if (e.key === "Escape") {
      onQueryChange("");
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-28 md:pt-36">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.21, 0.65, 0.36, 1] }}
      >
        <h1 className="mb-2 text-center font-display text-3xl font-bold tracking-tight text-snow md:text-4xl">
          Search the vault
        </h1>
        <p className="mb-8 text-center text-sm text-mist">
          Every anime on AniList, one keystroke away.
        </p>

        <div className="glass relative flex items-center gap-3 rounded-2xl px-4 py-1 transition-all focus-within:border-accent/60 focus-within:shadow-lg focus-within:shadow-accent/10">
          {loading ? (
            <Loader2 className="size-5 shrink-0 animate-spin text-accent-soft" />
          ) : (
            <Search className="size-5 shrink-0 text-mist" />
          )}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Titles, in any language…"
            className="w-full bg-transparent py-3.5 text-base text-snow placeholder:text-mist/60 focus:outline-none"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="search-results"
            aria-activedescendant={
              results[selected] ? `result-${results[selected].id}` : undefined
            }
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => onQueryChange("")}
              className="rounded-full p-1.5 text-mist transition-colors hover:bg-white/10 hover:text-snow"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <p className="mt-3 hidden text-center text-xs text-mist/60 md:block">
          <kbd className="rounded border border-line px-1.5 py-0.5">↑</kbd>{" "}
          <kbd className="rounded border border-line px-1.5 py-0.5">↓</kbd> to
          navigate ·{" "}
          <kbd className="rounded border border-line px-1.5 py-0.5">Enter</kbd>{" "}
          to open
        </p>

        <div id="search-results" role="listbox" className="mt-6 space-y-2">
          {results.map((result, i) => {
            const title = mediaTitle(result.title);
            return (
              <button
                key={result.id}
                id={`result-${result.id}`}
                role="option"
                aria-selected={i === selected}
                type="button"
                onClick={() => router.push(`/anime/${result.id}`)}
                onMouseEnter={() => setSelected(i)}
                className={cn(
                  "flex w-full items-center gap-4 rounded-2xl border p-3 text-left transition-all duration-150",
                  i === selected
                    ? "border-accent/60 bg-accent/10"
                    : "border-transparent bg-panel/60 hover:bg-panel",
                )}
              >
                <div className="relative h-16 w-11 shrink-0 overflow-hidden rounded-lg bg-elev">
                  {result.coverImage.large && (
                    <Image
                      src={result.coverImage.large}
                      alt={title}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-snow">
                    {title}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-mist">
                    {[
                      result.seasonYear,
                      formatFormat(result.format),
                      result.episodes ? `${result.episodes} eps` : null,
                      result.genres.slice(0, 2).join(", "),
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                {result.averageScore != null && (
                  <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-snow">
                    <Star className="size-3.5 fill-amber-300 text-amber-300" />
                    {formatScore(result.averageScore)}
                  </span>
                )}
              </button>
            );
          })}

          {searched && !loading && results.length === 0 && (
            <div className="py-16 text-center">
              <p className="font-display text-lg font-bold text-snow">
                Nothing found
              </p>
              <p className="mt-1 text-sm text-mist">
                Try a different spelling — romaji often works best.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
