import { Skeleton, SkeletonGrid } from "@/components/ui/skeleton";

export default function SeasonalLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-24 md:px-8 md:pt-28">
      <Skeleton className="mb-2 h-3 w-32 rounded" />
      <Skeleton className="mb-8 h-11 w-72 rounded-xl" />
      <div className="mb-8 flex gap-3">
        <Skeleton className="h-11 w-36 rounded-full" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-11 w-24 rounded-full" />
        ))}
      </div>
      <SkeletonGrid count={18} />
    </div>
  );
}
