import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function SectionHeader({
  kicker,
  title,
  href,
}: {
  kicker?: string;
  title: string;
  href?: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {kicker && (
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-soft">
            {kicker}
          </p>
        )}
        <h2 className="font-display text-2xl font-bold tracking-tight text-snow md:text-3xl">
          {title}
        </h2>
      </div>
      {href && (
        <Link
          href={href}
          className="group hidden items-center gap-1 pb-1 text-sm text-mist transition-colors hover:text-snow sm:flex"
        >
          View all
          <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
