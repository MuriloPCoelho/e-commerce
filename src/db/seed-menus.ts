import "dotenv/config";
import { db } from ".";
import { menusTable } from "./schema";

async function seedMenusWithSubmenus() {
  console.log("🌱 Criando menus com submenus...");

  try {
    // 1. Menu Principal: Calçados (com submenus)
    const [calcadosMenu] = await db
      .insert(menusTable)
      .values({
        name: "Calçados",
        slug: "calcados",
        type: "custom",
        order: 1,
        isActive: true,
      })
      .returning();
    console.log("✅ Menu 'Calçados' criado");

    // Submenus de Calçados
    await db.insert(menusTable).values([
      {
        name: "Tênis",
        slug: "calcados-tenis",
        href: "/calcados/tenis",
        type: "custom",
        parentId: calcadosMenu.id,
        order: 1,
        isActive: true,
      },
      {
        name: "Casual",
        slug: "calcados-casual",
        href: "/calcados/casual",
        type: "custom",
        parentId: calcadosMenu.id,
        order: 2,
        isActive: true,
      },
      {
        name: "Corrida",
        slug: "calcados-corrida",
        href: "/calcados/corrida",
        type: "custom",
        parentId: calcadosMenu.id,
        order: 3,
        isActive: true,
      },
      {
        name: "Chuteiras",
        slug: "calcados-chuteiras",
        href: "/calcados/chuteiras",
        type: "custom",
        parentId: calcadosMenu.id,
        order: 4,
        isActive: true,
      },
      {
        name: "Academia",
        slug: "calcados-academia",
        href: "/calcados/academia",
        type: "custom",
        parentId: calcadosMenu.id,
        order: 5,
        isActive: true,
      },
      {
        name: "Skate",
        slug: "calcados-skate",
        href: "/calcados/skate",
        type: "custom",
        parentId: calcadosMenu.id,
        order: 6,
        isActive: true,
      },
      {
        name: "Basquete",
        slug: "calcados-basquete",
        href: "/calcados/basquete",
        type: "custom",
        parentId: calcadosMenu.id,
        order: 7,
        isActive: true,
      },
      {
        name: "Vôlei",
        slug: "calcados-volei",
        href: "/calcados/volei",
        type: "custom",
        parentId: calcadosMenu.id,
        order: 8,
        isActive: true,
      },
    ]);
    console.log("✅ 8 submenus de 'Calçados' criados");

    // 2. Menu Principal: Roupas (com submenus)
    const [roupasMenu] = await db
      .insert(menusTable)
      .values({
        name: "Roupas",
        slug: "roupas",
        type: "custom",
        order: 2,
        isActive: true,
      })
      .returning();
    console.log("✅ Menu 'Roupas' criado");

    // Submenus de Roupas
    await db.insert(menusTable).values([
      {
        name: "Camisetas",
        slug: "roupas-camisetas",
        href: "/roupas/camisetas",
        type: "custom",
        parentId: roupasMenu.id,
        order: 1,
        isActive: true,
      },
      {
        name: "Calças",
        slug: "roupas-calcas",
        href: "/roupas/calcas",
        type: "custom",
        parentId: roupasMenu.id,
        order: 2,
        isActive: true,
      },
      {
        name: "Shorts",
        slug: "roupas-shorts",
        href: "/roupas/shorts",
        type: "custom",
        parentId: roupasMenu.id,
        order: 3,
        isActive: true,
      },
      {
        name: "Jaquetas",
        slug: "roupas-jaquetas",
        href: "/roupas/jaquetas",
        type: "custom",
        parentId: roupasMenu.id,
        order: 4,
        isActive: true,
      },
    ]);
    console.log("✅ 4 submenus de 'Roupas' criados");

    // 3. Menu Principal: Acessórios (com submenus)
    const [acessoriosMenu] = await db
      .insert(menusTable)
      .values({
        name: "Acessórios",
        slug: "acessorios",
        type: "custom",
        order: 3,
        isActive: true,
      })
      .returning();
    console.log("✅ Menu 'Acessórios' criado");

    // Submenus de Acessórios
    await db.insert(menusTable).values([
      {
        name: "Mochilas",
        slug: "acessorios-mochilas",
        href: "/acessorios/mochilas",
        type: "custom",
        parentId: acessoriosMenu.id,
        order: 1,
        isActive: true,
      },
      {
        name: "Bonés",
        slug: "acessorios-bones",
        href: "/acessorios/bones",
        type: "custom",
        parentId: acessoriosMenu.id,
        order: 2,
        isActive: true,
      },
      {
        name: "Meias",
        slug: "acessorios-meias",
        href: "/acessorios/meias",
        type: "custom",
        parentId: acessoriosMenu.id,
        order: 3,
        isActive: true,
      },
      {
        name: "Relógios",
        slug: "acessorios-relogios",
        href: "/acessorios/relogios",
        type: "custom",
        parentId: acessoriosMenu.id,
        order: 4,
        isActive: true,
      },
    ]);
    console.log("✅ 4 submenus de 'Acessórios' criados");

    // 4. Menus simples (sem submenus)
    await db.insert(menusTable).values([
      {
        name: "Novidades",
        slug: "novidades",
        href: "/novidades",
        type: "custom",
        order: 4,
        isActive: true,
      },
      {
        name: "Promoções",
        slug: "promocoes",
        href: "/promocoes",
        type: "custom",
        order: 5,
        isActive: true,
      },
    ]);
    console.log("✅ Menus 'Novidades' e 'Promoções' criados");

    console.log("\n🎉 Todos os menus foram criados com sucesso!");
    console.log("\n📊 Resumo:");
    console.log("  - 1 menu: Calçados (com 8 submenus)");
    console.log("  - 1 menu: Roupas (com 4 submenus)");
    console.log("  - 1 menu: Acessórios (com 4 submenus)");
    console.log("  - 2 menus: Novidades e Promoções");
    console.log("\n  Total: 5 menus principais + 16 submenus = 21 itens");
  } catch (error) {
    console.error("❌ Erro ao criar menus:", error);
    throw error;
  }
}

// Execute o seed se este arquivo for rodado diretamente
if (require.main === module) {
  seedMenusWithSubmenus()
    .then(() => {
      console.log("\n✅ Seed completado com sucesso!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Seed falhou:", error);
      process.exit(1);
    });
}

export { seedMenusWithSubmenus };
