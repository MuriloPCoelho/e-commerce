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
import { getBag } from "@/actions/get-bag";

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
      <SheetContent side="right" className="border-none [&>button]:hidden w-[90%]">
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
        <div className="flex flex-col gap-3">
          {bagIsPending && <div>Loading...</div>}
          {bag?.items.map((item) => (
            <BagItem
              key={item.id}
              item={item}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Bag;
