"use server";

import { db } from "@/db";
import { menusTable } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export interface MenuItem {
  id: number;
  name: string;
  slug: string;
  href: string;
  children?: MenuItem[];
  isActive: boolean;
}

export async function getMenus(): Promise<MenuItem[]> {
  try {
    const allMenus = await db.query.menusTable.findMany({
      where: eq(menusTable.isActive, true),
      with: {
        category: true,
        brand: true,
        collection: true,
      },
      orderBy: [asc(menusTable.order)],
    });

    const buildHref = (menu: typeof allMenus[0]): string => {
      switch (menu.type) {
        case "category":
          return menu.category ? `/w/${menu.category.slug}` : "#";
        case "brand":
          return menu.brand ? `/b/${menu.brand.slug}` : "#";
        case "collection":
          return menu.collection ? `/c/${menu.collection.slug}` : "#";
        case "custom":
        default:
          return menu.href || "#";
      }
    };

    const mainMenus = allMenus.filter((menu) => !menu.parentId);
    const subMenus = allMenus.filter((menu) => menu.parentId);

    const buildMenuTree = (parentId: number | null): MenuItem[] => {
      const menus =
        parentId === null
          ? mainMenus
          : subMenus.filter((m) => m.parentId === parentId);

      return menus.map((menu) => ({
        id: menu.id,
        name: menu.name,
        slug: menu.slug,
        href: buildHref(menu),
        isActive: menu.isActive,
        children: buildMenuTree(menu.id),
      }));
    };

    return buildMenuTree(null);
  } catch (error) {
    console.error("Error fetching menus:", error);
    return [];
  }
}
