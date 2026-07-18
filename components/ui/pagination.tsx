import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  path,
  params,
  current,
  last,
}: {
  path: string;
  params: Record<string, string>;
  current: number;
  last: number;
}) {
  // AniList paginates far beyond usefulness — keep it sane.
  const lastPage = Math.min(last, 500);
  if (lastPage <= 1) return null;

  const href = (page: number) => {
    const query = new URLSearchParams({ ...params, page: String(page) });
    return `${path}?${query.toString()}`;
  };

  const linkClass = (disabled: boolean) =>
    cn(
      "flex items-center gap-1 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
      disabled
        ? "pointer-events-none border-line/50 text-mist/40"
        : "border-line text-fog hover:border-white/25 hover:text-snow",
    );

  return (
    <nav className="mt-12 flex items-center justify-center gap-4">
      <Link
        href={href(Math.max(1, current - 1))}
        aria-disabled={current <= 1}
        className={linkClass(current <= 1)}
      >
        <ChevronLeft className="size-4" />
        Prev
      </Link>
      <span className="text-sm text-mist">
        Page <span className="font-semibold text-snow">{current}</span> of{" "}
        {lastPage}
      </span>
      <Link
        href={href(Math.min(lastPage, current + 1))}
        aria-disabled={current >= lastPage}
        className={linkClass(current >= lastPage)}
      >
        Next
        <ChevronRight className="size-4" />
      </Link>
    </nav>
  );
}
