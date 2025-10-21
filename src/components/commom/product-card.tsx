import { colorsTable, productsTable, productVariantsTable } from "@/db/schema";
import { centsToReais, cn } from "@/lib/utils";
import Link from "next/link";

import ProductRating from "./product-rating";
import Image from "next/image";

interface ProductCardProps {
  product: typeof productsTable.$inferSelect & {
    variants: (typeof productVariantsTable.$inferSelect & {
      color: typeof colorsTable.$inferSelect;
    })[];
  };

  textContainerClassName?: string;
}

const ProductCard = ({ product, textContainerClassName }: ProductCardProps) => {
  const firstVariant = product.variants[0];  

  return (
    <Link href={`/p/${firstVariant.slug}`} className="group flex flex-col gap-2">
      <div className="overflow-hidden rounded-xs relative aspect-square">
        <Image
          src={firstVariant.imageUrl}
          alt={firstVariant.name}
          fill
          className="rounded-xs object-cover group-hover:scale-110 transition-transform"
        />
      </div>
      <div
        className={cn(
          "flex max-w-[200px] flex-col gap-1",
          textContainerClassName
        )}
      >
        <span className="font-medium">{product.name}</span>
        <ProductRating rating={3.5}/>
        <div className="flex flex-col">
          <div className="text-sm text-neutral-600 leading-4">A partir de</div>
          <span className="font-semibold">
            {centsToReais(firstVariant.priceInCents)}
          </span>
        </div>
        <div className="flex gap-1.5">
          {product.variants.map((variant) => (
            <span
              key={variant.id}
              className="size-4 aspect-square rounded-md ring-1 ring-neutral-300"
              style={{ backgroundColor: variant.color?.hex ?? "transparent" }}
            />
          ))}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
