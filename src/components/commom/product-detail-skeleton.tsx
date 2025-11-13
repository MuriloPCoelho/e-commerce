import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailSkeleton() {
  return (
    <div className="flex flex-col">
      {/* Product Image */}
      <Skeleton className="aspect-square mb-8" />

      <div className="p-4 space-y-4">
        {/* Product Title */}
        <Skeleton className="h-8 w-3/4" />
        {/* Rating */}
        <Skeleton className="h-6 w-32" />
        {/* Price */}
        <Skeleton className="h-10 w-32 mt-4" />
        {/* Installment */}
        <Skeleton className="h-4 w-40" />
      </div>

      {/* Color Section */}
      <div className="p-4">
        <Skeleton className="h-5 w-24 mb-3" />
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-12 rounded-full" />
          ))}
        </div>
      </div>

      {/* Size Section */}
      <div className="p-4">
        <Skeleton className="h-5 w-32 mb-3" />
        <div className="flex gap-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-16 rounded" />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-4 p-4">
        <Skeleton className="h-12 w-full rounded" />
        <Skeleton className="h-12 w-full rounded" />
        <div className="flex gap-4 justify-center">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="p-4 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border-b pb-4">
            <Skeleton className="h-6 w-48" />
          </div>
        ))}
      </div>
    </div>
  );
}
