import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { menusTable } from "./schema";
import * as schema from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function createSubmenus(parentId: number, subcatSlugs: string[], categories: any[], prefix: string, categoryPrefix: string) {
  for (let i = 0; i < subcatSlugs.length; i++) {
    const subcat = categories.find(c => c.slug === subcatSlugs[i]);
    if (subcat) {
      await db.insert(menusTable).values({
        name: subcat.name,
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
  
  // MASCULINO
  const [masc] = await db.insert(menusTable).values({
    name: "Masculino",
    slug: "masculino",
    href: "/masculino",
    type: "custom",
    order: order++,
  }).returning();
  
  const [mascCalc] = await db.insert(menusTable).values({
    name: "Calçados",
    slug: "masculino-calcados",
    href: "/masculino/calcados",
    parentId: masc.id,
    type: "custom",
    order: 0,
  }).returning();
  
  await createSubmenus(mascCalc.id, ["botas", "chinelos", "chuteiras", "sapatenis", "tenis", "tenis-de-corrida"], categories, "masculino", "masculino/calcados");
  
  const [mascRoup] = await db.insert(menusTable).values({
    name: "Roupas",
    slug: "masculino-roupas",
    href: "/masculino/roupas",
    parentId: masc.id,
    type: "custom",
    order: 1,
  }).returning();
  
  await createSubmenus(mascRoup.id, ["bermudas", "calcas", "camisetas-de-time", "camisetas", "jaquetas-casacos", "moletons-agasalhos", "regatas", "shorts"], categories, "masculino", "masculino/roupas");
  
  const [mascAcess] = await db.insert(menusTable).values({
    name: "Acessórios",
    slug: "masculino-acessorios",
    href: "/masculino/acessorios",
    parentId: masc.id,
    type: "custom",
    order: 2,
  }).returning();
  
  await createSubmenus(mascAcess.id, ["bones", "bolsas-mochilas", "meias", "relogios"], categories, "masculino", "masculino/acessorios");
  
  console.log("✅ Menu Masculino criado");
  
  // FEMININO
  const [fem] = await db.insert(menusTable).values({
    name: "Feminino",
    slug: "feminino",
    href: "/feminino",
    type: "custom",
    order: order++,
  }).returning();
  
  const [femCalc] = await db.insert(menusTable).values({
    name: "Calçados",
    slug: "feminino-calcados",
    href: "/feminino/calcados",
    parentId: fem.id,
    type: "custom",
    order: 0,
  }).returning();
  
  await createSubmenus(femCalc.id, ["botas", "chinelos", "sapatilhas", "tenis", "tenis-de-corrida"], categories, "feminino", "feminino/calcados");
  
  const [femRoup] = await db.insert(menusTable).values({
    name: "Roupas",
    slug: "feminino-roupas",
    href: "/feminino/roupas",
    parentId: fem.id,
    type: "custom",
    order: 1,
  }).returning();
  
  await createSubmenus(femRoup.id, ["bermudas", "calcas", "camisetas-de-time", "camisetas", "jaquetas-casacos", "moletons-agasalhos", "regatas", "shorts", "vestidos"], categories, "feminino", "feminino/roupas");
  
  const [femAcess] = await db.insert(menusTable).values({
    name: "Acessórios",
    slug: "feminino-acessorios",
    href: "/feminino/acessorios",
    parentId: fem.id,
    type: "custom",
    order: 2,
  }).returning();
  
  await createSubmenus(femAcess.id, ["bones", "bolsas-mochilas", "meias", "relogios"], categories, "feminino", "feminino/acessorios");
  
  console.log("✅ Menu Feminino criado");
  
  // CALÇADOS
  const [calc] = await db.insert(menusTable).values({
    name: "Calçados",
    slug: "calcados-menu",
    href: "/calcados",
    type: "custom",
    order: order++,
  }).returning();
  
  await createSubmenus(calc.id, ["botas", "chinelos", "chuteiras", "sapatilhas", "sapatenis", "tenis", "tenis-de-corrida"], categories, "calcados", "calcados");
  
  console.log("✅ Menu Calçados criado");
  
  // ROUPAS
  const [roup] = await db.insert(menusTable).values({
    name: "Roupas",
    slug: "roupas-menu",
    href: "/roupas",
    type: "custom",
    order: order++,
  }).returning();
  
  await createSubmenus(roup.id, ["bermudas", "calcas", "camisetas-de-time", "camisetas", "jaquetas-casacos", "moletons-agasalhos", "regatas", "shorts", "tops", "vestidos"], categories, "roupas", "roupas");
  
  console.log("✅ Menu Roupas criado");
  
  // ACESSÓRIOS
  const [acess] = await db.insert(menusTable).values({
    name: "Acessórios",
    slug: "acessorios-menu",
    href: "/acessorios",
    type: "custom",
    order: order++,
  }).returning();
  
  await createSubmenus(acess.id, ["bones", "bolsas-mochilas", "meias", "relogios"], categories, "acessorios", "acessorios");
  
  console.log("✅ Menu Acessórios criado");
  
  // ESPORTES
  const [esp] = await db.insert(menusTable).values({
    name: "Esportes",
    slug: "esportes",
    href: "/esportes",
    type: "custom",
    order: order++,
  }).returning();
  
  const sports = collections.filter(c => c.type === "sport");
  for (let i = 0; i < sports.length; i++) {
    await db.insert(menusTable).values({
      name: sports[i].name,
      slug: `esportes-${sports[i].slug}`,
      href: `/esportes/${sports[i].slug}`,
      parentId: esp.id,
      type: "collection",
      referenceId: sports[i].id,
      order: i,
    });
  }
  
  console.log("✅ Menu Esportes criado");
  
  // PROMOÇÕES
  const promo = collections.find(c => c.slug === "promocoes");
  if (promo) {
    await db.insert(menusTable).values({
      name: "Promoções",
      slug: "promocoes",
      href: "/promocoes",
      type: "collection",
      referenceId: promo.id,
      order: order++,
    });
    console.log("✅ Menu Promoções criado");
  }
  
  console.log("\n✅ Menus seeded successfully!");
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