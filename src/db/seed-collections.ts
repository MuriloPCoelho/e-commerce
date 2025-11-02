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

  // Verificar se já existem collections
  const existing = await db.query.collectionsTable.findMany();
  if (existing.length > 0) {
    console.log("⚠️  Collections já existem. Pulando seed...");
    console.log("💡 Se quiser re-seed, delete as collections manualmente primeiro.");
    return;
  }

  // Inserir collections de esportes
  const sportsCollections = [
    {
      name: "Skateboarding",
      slug: "skateboarding",
      type: "sport" as const,
      description: "Produtos para skateboarding e street culture",
    },
    {
      name: "Basquete",
      slug: "basquete",
      type: "sport" as const,
      description: "Produtos para basquete",
    },
    {
      name: "Futebol",
      slug: "futebol",
      type: "sport" as const,
      description: "Produtos para futebol",
    },
    {
      name: "Surf",
      slug: "surf",
      type: "sport" as const,
      description: "Produtos para surf e cultura de praia",
    },
    {
      name: "Tênis",
      slug: "tenis-esporte",
      type: "sport" as const,
      description: "Produtos para tênis (esporte)",
    },
    {
      name: "Corrida",
      slug: "corrida",
      type: "sport" as const,
      description: "Produtos para corrida e running",
    },
    {
      name: "Vôlei",
      slug: "volei",
      type: "sport" as const,
      description: "Produtos para vôlei",
    },
    {
      name: "Natação",
      slug: "natacao",
      type: "sport" as const,
      description: "Produtos para natação",
    },
    {
      name: "Treino & Academia",
      slug: "treino-academia",
      type: "sport" as const,
      description: "Produtos para treino e academia",
    },
  ];

  await db.insert(collectionsTable).values(sportsCollections);
  console.log("✅ Collections de esportes criadas");

  // Inserir collections de lifestyle
  const lifestyleCollections = [
    {
      name: "Casual",
      slug: "casual",
      type: "lifestyle" as const,
      description: "Produtos para uso casual e dia a dia",
    },
    {
      name: "Streetwear",
      slug: "streetwear",
      type: "lifestyle" as const,
      description: "Moda urbana e street style",
    },
    {
      name: "Outdoor",
      slug: "outdoor",
      type: "lifestyle" as const,
      description: "Produtos para aventura e outdoor",
    },
  ];

  await db.insert(collectionsTable).values(lifestyleCollections);
  console.log("✅ Collections de lifestyle criadas");

  // Inserir collection de promoções
  await db.insert(collectionsTable).values({
    name: "Promoções",
    slug: "promocoes",
    type: "promotion",
    description: "Produtos em promoção",
  });
  console.log("✅ Collection de promoções criada");

  // Verificar resultado
  const allCollections = await db.query.collectionsTable.findMany({
    orderBy: (collections, { asc }) => [asc(collections.type), asc(collections.name)],
  });

  console.log("\n📊 Resultado:");
  
  const sports = allCollections.filter((c) => c.type === "sport");
  const lifestyles = allCollections.filter((c) => c.type === "lifestyle");
  const promotions = allCollections.filter((c) => c.type === "promotion");

  console.log("\n🏃 Esportes:");
  sports.forEach((c) => {
    console.log(`  - ${c.name} (${c.slug})`);
  });

  console.log("\n🎨 Lifestyle:");
  lifestyles.forEach((c) => {
    console.log(`  - ${c.name} (${c.slug})`);
  });

  console.log("\n🎁 Promoções:");
  promotions.forEach((c) => {
    console.log(`  - ${c.name} (${c.slug})`);
  });

  console.log(`\n✅ Total: ${allCollections.length} collections criadas!`);
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
