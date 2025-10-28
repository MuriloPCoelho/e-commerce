import "dotenv/config";
import { db } from ".";
import { menusTable } from "./schema";
import { sql } from "drizzle-orm";

async function clearMenus() {
  console.log("🗑️  Limpando menus existentes...");

  try {
    await db.execute(sql`DELETE FROM ${menusTable}`);
    console.log("✅ Todos os menus foram removidos!");
  } catch (error) {
    console.error("❌ Erro ao limpar menus:", error);
    throw error;
  }
}

if (require.main === module) {
  clearMenus()
    .then(() => {
      console.log("✅ Limpeza completada!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Limpeza falhou:", error);
      process.exit(1);
    });
}

export { clearMenus };
