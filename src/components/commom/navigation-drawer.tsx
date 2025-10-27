import { Menu, User, X } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const NavigationDrawer = () => {
  const { data: session } = authClient.useSession();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="border-none [&>button]:hidden w-[90%]"
      >
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
  );
};

export default NavigationDrawer;
