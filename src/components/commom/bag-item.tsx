"use client";

import Image from "next/image";
import { centsToReais } from "@/lib/utils";
import Link from "next/link";
import {
  bagItemsTable,
  productsTable,
  productVariantSizesTable,
  productVariantsTable,
  sizesTable,
} from "@/db/schema";
import { removeBagProduct } from "@/actions/remove-bag-product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useBagContext } from "@/providers/bag-provider";
import { twMerge } from "tailwind-merge";
import QuantitySelector from "./quantity-selector";

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
  className?: string;
}

const BagItem = ({ item, className }: BagItemProps) => {
  const queryClient = useQueryClient();
  const { removeItem: removeFromBag, updateQuantity } = useBagContext();
  const isLocalItem =
    typeof item.id === "string" && item.id.startsWith("local-");

  const { mutate: removeDbItem, isPending: isRemoving } = useMutation({
    mutationKey: ["removeBagProduct", item.id],
    mutationFn: async () => removeBagProduct(item.id as string),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["bag"] });
    },
    onError: (err) => toast.error((err as Error).message),
  });

  const handleRemove = async () => {
    if (isLocalItem && item.productVariantSize) {
      await removeFromBag(item.productVariantSizeId);
    } else {
      removeDbItem();
    }
  };

  const handleQuantityChange = async (newQuantity: number) => {
    if (!item.productVariantSize) return;
    
    await updateQuantity(item.productVariantSizeId, newQuantity);
  };

  if (!item.productVariantSize) return null;

  return (
    <div
      className={twMerge(
        "grid grid-cols-[72px_1fr] gap-2 pr-2 mx-3 first:mt-3",
        className
      )}
    >
      <div className="relative">
        <div className="aspect-square relative rounded-xs">
          <Image
            src={item.productVariantSize.variant.imageUrl}
            alt={item.productVariantSize.variant.product.name}
            fill
            className="object-top rounded"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 grid-rows-[auto_auto_1fr] text-xs">
        <div className="font-semibold truncate text-ellipsis col-span-2 flex justify-between">
          <Link
            href={`/p/${item.productVariantSize.variant.slug}`}
            className="hover:underline underline-offset-2 mb-1"
          >
            {item.productVariantSize.variant.product.name}
          </Link>
        </div>
        <div className="text-neutral-600 text-xs font-light col-span-2">
          <div className="flex gap-1.5">
            <div>
              Size:
              <span className="font-medium ml-1">
                {item.productVariantSize.size.name}
              </span>
            </div>
            |
            <div>
              Color:
              <span className="font-medium ml-1">
                {item.productVariantSize.variant.name}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-end justify-between col-span-2">
          <div className="flex items-center">
            <QuantitySelector
              value={item.quantity}
              max={item.productVariantSize.stock}
              onChange={handleQuantityChange}
              onRemove={handleRemove}
              disabled={isRemoving}
            />
          </div>
          <div className="font-bold">
            {centsToReais(
              item.productVariantSize.variant.priceInCents * item.quantity
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BagItem;
