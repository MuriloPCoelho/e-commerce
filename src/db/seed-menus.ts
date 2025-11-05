import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { menusTable } from "./schema";
import * as schema from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

// Mapping from category slugs to English menu names
const categoryNameMap: Record<string, string> = {
  // Footwear
  "boots": "Boots",
  "sandals-slides": "Sandals & Slides",
  "soccer-cleats": "Soccer Cleats",
  "casual-shoes": "Casual Shoes",
  "flats": "Flats",
  "sneakers": "Sneakers",
  "running-shoes": "Running Shoes",
  
  // Clothing
  "shorts": "Shorts",
  "pants": "Pants",
  "t-shirts": "T-Shirts",
  "team-jerseys": "Team Jerseys",
  "jackets-coats": "Jackets & Coats",
  "hoodies-sweatshirts": "Hoodies & Sweatshirts",
  "tank-tops": "Tank Tops",
  "shorts-alt": "Shorts",
  "tops": "Tops",
  "dresses": "Dresses",
  
  // Accessories
  "caps": "Caps",
  "bags-backpacks": "Bags & Backpacks",
  "socks": "Socks",
  "watches": "Watches",
};

async function createSubmenus(parentId: number, subcatSlugs: string[], categories: any[], prefix: string, categoryPrefix: string) {
  for (let i = 0; i < subcatSlugs.length; i++) {
    const subcat = categories.find(c => c.slug === subcatSlugs[i]);
    if (subcat) {
      const englishName = categoryNameMap[subcat.slug] || subcat.name;
      
      await db.insert(menusTable).values({
        name: englishName,
        slug: `${prefix}-${subcat.slug}`,
        href: `/${categoryPrefix}/${subcat.slug}`,
        parentId,
        type: "category",
        referenceId: subcat.id,
        order: i,
      });
    }
  }
}

async function seedMenus() {
  console.log("🌱 Seeding menus...");
  await db.delete(menusTable);
  
  const categories = await db.query.categoriesTable.findMany();
  const collections = await db.query.collectionsTable.findMany();
  
  const findCat = (slug: string) => categories.find(c => c.slug === slug);
  
  let order = 0;
  
  // MEN
  const [men] = await db.insert(menusTable).values({
    name: "Men",
    slug: "men",
    href: "/men",
    type: "custom",
    order: order++,
  }).returning();
  
  const [menShoes] = await db.insert(menusTable).values({
    name: "Shoes",
    slug: "men-shoes",
    href: "/men/shoes",
    parentId: men.id,
    type: "custom",
    order: 0,
  }).returning();
  
  await createSubmenus(menShoes.id, ["boots", "sandals-slides", "soccer-cleats", "casual-shoes", "sneakers", "running-shoes"], categories, "men", "men/shoes");
  
  const [menClothing] = await db.insert(menusTable).values({
    name: "Clothing",
    slug: "men-clothing",
    href: "/men/clothing",
    parentId: men.id,
    type: "custom",
    order: 1,
  }).returning();
  
  await createSubmenus(menClothing.id, ["shorts", "pants", "team-jerseys", "t-shirts", "jackets-coats", "hoodies-sweatshirts", "tank-tops", "shorts-alt"], categories, "men", "men/clothing");
  
  const [menAccess] = await db.insert(menusTable).values({
    name: "Accessories",
    slug: "men-accessories",
    href: "/men/accessories",
    parentId: men.id,
    type: "custom",
    order: 2,
  }).returning();
  
  await createSubmenus(menAccess.id, ["caps", "bags-backpacks", "socks", "watches"], categories, "men", "men/accessories");
  
  console.log("✅ Men menu created");
  
  // WOMEN
  const [women] = await db.insert(menusTable).values({
    name: "Women",
    slug: "women",
    href: "/women",
    type: "custom",
    order: order++,
  }).returning();
  
  const [womenShoes] = await db.insert(menusTable).values({
    name: "Shoes",
    slug: "women-shoes",
    href: "/women/shoes",
    parentId: women.id,
    type: "custom",
    order: 0,
  }).returning();
  
  await createSubmenus(womenShoes.id, ["boots", "sandals-slides", "flats", "sneakers", "running-shoes"], categories, "women", "women/shoes");
  
  const [womenClothing] = await db.insert(menusTable).values({
    name: "Clothing",
    slug: "women-clothing",
    href: "/women/clothing",
    parentId: women.id,
    type: "custom",
    order: 1,
  }).returning();
  
  await createSubmenus(womenClothing.id, ["shorts", "pants", "team-jerseys", "t-shirts", "jackets-coats", "hoodies-sweatshirts", "tank-tops", "shorts-alt", "dresses"], categories, "women", "women/clothing");
  
  const [womenAccess] = await db.insert(menusTable).values({
    name: "Accessories",
    slug: "women-accessories",
    href: "/women/accessories",
    parentId: women.id,
    type: "custom",
    order: 2,
  }).returning();
  
  await createSubmenus(womenAccess.id, ["caps", "bags-backpacks", "socks", "watches"], categories, "women", "women/accessories");
  
  console.log("✅ Women menu created");
  
  // SHOES
  const [shoes] = await db.insert(menusTable).values({
    name: "Shoes",
    slug: "shoes-menu",
    href: "/shoes",
    type: "custom",
    order: order++,
  }).returning();
  
  await createSubmenus(shoes.id, ["boots", "sandals-slides", "soccer-cleats", "flats", "casual-shoes", "sneakers", "running-shoes"], categories, "shoes", "shoes");
  
  console.log("✅ Shoes menu created");
  
  // CLOTHING
  const [clothing] = await db.insert(menusTable).values({
    name: "Clothing",
    slug: "clothing-menu",
    href: "/clothing",
    type: "custom",
    order: order++,
  }).returning();
  
  await createSubmenus(clothing.id, ["shorts", "pants", "team-jerseys", "t-shirts", "jackets-coats", "hoodies-sweatshirts", "tank-tops", "shorts-alt", "tops", "dresses"], categories, "clothing", "clothing");
  
  console.log("✅ Clothing menu created");
  
  // ACCESSORIES
  const [accessories] = await db.insert(menusTable).values({
    name: "Accessories",
    slug: "accessories-menu",
    href: "/accessories",
    type: "custom",
    order: order++,
  }).returning();
  
  await createSubmenus(accessories.id, ["caps", "bags-backpacks", "socks", "watches"], categories, "accessories", "accessories");
  
  console.log("✅ Accessories menu created");
  
  // SPORTS
  const [sports] = await db.insert(menusTable).values({
    name: "Sports",
    slug: "sports",
    href: "/sports",
    type: "custom",
    order: order++,
  }).returning();
  
  const sportsCollections = collections.filter(c => c.type === "sport");
  for (let i = 0; i < sportsCollections.length; i++) {
    await db.insert(menusTable).values({
      name: sportsCollections[i].name,
      slug: `sports-${sportsCollections[i].slug}`,
      href: `/collections/${sportsCollections[i].slug}`,
      parentId: sports.id,
      type: "collection",
      referenceId: sportsCollections[i].id,
      order: i,
    });
  }
  
  console.log("✅ Sports menu created");
  
  // SALE
  const sale = collections.find(c => c.slug === "promocoes");
  if (sale) {
    await db.insert(menusTable).values({
      name: "Sale",
      slug: "sale",
      href: "/sale",
      type: "collection",
      referenceId: sale.id,
      order: order++,
    });
    console.log("✅ Sale menu created");
  }
  
  console.log("\n✅ All menus seeded successfully!");
}

seedMenus()
  .catch(error => {
    console.error("❌ Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
    process.exit(0);
  });