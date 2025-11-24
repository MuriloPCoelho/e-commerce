import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-4 space-y-6">
      <Skeleton className="h-10 w-48" />
      
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-12 w-full rounded" />
        <Skeleton className="h-12 w-full rounded" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-12 w-full rounded" />
          <Skeleton className="h-12 w-full rounded" />
        </div>
      </div>
      
      <div className="space-y-4 mt-8">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-12 w-full rounded" />
        <Skeleton className="h-12 w-full rounded" />
      </div>
      
      <div className="space-y-3 mt-8 p-4 border rounded">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-8 w-full mt-4" />
      </div>
      
      <Skeleton className="h-12 w-full rounded mt-6" />
    </div>
  );
}
