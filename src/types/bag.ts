import {
  bagItemsTable,
  bagsTable,
  productVariantSizesTable,
  productVariantsTable,
  productsTable,
  sizesTable,
} from "@/db/schema";

export interface LocalBagItem {
  productVariantSizeId: number;
  quantity: number;
}

export interface LocalBag {
  items: LocalBagItem[];
}

export type BagItemWithRelations = typeof bagItemsTable.$inferSelect & {
  productVariantSize:
    | (typeof productVariantSizesTable.$inferSelect & {
        variant: typeof productVariantsTable.$inferSelect & {
          product: typeof productsTable.$inferSelect;
        };
        size: typeof sizesTable.$inferSelect;
      })
    | null;
};

export type BagWithTotal = typeof bagsTable.$inferSelect & {
  items: BagItemWithRelations[];
  totalPriceInCents: number;
};

export interface BagContextValue {
  bag: BagWithTotal | null;
  localBag: LocalBag;
  isAuthenticated: boolean;
  isPending: boolean;
  totalItems: number;
  totalPriceInCents: number;
  addItem: (productVariantSizeId: number) => Promise<void>;
  removeItem: (productVariantSizeId: number) => Promise<void>;
  updateQuantity: (productVariantSizeId: number, quantity: number) => Promise<void>;
  clearBag: () => Promise<void>;
  mergeBagOnLogin: () => Promise<void>;
}

