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
import { getBag } from "@/actions/get-bag";
import Image from "next/image";
import QuantitySelector from "./quantity-selector";

const Bag = () => {
  const { data: bag, isPending: bagIsPending } = useQuery({
    queryKey: ["bag"],
    queryFn: () => getBag(),
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <ShoppingBag className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="border-none [&>button]:hidden">
        <SheetHeader className="bg-black px-4 flex relative h-16">
          <SheetTitle className="text-white">
            <div className="flex">
              <Link
                href="#"
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
                size="icon"
                variant="ghost"
                className="absolute top-3 right-4 hover:bg-zinc-800"
              >
                <X className="size-6 text-white" />
              </Button>
            </SheetClose>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-2">
          {bagIsPending && <div>Loading...</div>}
          {bag?.items.map((item) => (
            <div className="grid grid-cols-[96px_1fr] gap-2 px-4" key={item.id}>
              <div className="aspect-square relative rounded-xs">
                <Image
                  src={item.productVariantSize?.variant.imageUrl ?? ""}
                  alt={item.productVariantSize?.variant.name ?? ""}
                  fill
                  className="object-cover object-top rounded-xs te"
                />
              </div>
              <div className="grid">
                <div className="text-sm font-medium truncate text-ellipsis">{`${item.productVariantSize?.variant.product.name} - ${item.productVariantSize?.variant.name}`}</div>
                <div className="text-neutral-600 text-xs">
                  Tamanho: {item.productVariantSize?.size.name}
                </div>
                <div>
                  <QuantitySelector />
                </div>
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Bag;
