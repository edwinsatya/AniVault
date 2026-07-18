import { Skeleton, SkeletonGrid } from "@/components/ui/skeleton";

export default function DiscoverLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-24 md:px-8 md:pt-28">
      <Skeleton className="mb-2 h-3 w-32 rounded" />
      <Skeleton className="mb-3 h-11 w-64 rounded-xl" />
      <Skeleton className="mb-8 h-4 w-40 rounded" />
      <div className="mb-8 flex gap-3">
        <Skeleton className="h-11 w-28 rounded-full" />
        <Skeleton className="ml-auto h-11 w-40 rounded-lg" />
      </div>
      <SkeletonGrid count={18} />
    </div>
  );
}
