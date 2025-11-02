import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { 
  categoriesTable, 
  productsTable, 
  productVariantsTable,
  productVariantSizesTable,
  bagItemsTable,
  productCollectionsTable,
  collectionsTable,
  menusTable
} from "./schema";
import * as schema from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function clearDatabase() {
  console.log("🧹 Limpando banco de dados...");

  // Deletar na ordem correta (devido às foreign keys)
  await db.delete(bagItemsTable);
  console.log("  ✓ Bag items deletados");

  await db.delete(productCollectionsTable);
  console.log("  ✓ Product collections deletados");

  await db.delete(productVariantSizesTable);
  console.log("  ✓ Product variant sizes deletados");

  await db.delete(productVariantsTable);
  console.log("  ✓ Product variants deletados");

  await db.delete(productsTable);
  console.log("  ✓ Products deletados");

  await db.delete(menusTable);
  console.log("  ✓ Menus deletados");

  await db.delete(collectionsTable);
  console.log("  ✓ Collections deletadas");

  await db.delete(categoriesTable);
  console.log("  ✓ Categories deletadas");

  console.log("✅ Banco de dados limpo!\n");
}

clearDatabase()
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
    process.exit(0);
  });
