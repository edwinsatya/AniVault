import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("shimmer rounded-xl", className)} />;
}

export function SkeletonCard() {
  return (
    <div className="space-y-2.5">
      <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
      <Skeleton className="h-3.5 w-4/5 rounded" />
      <Skeleton className="h-3 w-2/5 rounded" />
    </div>
  );
}

export function SkeletonRail() {
  return (
    <div className="no-scrollbar -mx-4 flex gap-4 overflow-hidden px-4 md:mx-0 md:px-0">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="w-36 shrink-0 sm:w-40 lg:w-44">
          <SkeletonCard />
        </div>
      ))}
    </div>
  );
}

export function SkeletonGrid({ count = 18 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
