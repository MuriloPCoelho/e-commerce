"use client";

import { Button, buttonVariants } from "../ui/button";
import { Menu, ShoppingBag, X, User, LogOut } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import Bag from "./bag";

const Header = () => {
  const { data: session } = authClient.useSession();

  return (
    <header className="w-full flex items-center justify-between h-16 px-4 border-b">
      <div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="border-none [&>button]:hidden">
            <SheetHeader className="bg-black px-4 flex items-end relative h-16">
              <SheetTitle className="text-white">
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 left-4 hover:bg-zinc-800"
                  >
                    <X className="size-6 text-white" />
                  </Button>
                </SheetClose>
                {session?.user ? (
                  <div className="flex gap-1">
                    <Link
                      href="#"
                      className={buttonVariants({
                        variant: "link",
                        size: "xs",
                        className: "text-white",
                      })}
                    >
                      <User />
                      <span>Olá, {session.user.name}</span>
                    </Link>
                  </div>
                ) : (
                  <div className="flex">
                    <Link
                      href="/sign-in"
                      className={buttonVariants({
                        variant: "link",
                        size: "xs",
                        className: "text-white",
                      })}
                    >
                      Entrar
                    </Link>
                  </div>
                )}
              </SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
      <div>
        <Bag />
      </div>
    </header>
  );
};

export default Header;
