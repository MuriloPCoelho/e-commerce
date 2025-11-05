import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { categoriesTable } from "./schema";
import * as schema from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function seedCategories() {
  console.log("🌱 Seeding categories...");

  // Insert main categories
  const [shoes, clothing, accessories] = await db
    .insert(categoriesTable)
    .values([
      { name: "Shoes", slug: "shoes", parentId: null },
      { name: "Clothing", slug: "clothing", parentId: null },
      { name: "Accessories", slug: "accessories", parentId: null },
    ])
    .returning();

  console.log("✅ Main categories created");

  // Insert Shoes subcategories
  await db.insert(categoriesTable).values([
    { name: "Boots", slug: "boots", parentId: shoes.id },
    { name: "Sandals & Slides", slug: "sandals-slides", parentId: shoes.id },
    { name: "Soccer Cleats", slug: "soccer-cleats", parentId: shoes.id },
    { name: "Flats", slug: "flats", parentId: shoes.id },
    { name: "Casual Shoes", slug: "casual-shoes", parentId: shoes.id },
    { name: "Sneakers", slug: "sneakers", parentId: shoes.id },
    { name: "Running Shoes", slug: "running-shoes", parentId: shoes.id },
  ]);

  console.log("✅ Shoes subcategories created");

  // Insert Clothing subcategories
  await db.insert(categoriesTable).values([
    { name: "Shorts", slug: "shorts", parentId: clothing.id },
    { name: "Pants", slug: "pants", parentId: clothing.id },
    { name: "Team Jerseys", slug: "team-jerseys", parentId: clothing.id },
    { name: "T-Shirts", slug: "t-shirts", parentId: clothing.id },
    { name: "Jackets & Coats", slug: "jackets-coats", parentId: clothing.id },
    { name: "Hoodies & Sweatshirts", slug: "hoodies-sweatshirts", parentId: clothing.id },
    { name: "Tank Tops", slug: "tank-tops", parentId: clothing.id },
    { name: "Shorts", slug: "shorts-alt", parentId: clothing.id },
    { name: "Tops", slug: "tops", parentId: clothing.id },
    { name: "Dresses", slug: "dresses", parentId: clothing.id },
  ]);

  console.log("✅ Clothing subcategories created");

  // Insert Accessories subcategories
  await db.insert(categoriesTable).values([
    { name: "Caps", slug: "caps", parentId: accessories.id },
    { name: "Bags & Backpacks", slug: "bags-backpacks", parentId: accessories.id },
    { name: "Socks", slug: "socks", parentId: accessories.id },
    { name: "Watches", slug: "watches", parentId: accessories.id },
  ]);

  console.log("✅ Accessories subcategories created");
  console.log("\n✅ Total: 3 categories + 24 subcategories created!");
}

seedCategories()
  .catch((error) => {
    console.error("❌ Error seeding categories:", error);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
    process.exit(0);
  });
