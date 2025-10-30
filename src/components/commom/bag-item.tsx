"use client";

import Image from "next/image";
import { centsToReais } from "@/lib/utils";
import { Button } from "../ui/button";
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
import { Spinner } from "../ui/spinner";

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
  const queryClient = useQueryClient();

  const { mutate: removeItem, isPending } = useMutation({
    mutationKey: ["removeBagProduct", item.id],
    mutationFn: async () => {
      return removeBagProduct(item.id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["bag"] });
    },
    onError: (err) => {
      console.error("Failed to remove item from bag", err);
    },
  });

  if (!item.productVariantSize) {
    return null;
  }

  return (
    <div className="grid grid-cols-[80px_1fr] gap-2 pr-2">
      <div className="aspect-square relative rounded-xs">
        <Image
          src={item.productVariantSize.variant.imageUrl}
          alt={item.productVariantSize.variant.product.name}
          fill
          className="object-top rounded-xs te"
        />
      </div>
      <div className="grid grid-cols-2 grid-rows-[auto_auto_1fr] text-xs py-0.5">
        <div className="font-semibold truncate text-ellipsis col-span-2 flex justify-between">
          <Link
            href={`/p/${item.productVariantSize.variant.slug}`}
            className="hover:underline underline-offset-2 mb-1"
          >
            <span className="text-neutral-400">{`${item.quantity > 1 ? `${item.quantity}x ` : ""}`}</span>
            {`${item.productVariantSize.variant.product.name} - ${item.productVariantSize.variant.name}`}</Link>
        </div>
        <div className="text-neutral-600 text-xs col-span-2 ">
          Tamanho: {item.productVariantSize.size.name}
        </div>
        <div className="flex items-end justify-between col-span-2">
          <div className="font-bold">
            {centsToReais(item.productVariantSize.variant.priceInCents * item.quantity)}
          </div>
          <Button 
            variant="link" 
            size="xs" 
            className="underline h-4" 
            onClick={() => removeItem()}
            disabled={isPending}
          >
            {isPending ? <Spinner className="size-3" /> : "Remover"}
          </Button>

        </div>
        {/* <div className="place-self-end">
          <QuantitySelector />
        </div> */}
      </div>
    </div>
  );
};

export default BagItem;
