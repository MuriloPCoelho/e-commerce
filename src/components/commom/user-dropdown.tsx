"use client";

import { User, Package, Heart, MapPin, CreditCard, RefreshCcw, Star, LogOut, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";

const userMenuItems = [
  {
    href: "/user",
    label: "Account",
    icon: UserCircle,
  },
  {
    href: "/user/orders",
    label: "Orders",
    icon: Package,
  },
  {
    href: "/user/favorites",
    label: "Favorites",
    icon: Heart,
  },
  {
    href: "/user/addresses",
    label: "Addresses",
    icon: MapPin,
  },
  {
    href: "/user/cards",
    label: "Cards",
    icon: CreditCard,
  },
  {
    href: "/user/rma",
    label: "Returns",
    icon: RefreshCcw,
  },
  {
    href: "/user/preferences",
    label: "Preferences",
    icon: Star,
  },
];

export function UserDropdown() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleNavigate = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  if (isDesktop) {
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" title="User account">
            <User className="size-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-48" align="end">
          {userMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <DropdownMenuItem
                key={item.href}
                onClick={() => handleNavigate(item.href)}
              >
                <Icon size={16} className="opacity-60" aria-hidden="true" />
                <span>{item.label}</span>
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    window.location.href = "/";
                  },
                },
              });
            }}
            className="text-red-600 focus:text-red-600"
          >
            <LogOut size={16} className="opacity-60" aria-hidden="true" />
            <span>Sair da conta</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" title="User account">
          <User className="size-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>My Account</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-8">
          {userMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                onClick={() => handleNavigate(item.href)}
                className="flex items-center gap-3 w-full px-4 py-3 hover:bg-accent rounded-md transition-colors"
              >
                <Icon size={20} className="opacity-60" aria-hidden="true" />
                <span className="text-base">{item.label}</span>
              </button>
            );
          })}
          <div className="border-t mt-2 pt-2">
            <button
              onClick={() => {
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      window.location.href = "/";
                    },
                  },
                });
              }}
              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-accent rounded-md transition-colors text-red-600"
            >
              <LogOut size={20} className="opacity-60" aria-hidden="true" />
              <span className="text-base">Sair da conta</span>
            </button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
