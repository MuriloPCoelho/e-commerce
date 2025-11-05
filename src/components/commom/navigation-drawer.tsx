"use client";

import { Menu, User, X, ChevronRight, ChevronLeft } from "lucide-react";
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
import { useState } from "react";
import { cn } from "@/lib/utils";
import { MenuItem } from "@/actions/get-menus";

interface NavigationDrawerItemProps {
  item: MenuItem;
  onNavigateToSubmenu: (item: MenuItem) => void;
}

const NavigationDrawerItem = ({
  item,
  onNavigateToSubmenu,
}: NavigationDrawerItemProps) => {
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      onNavigateToSubmenu(item);
    }
  };

  const content = (
    <>
      <div className="flex items-center gap-3">
        <span>{item.name}</span>
      </div>
      {hasChildren && <ChevronRight className="size-5" />}
    </>
  );

  return (
    <div className="w-full">
      {hasChildren ? (
        <button
          onClick={handleClick}
          className={cn(
            "flex items-center justify-between w-full p-4 text-xl hover:bg-zinc-100 transition-colors text-left",
            !item.isActive && "opacity-50 pointer-events-none"
          )}
        >
          {content}
        </button>
      ) : (
        <SheetClose asChild>
          <Link
            href={item.href}
            className={cn(
              "flex items-center justify-between w-full p-4 text-xl hover:bg-zinc-100 transition-colors",
              !item.isActive && "opacity-50 pointer-events-none"
            )}
          >
            {content}
          </Link>
        </SheetClose>
      )}
    </div>
  );
};

interface NavigationDrawerProps {
  menus?: MenuItem[];
}

const NavigationDrawer = ({ menus = [] }: NavigationDrawerProps) => {
  const { data: session } = authClient.useSession();
  const [menuStack, setMenuStack] = useState<MenuItem[]>([]);

  const currentMenu = menuStack[menuStack.length - 1] || null;

  const handleNavigateToSubmenu = (item: MenuItem) => {
    setMenuStack([...menuStack, item]);
  };

  const handleBack = () => {
    setMenuStack(menuStack.slice(0, -1));
  };

  const handleSheetOpenChange = (open: boolean) => {
    if (!open) {
      setMenuStack([]);
    }
  };

  return (
    <Sheet onOpenChange={handleSheetOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost">
          <Menu className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="border-none [&>button]:hidden w-[90%] p-0 overflow-y-auto gap-0"
      >
        <SheetHeader className="bg-black px-4 flex items-end relative h-16">
          <SheetTitle className="text-white">
            <SheetClose asChild>
              <Button
                variant="ghost"
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
                  <span>Hello, {session.user.name}</span>
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
                  Sign in
                </Link>
              </div>
            )}
          </SheetTitle>
        </SheetHeader>

        {currentMenu ? (
          <div className="flex flex-col w-full">
            <div>
              <button
                onClick={handleBack}
                className="flex items-center gap-3 w-full px-4 py-4 text-sm hover:bg-zinc-100 transition-colors"
              >
                <ChevronLeft className="size-4" />
                <span className="font-medium">Back</span>
              </button>
            </div>
            <div className="px-4 py-4 bg-white border-b">
              <h2 className="text-xl font-semibold">{currentMenu.name}</h2>
            </div>
            <nav className="flex flex-col w-full">
              {currentMenu.children?.map((submenu) => {
                const hasChildren = submenu.children && submenu.children.length > 0;
                
                return (
                  <div key={submenu.id}>
                    {hasChildren ? (
                      <button
                        onClick={() => handleNavigateToSubmenu(submenu)}
                        className="flex items-center justify-between w-full px-4 py-3 hover:bg-zinc-100 transition-colors text-neutral-600"
                      >
                        <span>{submenu.name}</span>
                        <ChevronRight className="size-5" />
                      </button>
                    ) : (
                      <SheetClose asChild>
                        <Link
                          href={submenu.href}
                          className="flex items-center justify-between w-full px-4 py-3 hover:bg-zinc-100 transition-colors text-neutral-600"
                        >
                          <span>{submenu.name}</span>
                        </Link>
                      </SheetClose>
                    )}
                  </div>
                );
              })}
              {currentMenu.children && currentMenu.children.length > 0 && (
                <div className="px-4 py-3">
                  <SheetClose asChild>
                    <Link
                      href={currentMenu.href}
                      className="text-black underline hover:no-underline transition-all underline-offset-3"
                    >
                      View all
                    </Link>
                  </SheetClose>
                </div>
              )}
            </nav>
          </div>
        ) : (
          <nav className="flex flex-col w-full">
            {menus.map((menu) => (
              <NavigationDrawerItem
                key={menu.id}
                item={menu}
                onNavigateToSubmenu={handleNavigateToSubmenu}
              />
            ))}
          </nav>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default NavigationDrawer;
