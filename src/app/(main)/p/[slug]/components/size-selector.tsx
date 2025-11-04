"use client";
import { productVariantSizesTable, sizesTable } from "@/db/schema";
import Link from "next/link";
import { useSearchParams, useParams } from "next/navigation";
import { twJoin } from "tailwind-merge";
import { buttonVariants } from "@/components/ui/button";

interface SizeSelectorProps {
  sizes: (typeof productVariantSizesTable.$inferSelect & {
    size: typeof sizesTable.$inferSelect;
  })[];
}

const SizeSelector = ({ sizes }: SizeSelectorProps) => {
  const params = useParams();
  const searchParams = useSearchParams();
  const sizeParam = searchParams.get("size");

  return (
    <div className="flex gap-2">
      {sizes.map((size) => (
        <Link
          scroll={false}
          href={`/p/${params.slug}?size=${size.size.name}`}
          className={twJoin(
            "outline outline-neutral-300 w-12 h-8 rounded-xs flex items-center justify-center font-semibold text-sm",
            size.size.name === sizeParam && "bg-black text-white",
            size.stock <= 0 && "bg-neutral-100 text-neutral-400 relative"
          )}
          key={size.id}
        >
          {size.size.name}
          {size.stock <= 0 && <div className="w-14 absolute h-[1px] bg-neutral-300 -rotate-[33.69deg]"></div>}
        </Link>
      ))}
    </div>
  );
};

export default SizeSelector;
