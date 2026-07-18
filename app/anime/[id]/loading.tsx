import { Skeleton } from "@/components/ui/skeleton";

export default function AnimeLoading() {
  return (
    <div>
      <div className="shimmer h-[46svh] min-h-[320px] w-full md:h-[62svh]" />
      <div className="relative z-10 mx-auto -mt-24 max-w-7xl px-4 md:-mt-36 md:px-8">
        <div className="flex items-end gap-4 md:gap-8">
          <Skeleton className="aspect-[2/3] w-28 rounded-xl sm:w-36 md:w-52 md:rounded-2xl" />
          <div className="flex-1 space-y-3 pb-2">
            <Skeleton className="h-10 w-3/4 max-w-lg rounded-lg" />
            <Skeleton className="h-4 w-48 rounded" />
            <div className="hidden gap-2 sm:flex">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-7 w-20 rounded-full" />
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <Skeleton className="h-12 w-44 rounded-full" />
          <Skeleton className="h-12 w-32 rounded-full" />
        </div>
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-3">
            <Skeleton className="h-3 w-24 rounded" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full max-w-2xl rounded" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
