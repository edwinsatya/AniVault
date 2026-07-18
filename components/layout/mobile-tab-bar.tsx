"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Home, Library, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/search", label: "Search", icon: Search },
  { href: "/vault", label: "Vault", icon: Library },
];

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="glass fixed inset-x-0 bottom-0 z-40 border-x-0 border-b-0 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-4">
        {TABS.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
                active ? "text-accent-soft" : "text-mist",
              )}
            >
              <tab.icon className="size-5" strokeWidth={active ? 2.4 : 1.8} />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
