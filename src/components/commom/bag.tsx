"use client";

import { ShoppingBag, X } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import BagItem from "./bag-item";
import BagItemSkeleton from "./bag-item-skeleton";
import { getBag } from "@/actions/get-bag";
import { centsToReais } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { usePathname } from "next/navigation";

const Bag = () => {
  const [isOpen, setIsOpen] = useState(false);
  const path = usePathname();
  const { data: bag, isPending: bagIsPending } = useQuery({
    queryKey: ["bag"],
    queryFn: () => getBag(),
  });

  const totalItems =
    bag?.items
      .map((item) => {
        return item.quantity;
      })
      .reduce((acc, curr) => acc + curr, 0) ?? 0;


  useEffect(() => {
    setIsOpen(false);
  }, [path]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className="relative">
          <Button variant="ghost">
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
        <SheetHeader className="bg-black px-4 flex relative h-16">
          <SheetTitle className="text-white">
            <div className="flex">
              <Link
                href="/checkout"
                className={buttonVariants({
                  variant: "link",
                  size: "xs",
                  className: "text-white",
                })}
                title="Ir para sacola"
              >
                Sua sacola
              </Link>
            </div>
            <SheetClose asChild>
              <Button
                variant="ghost"
                className="absolute top-3 right-4 hover:bg-zinc-800"
              >
                <X className="size-6 text-white" />
              </Button>
            </SheetClose>
          </SheetTitle>
        </SheetHeader>
        <div className="h-full px-4 pt-4 relative flex flex-col gap-4">
          <div className="flex flex-col gap-3 overflow-y-auto grow mb-16">
            {bagIsPending && (
              <>
                <BagItemSkeleton />
                <BagItemSkeleton />
                <BagItemSkeleton />
              </>
            )}
            {bag?.items.map((item) => (
              <BagItem key={item.id} item={item} />
            ))}
          </div>
          <div className="flex flex-col gap-4 bg-white sticky bottom-0 w-full left-0 pb-8">
            <hr />
            <div className="flex justify-between">
              <span className="text-neutral-600">Subtotal:</span>
              <span className="font-semibold">
                {centsToReais(bag?.totalPriceInCents ?? 0)}
              </span>
            </div>
            <Link href="/checkout">
              <Button
                className="w-full"
                size="lg"
              >
                Finalizar Compra
              </Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Bag;
