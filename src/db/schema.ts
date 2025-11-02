import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const usersRelations = relations(usersTable, ({ many, one }) => ({
  userAddresses: many(userAddressesTable),
  bags: one(bagsTable, {
    fields: [usersTable.id],
    references: [bagsTable.userId],
  }),
}));

export const sessionsTable = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
});

export const accountsTable = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verificationsTable = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const categoriesTable = pgTable("tb_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  parentId: integer("parent_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const categoriesRelations = relations(categoriesTable, ({ many, one }) => ({
  products: many(productsTable, { relationName: "categoryToProduct" }),
  subcategoryProducts: many(productsTable, { relationName: "subcategoryToProduct" }),
  parent: one(categoriesTable, {
    fields: [categoriesTable.parentId],
    references: [categoriesTable.id],
    relationName: "categoryToSubcategory",
  }),
  subcategories: many(categoriesTable, {
    relationName: "categoryToSubcategory",
  }),
}));

export const productsTable = pgTable("tb_products", {
  id: uuid("id").primaryKey().defaultRandom(),
  categoryId: integer("category_id")
    .references(() => categoriesTable.id)
    .notNull(),

  subcategoryId: integer("subcategory_id")
    .references(() => categoriesTable.id),

  brandId: integer("brand_id")
    .references(() => brandsTable.id)
    .notNull(),

  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  gender: text("gender", { enum: ["masculino", "feminino", "unissex"] })
    .notNull()
    .default("unissex"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const productVariantsTable = pgTable("tb_product_variants", {
  id: serial("id").primaryKey(),
  productId: uuid("product_id")
    .references(() => productsTable.id)
    .notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  colorId: integer("color_id")
    .references(() => colorsTable.id)
    .notNull(),
  priceInCents: integer("price_in_cents").notNull(),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const productVariantSizesTable = pgTable("tb_product_variant_sizes", {
  id: serial("id").primaryKey(),
  variantId: integer("variant_id")
    .references(() => productVariantsTable.id)
    .notNull(),
  sizeId: integer("size_id")
    .references(() => sizesTable.id)
    .notNull(),
  stock: integer("stock").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const colorsTable = pgTable("tb_colors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  hex: text("hex").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const sizesTable = pgTable("tb_sizes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const brandsTable = pgTable("tb_brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const collectionsTable = pgTable("tb_collections", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  type: text("type", { enum: ["sport", "lifestyle", "promotion"] })
    .notNull()
    .default("sport"),
  description: text("description"),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const productCollectionsTable = pgTable("tb_product_collections", {
  id: serial("id").primaryKey(),
  productId: uuid("product_id")
    .references(() => productsTable.id, { onDelete: "cascade" })
    .notNull(),
  collectionId: integer("collection_id")
    .references(() => collectionsTable.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const productsRelations = relations(productsTable, ({ one, many }) => ({
  category: one(categoriesTable, {
    fields: [productsTable.categoryId],
    references: [categoriesTable.id],
    relationName: "categoryToProduct",
  }),
  subcategory: one(categoriesTable, {
    fields: [productsTable.subcategoryId],
    references: [categoriesTable.id],
    relationName: "subcategoryToProduct",
  }),
  variants: many(productVariantsTable),
  brand: one(brandsTable, {
    fields: [productsTable.brandId],
    references: [brandsTable.id],
  }),
  productCollections: many(productCollectionsTable),
}));

export const productVariantsRelations = relations(
  productVariantsTable,
  ({ one }) => ({
    product: one(productsTable, {
      fields: [productVariantsTable.productId],
      references: [productsTable.id],
    }),
    color: one(colorsTable, {
      fields: [productVariantsTable.colorId],
      references: [colorsTable.id],
    }),
  })
);

export const productVariantSizesRelations = relations(
  productVariantSizesTable,
  ({ one }) => ({
    variant: one(productVariantsTable, {
      fields: [productVariantSizesTable.variantId],
      references: [productVariantsTable.id],
    }),
    size: one(sizesTable, {
      fields: [productVariantSizesTable.sizeId],
      references: [sizesTable.id],
    }),
  })
);

export const userAddressesTable = pgTable("tb_user_addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .references(() => usersTable.id)
    .notNull(),
  recipientName: text("recipient_name").notNull(),
  phone: text("phone").notNull(),
  street: text("street").notNull(),
  number: text("number").notNull(),
  complement: text("complement"),
  neighborhood: text("neighborhood").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  country: text("country").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userAddressesRelations = relations(
  userAddressesTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [userAddressesTable.userId],
      references: [usersTable.id],
    }),
    bag: one(bagsTable, {
      fields: [userAddressesTable.id],
      references: [bagsTable.userAddressId],
    }),
  })
);

export const bagsTable = pgTable("tb_bags", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .references(() => usersTable.id)
    .notNull()
    .unique(),
  userAddressId: uuid("user_address_id")
    .references(() => userAddressesTable.id),
  status: boolean("status").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const bagsRelations = relations(bagsTable, ({ one, many }) => ({
  userAddress: one(userAddressesTable, {
    fields: [bagsTable.userAddressId],
    references: [userAddressesTable.id],
  }),
  user: one(usersTable, {
    fields: [bagsTable.userId],
    references: [usersTable.id],
  }),
  userAddresses: one(userAddressesTable, {
    fields: [bagsTable.userAddressId],
    references: [userAddressesTable.id],
  }),
  items: many(bagItemsTable),
}));

export const bagItemsTable = pgTable("tb_bag_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  bagId: uuid("bag_id")
    .notNull()
    .references(() => bagsTable.id),
  productVariantSizeId: integer("product_variant_size_id")
    .notNull()
    .references(() => productVariantSizesTable.id),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const bagItemsRelations = relations(bagItemsTable, ({ one }) => ({
  bag: one(bagsTable, {
    fields: [bagItemsTable.bagId],
    references: [bagsTable.id],
  }),
  productVariantSize: one(productVariantSizesTable, {
    fields: [bagItemsTable.productVariantSizeId],
    references: [productVariantSizesTable.id],
  }),
}));

export const menusTable = pgTable("tb_menus", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  href: text("href"),
  parentId: integer("parent_id"),
  type: text("type", { enum: ["custom", "category", "brand", "collection"] })
    .notNull()
    .default("custom"),
  referenceId: integer("reference_id"),
  order: integer("order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const menusRelations = relations(menusTable, ({ one, many }) => ({
  parent: one(menusTable, {
    fields: [menusTable.parentId],
    references: [menusTable.id],
    relationName: "menuToSubmenu",
  }),
  children: many(menusTable, {
    relationName: "menuToSubmenu",
  }),
  category: one(categoriesTable, {
    fields: [menusTable.referenceId],
    references: [categoriesTable.id],
  }),
  brand: one(brandsTable, {
    fields: [menusTable.referenceId],
    references: [brandsTable.id],
  }),
  collection: one(collectionsTable, {
    fields: [menusTable.referenceId],
    references: [collectionsTable.id],
  }),
}));

export const collectionsRelations = relations(collectionsTable, ({ many }) => ({
  productCollections: many(productCollectionsTable),
}));

export const productCollectionsRelations = relations(
  productCollectionsTable,
  ({ one }) => ({
    product: one(productsTable, {
      fields: [productCollectionsTable.productId],
      references: [productsTable.id],
    }),
    collection: one(collectionsTable, {
      fields: [productCollectionsTable.collectionId],
      references: [collectionsTable.id],
    }),
  })
);
