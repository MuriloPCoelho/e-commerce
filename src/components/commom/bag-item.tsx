import Image from "next/image";
import QuantitySelector from "./quantity-selector";
import { centsToReais } from "@/lib/utils";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import colors from "tailwindcss/colors";
import Link from "next/link";
import {
  bagItemsTable,
  productsTable,
  productVariantSizesTable,
  productVariantsTable,
  sizesTable,
} from "@/db/schema";

interface BagItemProps {
  item: typeof bagItemsTable.$inferSelect & {
    productVariantSize:
      | (typeof productVariantSizesTable.$inferSelect & {
          variant: typeof productVariantsTable.$inferSelect & {
            product: typeof productsTable.$inferSelect;
          };
          size: typeof sizesTable.$inferSelect;
        })
      | null;
  };
}

const BagItem = ({ item }: BagItemProps) => {
  if (!item.productVariantSize) {
    return null;
  }

  return (
    <div className="grid grid-cols-[80px_1fr] gap-2 px-4">
      <div className="aspect-square relative rounded-xs">
        <Image
          src={item.productVariantSize.variant.imageUrl}
          alt={item.productVariantSize.variant.product.name}
          fill
          className="object-top rounded-xs te"
        />
      </div>
      <div className="grid grid-cols-2 grid-rows-[auto_auto_1fr] text-xs">
        <div className="font-medium truncate text-ellipsis col-span-2 flex justify-between">
          <Link
            href={`/p/${item.productVariantSize.variant.product.id}`}
            className="hover:underline"
          >{`${item.productVariantSize.variant.product.name} - ${item.productVariantSize.variant.name}`}</Link>
          <Button variant="ghost" size="xs" className="w-7">
            <Trash size={16} color={colors.red[600]} />
          </Button>
        </div>
        <div className="text-neutral-600 text-xs col-span-2 ">
          Tamanho: {item.productVariantSize.variant.name}
        </div>
        <div className="content-center">
          <div className="font-semibold">
            {centsToReais(item.productVariantSize.variant.priceInCents)}
          </div>
        </div>
        {/* <div className="place-self-end">
          <QuantitySelector />
        </div> */}
      </div>
    </div>
  );
};

export default BagItem;
