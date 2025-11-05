import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { collectionsTable } from "./schema";
import * as schema from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function seedCollections() {
  console.log("🌱 Seeding collections...");

  // Check if collections already exist
  const existing = await db.query.collectionsTable.findMany();
  if (existing.length > 0) {
    console.log("⚠️  Collections already exist. Skipping seed...");
    console.log("💡 If you want to re-seed, delete the collections manually first.");
    return;
  }

  // Insert sports collections
  const sportsCollections = [
    {
      name: "Skateboarding",
      slug: "skateboarding",
      type: "sport" as const,
      description: "Products for skateboarding and street culture",
    },
    {
      name: "Basketball",
      slug: "basketball",
      type: "sport" as const,
      description: "Basketball products",
    },
    {
      name: "Soccer",
      slug: "soccer",
      type: "sport" as const,
      description: "Soccer products",
    },
    {
      name: "Surf",
      slug: "surf",
      type: "sport" as const,
      description: "Products for surfing and beach culture",
    },
    {
      name: "Tennis",
      slug: "tennis-sport",
      type: "sport" as const,
      description: "Tennis sport products",
    },
    {
      name: "Running",
      slug: "running",
      type: "sport" as const,
      description: "Running products",
    },
    {
      name: "Volleyball",
      slug: "volleyball",
      type: "sport" as const,
      description: "Volleyball products",
    },
    {
      name: "Swimming",
      slug: "swimming",
      type: "sport" as const,
      description: "Swimming products",
    },
    {
      name: "Training & Gym",
      slug: "training-gym",
      type: "sport" as const,
      description: "Products for training and gym",
    },
  ];

  await db.insert(collectionsTable).values(sportsCollections);
  console.log("✅ Sports collections created");

  // Insert lifestyle collections
  const lifestyleCollections = [
    {
      name: "Casual",
      slug: "casual",
      type: "lifestyle" as const,
      description: "Products for casual and everyday wear",
    },
    {
      name: "Streetwear",
      slug: "streetwear",
      type: "lifestyle" as const,
      description: "Urban fashion and street style",
    },
    {
      name: "Outdoor",
      slug: "outdoor",
      type: "lifestyle" as const,
      description: "Products for adventure and outdoor",
    },
  ];

  await db.insert(collectionsTable).values(lifestyleCollections);
  console.log("✅ Lifestyle collections created");

  // Insert promotion collection
  await db.insert(collectionsTable).values({
    name: "Sale",
    slug: "sale",
    type: "promotion",
    description: "Products on sale",
  });
  console.log("✅ Promotion collection created");

  // Check result
  const allCollections = await db.query.collectionsTable.findMany({
    orderBy: (collections, { asc }) => [asc(collections.type), asc(collections.name)],
  });

  console.log("\n📊 Results:");
  
  const sports = allCollections.filter((c) => c.type === "sport");
  const lifestyles = allCollections.filter((c) => c.type === "lifestyle");
  const promotions = allCollections.filter((c) => c.type === "promotion");

  console.log("\n🏃 Sports:");
  sports.forEach((c) => {
    console.log(`  - ${c.name} (${c.slug})`);
  });

  console.log("\n🎨 Lifestyle:");
  lifestyles.forEach((c) => {
    console.log(`  - ${c.name} (${c.slug})`);
  });

  console.log("\n🎁 Promotions:");
  promotions.forEach((c) => {
    console.log(`  - ${c.name} (${c.slug})`);
  });

  console.log(`\n✅ Total: ${allCollections.length} collections created!`);
}

seedCollections()
  .catch((error) => {
    console.error("❌ Error seeding collections:", error);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
    process.exit(0);
  });
