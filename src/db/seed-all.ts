#!/usr/bin/env node
import "dotenv/config";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function runSeedAll() {
  console.log("🌱 Iniciando seed completo do banco de dados...\n");

  try {
    // 1. Limpar banco
    console.log("📍 Passo 1: Limpando banco de dados");
    await execAsync("npx tsx src/db/clear-db.ts");
    console.log("✅ Banco limpo!\n");

    // 2. Seed de categorias
    console.log("📍 Passo 2: Criando categorias e subcategorias");
    const { execSync } = require("child_process");
    execSync("npx tsx src/db/seed-categories.ts", { stdio: "inherit" });
    console.log("✅ Categorias criadas!\n");

    // 3. Seed de collections
    console.log("📍 Passo 3: Criando collections (esportes)");
    execSync("npx tsx src/db/seed-collections.ts", { stdio: "inherit" });
    console.log("✅ Collections criadas!\n");

    // 4. Seed de menus
    console.log("📍 Passo 4: Criando menus");
    execSync("npx tsx src/db/seed-menus.ts", { stdio: "inherit" });
    console.log("✅ Menus criados!\n");

    // 5. Seed de produtos
    console.log("📍 Passo 5: Criando produtos");
    execSync("npx tsx src/db/seed.ts", { stdio: "inherit" });
    console.log("✅ Produtos criados!\n");

    console.log("🎉 Seed completo finalizado com sucesso!");
  } catch (error) {
    console.error("❌ Erro durante o seed:", error);
    process.exit(1);
  }
}

runSeedAll();
