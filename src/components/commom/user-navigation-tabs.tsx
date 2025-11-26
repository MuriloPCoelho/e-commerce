"use client";

import { usePathname, useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import {
  CreditCard,
  Heart,
  MapPin,
  Package,
  RefreshCcw,
  Star,
} from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const menuItems = [
  {
    value: "orders",
    href: "/user/orders",
    label: "Orders",
    icon: Package,
  },
  {
    value: "favorites",
    href: "/user/favorites",
    label: "Favorites",
    icon: Heart,
  },
  {
    value: "adresses",
    href: "/user/adresses",
    label: "Addresses",
    icon: MapPin,
  },
  {
    value: "cards",
    href: "/user/cards",
    label: "Cards",
    icon: CreditCard,
  },
  {
    value: "rma",
    href: "/user/rma",
    label: "Returns",
    icon: RefreshCcw,
  },
  {
    value: "preferences",
    href: "/user/preferences",
    label: "Preferences",
    icon: Star,
  },
];

export function UserNavigationTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const activeTab =
    menuItems.find((item) => pathname.startsWith(item.href))?.value || "orders";

  const handleTabChange = (value: string) => {
    const item = menuItems.find((item) => item.value === value);
    if (item) {
      router.push(item.href);
    }
  };

  const checkScroll = () => {
    const element = scrollContainerRef.current;
    if (element) {
      setCanScrollLeft(element.scrollLeft > 10);
      setCanScrollRight(
        element.scrollLeft < element.scrollWidth - element.clientWidth - 10
      );
    }
  };

  const scrollToActiveTab = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const activeIndex = menuItems.findIndex((item) => item.value === activeTab);
    if (activeIndex === -1) return;

    const tabElements = container.querySelectorAll('[role="tab"]');
    const activeElement = tabElements[activeIndex] as HTMLElement;

    if (activeElement) {
      const containerWidth = container.clientWidth;
      const elementLeft = activeElement.offsetLeft;
      const elementWidth = activeElement.offsetWidth;

      const scrollPosition =
        elementLeft - containerWidth / 2 + elementWidth / 2;

      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    checkScroll();
    const element = scrollContainerRef.current;
    if (element) {
      element.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);

      setTimeout(() => {
        scrollToActiveTab();
        checkScroll();
      }, 100);

      return () => {
        element.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [activeTab]);

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <div className="relative -mx-4 px-4 md:mx-0 md:px-0">
        {canScrollLeft && (
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-background via-background/60 to-transparent md:hidden" />
        )}

        {canScrollRight && (
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-background via-background/60 to-transparent md:hidden" />
        )}

        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide scroll-smooth md:overflow-visible"
          style={{
            scrollSnapType: "x proximity",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <TabsList className="mb-4 h-auto gap-2 rounded-none border-b bg-transparent py-1 text-foreground w-max justify-start min-w-full md:min-w-0 px-4 md:px-0">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent px-4 py-2.5 md:px-3 md:py-2 whitespace-nowrap"
                  style={{ scrollSnapAlign: "center" }}
                >
                  <Icon
                    className="-ms-0.5 me-1.5 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  {item.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>
      </div>
    </Tabs>
  );
}
