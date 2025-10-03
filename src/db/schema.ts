import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const usersTable = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

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
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
  products: many(productsTable),
}));

export const productsTable = pgTable("tb_products", {
  id: uuid("id").primaryKey().defaultRandom(),
  categoryId: integer("category_id")
    .references(() => categoriesTable.id)
    .notNull(),

  brandId: integer("brand_id")
    .references(() => brandsTable.id)
    .notNull(),

  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
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
  sizeId: integer("size_id")
  .references(() => sizesTable.id)
  .notNull(),
  stock: integer("stock").notNull().default(0),
  priceInCents: integer("price_in_cents").notNull(),
  imageUrl: text("image_url").notNull(),
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

export const productsRelations = relations(productsTable, ({ one, many }) => ({
  category: one(categoriesTable, {
    fields: [productsTable.categoryId],
    references: [categoriesTable.id],
  }),
  variants: many(productVariantsTable),
  brand: one(brandsTable, {
    fields: [productsTable.brandId],
    references: [brandsTable.id],
  }),
}));

export const productVariantsRelations = relations(productVariantsTable, ({ one }) => ({
  product: one(productsTable, {
    fields: [productVariantsTable.productId],
    references: [productsTable.id],
  }),
  color: one(colorsTable, {
    fields: [productVariantsTable.colorId],
    references: [colorsTable.id],
  }),
  size: one(sizesTable, {
    fields: [productVariantsTable.sizeId],
    references: [sizesTable.id],
  }),
}));