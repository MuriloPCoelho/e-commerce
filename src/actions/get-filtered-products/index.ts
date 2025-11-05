"use server";

import { db } from "@/db";
import {
  productsTable,
  categoriesTable,
  brandsTable,
  collectionsTable,
  productCollectionsTable,
} from "@/db/schema";
import { eq, and, or, inArray } from "drizzle-orm";
import { ProductFilters } from "@/lib/filters";

export async function getFilteredProducts(filters: ProductFilters) {
  try {
    const conditions: any[] = [];

    if (filters.gender) {
      conditions.push(eq(productsTable.gender, filters.gender));
    }

    if (filters.categorySlug || filters.subcategorySlug) {
      const categoryConditions: any[] = [];

      if (filters.categorySlug) {
        categoryConditions.push(eq(categoriesTable.slug, filters.categorySlug));
      }

      if (filters.subcategorySlug) {
        categoryConditions.push(
          eq(categoriesTable.slug, filters.subcategorySlug)
        );
      }

      const categories = await db.query.categoriesTable.findMany({
        where: or(...categoryConditions),
      });

      if (categories.length > 0) {
        const categoryIds = categories.map((c) => c.id);

        const categoryFilter = or(
          inArray(productsTable.categoryId, categoryIds),
          inArray(productsTable.subcategoryId, categoryIds)
        );

        if (categoryFilter) {
          conditions.push(categoryFilter);
        }
      } else {
        return [];
      }
    }

    if (filters.brandSlug) {
      const brand = await db.query.brandsTable.findFirst({
        where: eq(brandsTable.slug, filters.brandSlug),
      });

      if (brand) {
        conditions.push(eq(productsTable.brandId, brand.id));
      } else {
        return [];
      }
    }

    if (filters.collectionSlug) {
      const collection = await db.query.collectionsTable.findFirst({
        where: eq(collectionsTable.slug, filters.collectionSlug),
      });

      if (collection) {
        const productCollections = await db
          .select()
          .from(productCollectionsTable)
          .where(eq(productCollectionsTable.collectionId, collection.id));

        if (productCollections.length > 0) {
          const productIds = productCollections.map((pc) => pc.productId);
          conditions.push(inArray(productsTable.id, productIds));
        } else {
          return [];
        }
      } else {
        return [];
      }
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const products = await db.query.productsTable.findMany({
      where: whereClause,
      with: {
        variants: {
          with: {
            color: true,
          },
        },
        category: true,
        subcategory: true,
        brand: true,
      },
    });

    return products;
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    return [];
  }
}
