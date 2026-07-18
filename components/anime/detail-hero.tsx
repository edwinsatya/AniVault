"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Cinematic detail hero: full-bleed banner art, upgraded to a muted looping
 * trailer when one exists. The trailer only fades in once YouTube reports it
 * is actually playing (so autoplay-blocked browsers keep the banner), and it
 * unmounts — resetting its state — when scrolled out of view.
 */
export function DetailHero({
  banner,
  cover,
  trailerId,
  title,
}: {
  banner: string | null;
  cover: string | null;
  trailerId: string | null;
  title: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || !trailerId) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [trailerId]);

  const showTrailer = Boolean(trailerId) && !reduced && inView;
  const backdrop = banner ?? cover;

  return (
    <div
      ref={ref}
      className="relative h-[46svh] min-h-[320px] w-full overflow-hidden md:h-[62svh]"
    >
      {backdrop && (
        <Image
          src={backdrop}
          alt=""
          fill
          priority
          sizes="100vw"
          className={
            banner
              ? "object-cover"
              : "scale-110 object-cover opacity-50 blur-2xl"
          }
        />
      )}

      {showTrailer && trailerId && (
        <TrailerLayer trailerId={trailerId} title={title} />
      )}

      {/* Gradient scrims + ambient tint from the cover's accent color */}
      <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/35 to-abyss/20" />
      <div className="pointer-events-none absolute inset-0 opacity-60 mix-blend-soft-light ambient-glow" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-abyss via-abyss/70 to-transparent" />
    </div>
  );
}

function TrailerLayer({
  trailerId,
  title,
}: {
  trailerId: string;
  title: string;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [playing, setPlaying] = useState(false);

  // YouTube widget API: after sending "listening", the player reports state
  // via postMessage. playerState === 1 means playback actually started.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (typeof e.data !== "string" || !e.origin.includes("youtube")) return;
      try {
        const data = JSON.parse(e.data) as { info?: { playerState?: number } };
        if (data.info?.playerState === 1) setPlaying(true);
      } catch {
        // not a player message
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div
      className={`absolute inset-0 overflow-hidden transition-opacity duration-1000 ${
        playing ? "opacity-100" : "opacity-0"
      }`}
    >
      <iframe
        ref={iframeRef}
        title={`${title} trailer`}
        src={`https://www.youtube-nocookie.com/embed/${trailerId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerId}&modestbranding=1&playsinline=1&rel=0&iv_load_policy=3&disablekb=1&enablejsapi=1`}
        allow="autoplay; encrypted-media"
        onLoad={() =>
          iframeRef.current?.contentWindow?.postMessage(
            JSON.stringify({ event: "listening", id: "anivault-trailer" }),
            "*",
          )
        }
        className="pointer-events-none absolute left-1/2 top-1/2 aspect-video w-[max(100vw,120svh)] -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
}
