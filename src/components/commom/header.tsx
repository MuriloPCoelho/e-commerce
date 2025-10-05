"use client";

import { Button } from "../ui/button";
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

const Header = () => {
  const { data: session } = authClient.useSession();

  return (
    <header className="w-full flex items-center justify-between py-2 px-4 border-b">
      <div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="border-none [&>button]:hidden">
            <SheetHeader className="bg-black p-4 flex items-end relative">
              <SheetTitle className="text-white py-3">
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 left-4 hover:bg-zinc-800"
                  >
                    <X className="size-5 text-white" />
                  </Button>
                </SheetClose>
                {session?.user ? (
                  <div className="flex gap-1">
                    <Link
                      href="#"
                      className="font-semibold flex gap-2 items-center hover:bg-zinc-800 rounded-full pl-3 pr-4 transition-colors"
                    >
                      <User />
                      <span>Olá, {session.user.name}</span>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Sair"
                      className="hover:bg-zinc-800 hover:text-white"
                      onClick={() => authClient.signOut()}
                    >
                      <LogOut />
                    </Button>
                  </div>
                ) : (
                  <div className="flex">
                    <Link
                      href="sign-in"
                      className="font-semibold flex gap-2 items-center hover:bg-zinc-800 rounded-full py-1.5 px-4 transition-colors"
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
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <ShoppingBag className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Sacola</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
