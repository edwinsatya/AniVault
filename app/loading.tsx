import { Skeleton, SkeletonRail } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div>
      <div className="relative h-[72svh] min-h-[480px] w-full overflow-hidden md:h-[84svh]">
        <div className="shimmer absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-abyss to-transparent" />
        <div className="absolute inset-x-0 bottom-14 mx-auto max-w-7xl space-y-4 px-4 md:bottom-20 md:px-8">
          <Skeleton className="h-3 w-40 rounded" />
          <Skeleton className="h-14 w-3/4 max-w-xl rounded-xl" />
          <Skeleton className="h-4 w-64 rounded" />
          <div className="flex gap-3 pt-3">
            <Skeleton className="h-12 w-44 rounded-full" />
            <Skeleton className="h-12 w-36 rounded-full" />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl space-y-16 px-4 pb-24 pt-4 md:px-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="mb-2 h-3 w-32 rounded" />
            <Skeleton className="mb-5 h-8 w-56 rounded-lg" />
            <SkeletonRail />
          </div>
        ))}
      </div>
    </div>
  );
}
