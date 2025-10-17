"use client";
import {
  productVariantSizesTable,
  sizesTable,
} from "@/db/schema";
import Link from "next/link";
import { useSearchParams, useParams } from "next/navigation";
import { twJoin } from "tailwind-merge";

interface SizeSelectorProps {
  sizes: (typeof productVariantSizesTable.$inferSelect & {
    size: typeof sizesTable.$inferSelect;
  })[];
}

const SizeSelector = ({ sizes }: SizeSelectorProps) => {
  const params = useParams();
  const searchParams = useSearchParams();
  const sizeParam = searchParams.get("size");

  console.log({ params, sizeParam });

  return (
    <div className="flex gap-2">
      {sizes.map((size) => (
        <Link
          scroll={false}
          href={`/p/${params.slug}?size=${size.size.name}`}
          className={twJoin(
            "outline outline-neutral-300 size-12 aspect-square flex items-center justify-center",
            size.size.name === sizeParam && "ring-2 ring-amber-400"
          )}
          key={size.id}
        >
          {size.size.name}
        </Link>
      ))}
    </div>
  );
};

export default SizeSelector;
