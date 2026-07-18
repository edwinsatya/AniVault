"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/discover", label: "Discover" },
  { href: "/seasonal", label: "Seasonal" },
  { href: "/vault", label: "My Vault" },
];

export function TopNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        scrolled
          ? "border-b border-line/60 bg-abyss/80 backdrop-blur-xl"
          : "border-b border-transparent bg-gradient-to-b from-void/70 to-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link
          href="/"
          className="font-display text-lg font-bold tracking-[0.22em] text-snow"
        >
          ANI<span className="text-accent-soft">VAULT</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm transition-colors",
                pathname.startsWith(link.href)
                  ? "bg-white/8 text-snow"
                  : "text-mist hover:bg-white/5 hover:text-snow",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/search"
          aria-label="Search"
          className={cn(
            "rounded-full p-2.5 transition-colors",
            pathname.startsWith("/search")
              ? "bg-white/8 text-snow"
              : "text-mist hover:bg-white/5 hover:text-snow",
          )}
        >
          <Search className="size-5" />
        </Link>
      </div>
    </header>
  );
}
