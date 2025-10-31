import { Skeleton } from "../ui/skeleton";

const BagItemSkeleton = () => {
  return (
    <div className="grid grid-cols-[96px_1fr] gap-2 pr-2">
      <Skeleton className="aspect-square rounded-xs" />

      <div className="grid grid-cols-2 grid-rows-[auto_auto_1fr] text-xs py-0.5">
        <div className="col-span-2 mb-1">
          <Skeleton className="h-4 w-full max-w-[200px]" />
        </div>

        <div className="col-span-2 space-y-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>

        <div className="flex items-end justify-between col-span-2 mt-1">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
};

export default BagItemSkeleton;
