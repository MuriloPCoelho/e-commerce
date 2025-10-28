import { Skeleton } from "../ui/skeleton";

const BagItemSkeleton = () => {
  return (
    <div className="grid grid-cols-[80px_1fr] gap-2">
      {/* Image skeleton */}
      <Skeleton className="aspect-square rounded-xs" />
      
      {/* Content skeleton */}
      <div className="grid grid-cols-2 grid-rows-[auto_auto_1fr] text-xs gap-2">
        {/* Product name and delete button */}
        <div className="col-span-2 flex justify-between items-start">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-7 w-7" />
        </div>
        
        {/* Size */}
        <div className="col-span-2">
          <Skeleton className="h-3 w-20" />
        </div>
        
        {/* Price */}
        <div className="content-center">
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
    </div>
  );
};

export default BagItemSkeleton;
