import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <div className="flex flex-col">
      <Skeleton className="aspect-square mb-8" />

      <div className="p-4 space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-32 mt-4" />

        <div className="space-y-2 mt-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <div className="mt-6 space-y-3">
          <Skeleton className="h-5 w-24" />
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-12 rounded-full" />
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <Skeleton className="h-5 w-32" />
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-16 rounded" />
            ))}
          </div>
        </div>

        <Skeleton className="h-12 w-full mt-8 rounded" />

        <div className="flex gap-2 mt-4">
          <Skeleton className="h-12 flex-1 rounded" />
          <Skeleton className="h-12 flex-1 rounded" />
        </div>

        <div className="mt-8 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border-b pb-4">
              <Skeleton className="h-6 w-48" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
