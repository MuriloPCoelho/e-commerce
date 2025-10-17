"use client";
import { productVariantsTable } from "@/db/schema";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { twJoin } from "tailwind-merge";

interface VariantSelectorProps {
  variants: (typeof productVariantsTable.$inferSelect)[];
}

const VariantSelector = ({ variants }: VariantSelectorProps) => {
  const params = useParams();
  const currentVariantSlug = params.slug;
  
  return (
    <div className="flex gap-1.5 w-full flex-wrap">
      {variants.map((variant) => (
        <Link
          scroll={false}
          href={`/p/${variant.slug}`}
          className={twJoin(
            "outline outline-neutral-300 size-12 aspect-square relative ",
            currentVariantSlug === variant.slug && "ring-2 ring-amber-400"
          )}
          key={variant.id}
        >
          <Image src={variant.imageUrl} alt={variant.name} fill className="object-cover" />
        </Link>
      ))}
    </div>
  );
};

export default VariantSelector;
