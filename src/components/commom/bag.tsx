"use client";

import { ShoppingBag, X } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import BagItem from "./bag-item";
import BagItemSkeleton from "./bag-item-skeleton";
import { centsToReais } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { usePathname } from "next/navigation";
import { useBagContext } from "@/providers/bag-provider";
import { useQuery } from "@tanstack/react-query";
import { getMultipleProductVariantSizeDetails } from "@/actions/get-product-variant-size-details";
import FreeShippingProgress from "./free-shipping-progress";

const Bag = () => {
  const [isOpen, setIsOpen] = useState(false);
  const path = usePathname();
  const {
    bag,
    localBag,
    totalItems,
    totalPriceInCents,
    isPending,
    isAuthenticated,
  } = useBagContext();

  const { data: localBagDetails, isPending: localBagPending } = useQuery({
    queryKey: [
      "localBagDetails",
      localBag.items.map((i) => i.productVariantSizeId).join(","),
    ],
    queryFn: async () => {
      if (localBag.items.length === 0) return [];
      const ids = localBag.items.map((item) => item.productVariantSizeId);
      const details = await getMultipleProductVariantSizeDetails(ids);

      return localBag.items
        .map((localItem) => {
          const detail = details.find(
            (d) => d?.id === localItem.productVariantSizeId
          );
          if (!detail) return null;

          return {
            id: `local-${localItem.productVariantSizeId}`,
            bagId: "local",
            productVariantSizeId: localItem.productVariantSizeId,
            quantity: localItem.quantity,
            createdAt: new Date(),
            productVariantSize: detail,
          };
        })
        .filter(Boolean);
    },
    enabled: !isAuthenticated && localBag.items.length > 0,
  });

  const localBagTotalPrice =
    localBagDetails?.reduce((total, item: any) => {
      const priceInCents = item?.productVariantSize?.variant?.priceInCents ?? 0;
      return total + priceInCents * item.quantity;
    }, 0) ?? 0;

  const isLoading = isAuthenticated
    ? isPending
    : localBagPending && localBag.items.length > 0;

  const itemsToDisplay = isAuthenticated ? bag?.items : localBagDetails;

  const subtotal = isAuthenticated ? totalPriceInCents : localBagTotalPrice;

  useEffect(() => {
    setIsOpen(false);
  }, [path]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className="relative">
          <Button variant="ghost" title="Open shopping bag">
            <ShoppingBag className="size-6" />
          </Button>
          {totalItems > 0 && (
            <Badge className="size-4 p-0 absolute top-0 right-0 bg-amber-400 text-black font-semibold">
              {totalItems}
            </Badge>
          )}
        </div>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="border-none [&>button]:hidden w-[90%] gap-0"
      >
        <SheetHeader className="bg-black px-4 flex justify-center relative min-h-[var(--header-height)]">
          <SheetTitle className="text-white">
            <div className="flex">
              <Link
                href="/checkout"
                className={buttonVariants({
                  variant: "link",
                  size: "xs",
                  className: "text-white",
                })}
                title="Go to bag"
              >
                Your Bag
              </Link>
            </div>
            <SheetClose asChild>
              <Button
                variant="ghost"
                className="absolute top-3 right-4 hover:bg-zinc-800"
                title="Close"
              >
                <X className="size-6 text-white" />
              </Button>
            </SheetClose>
          </SheetTitle>
        </SheetHeader>
        <div className="h-full relative flex flex-col gap-4">
          <div className="flex flex-col gap-3 overflow-y-auto grow mb-16">
            {isLoading && (
              <>
                <BagItemSkeleton />
                <BagItemSkeleton />
                <BagItemSkeleton />
              </>
            )}

            {!isLoading && totalItems === 0 && (
              <p className="text-center text-neutral-500 mt-8">
                Your bag is empty.
              </p>
            )}

            {!isLoading &&
              itemsToDisplay?.map((item: any) => (
                <BagItem key={item.id} item={item} />
              ))}
          </div>
          <SheetFooter className="p-3">
            <div className="bg-neutral-100 rounded px-2 py-3">
              <FreeShippingProgress subtotal={subtotal} />
            </div>
            <div className="flex flex-col gap-4 bg-white sticky bottom-0 w-full left-0 pb-4">
              <hr />
              {bag && bag.items.length > 0 ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Subtotal:</span>
                    <span className="font-semibold">
                      {centsToReais(subtotal)}
                    </span>
                  </div>
                  <div className="flex flex-col justify-center gap-2">
                    <Link
                      href="/checkout"
                      className={buttonVariants({
                        className: "w-full",
                        size: "sm",
                      })}
                    >
                      Checkout
                    </Link>
                    <SheetClose asChild>
                      <Button variant="link" className="underline" size="sm">
                        Continue Shopping
                      </Button>
                    </SheetClose>
                  </div>
                </>
              ) : (
                <SheetClose asChild>
                  <Button className="w-full">Continue Shopping</Button>
                </SheetClose>
              )}
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Bag;
