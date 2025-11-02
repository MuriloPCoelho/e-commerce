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

  // Inserir categorias principais
  const [calcados, roupas, acessorios] = await db
    .insert(categoriesTable)
    .values([
      { name: "Calçados", slug: "calcados", parentId: null },
      { name: "Roupas", slug: "roupas", parentId: null },
      { name: "Acessórios", slug: "acessorios", parentId: null },
    ])
    .returning();

  console.log("✅ Categorias principais criadas");

  // Inserir subcategorias de Calçados
  await db.insert(categoriesTable).values([
    { name: "Botas", slug: "botas", parentId: calcados.id },
    { name: "Chinelos", slug: "chinelos", parentId: calcados.id },
    { name: "Chuteiras", slug: "chuteiras", parentId: calcados.id },
    { name: "Sapatilhas", slug: "sapatilhas", parentId: calcados.id },
    { name: "Sapatênis", slug: "sapatenis", parentId: calcados.id },
    { name: "Tênis", slug: "tenis", parentId: calcados.id },
    { name: "Tênis de Corrida", slug: "tenis-de-corrida", parentId: calcados.id },
  ]);

  console.log("✅ Subcategorias de Calçados criadas");

  // Inserir subcategorias de Roupas
  await db.insert(categoriesTable).values([
    { name: "Bermudas", slug: "bermudas", parentId: roupas.id },
    { name: "Calças", slug: "calcas", parentId: roupas.id },
    { name: "Camisetas de Time", slug: "camisetas-de-time", parentId: roupas.id },
    { name: "Camisetas", slug: "camisetas", parentId: roupas.id },
    { name: "Jaquetas & Casacos", slug: "jaquetas-casacos", parentId: roupas.id },
    { name: "Moletons & Agasalhos", slug: "moletons-agasalhos", parentId: roupas.id },
    { name: "Regatas", slug: "regatas", parentId: roupas.id },
    { name: "Shorts", slug: "shorts", parentId: roupas.id },
    { name: "Tops", slug: "tops", parentId: roupas.id },
    { name: "Vestidos", slug: "vestidos", parentId: roupas.id },
  ]);

  console.log("✅ Subcategorias de Roupas criadas");

  // Inserir subcategorias de Acessórios
  await db.insert(categoriesTable).values([
    { name: "Bonés", slug: "bones", parentId: acessorios.id },
    { name: "Bolsas & Mochilas", slug: "bolsas-mochilas", parentId: acessorios.id },
    { name: "Meias", slug: "meias", parentId: acessorios.id },
    { name: "Relógios", slug: "relogios", parentId: acessorios.id },
  ]);

  console.log("✅ Subcategorias de Acessórios criadas");
  console.log("\n✅ Total: 3 categorias + 24 subcategorias criadas!");
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
