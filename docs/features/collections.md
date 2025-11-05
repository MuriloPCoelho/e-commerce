# 🎨 Sistema de Coleções

> Sistema avançado de coleções de produtos que permite agrupar itens por tema, estação, promoção ou qualquer critério de negócio.

## 📋 Índice

- [O que são Coleções](#-o-que-são-coleções)
- [Tipos de Coleções](#-tipos-de-coleções)
- [Estrutura do Banco de Dados](#-estrutura-do-banco-de-dados)
- [Como Funciona](#-como-funciona)
- [Exemplos de Uso](#-exemplos-de-uso)
- [Scripts de Seed](#-scripts-de-seed)
- [Boas Práticas](#-boas-práticas)

---

## 🎯 O que são Coleções?

Coleções são agrupamentos temáticos de produtos que permitem organizar o catálogo de forma flexível e independente das categorias tradicionais. Um produto pode pertencer a múltiplas coleções simultaneamente.

### Benefícios

✅ **Flexibilidade**: Um produto pode estar em várias coleções  
✅ **Marketing**: Facilita campanhas e promoções temáticas  
✅ **UX**: Melhora a descoberta de produtos pelos clientes  
✅ **Sazonalidade**: Organize produtos por estações ou eventos  
✅ **Performance**: Queries otimizadas com relações N:N

---

## 🏷️ Tipos de Coleções

O sistema suporta três tipos principais de coleções:

### 1. Sport (Esportiva)
Produtos focados em performance e atividades físicas.

**Exemplos:**
- Running Collection
- Basketball Collection
- Football Collection
- Training Collection
- Gym Collection

### 2. Lifestyle (Casual)
Produtos para o dia a dia e moda casual.

**Exemplos:**
- Street Style
- Urban Fashion
- Casual Collection
- Weekend Collection
- Basics Collection

### 3. Promotion (Promoção)
Produtos em oferta ou campanhas especiais.

**Exemplos:**
- Black Friday
- Summer Sale
- Liquidação de Inverno
- Outlet
- Flash Deals

---

## 🗄️ Estrutura do Banco de Dados

### Tabela: `tb_collections`

```sql
CREATE TABLE tb_collections (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL DEFAULT 'sport', -- 'sport' | 'lifestyle' | 'promotion'
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Tabela: `tb_product_collections`

Tabela de relacionamento N:N entre produtos e coleções.

```sql
CREATE TABLE tb_product_collections (
  id SERIAL PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES tb_products(id) ON DELETE CASCADE,
  collection_id INTEGER NOT NULL REFERENCES tb_collections(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(product_id, collection_id)
);
```

### Relações

```typescript
// Em src/db/schema.ts

export const collectionsRelations = relations(collectionsTable, ({ many }) => ({
  productCollections: many(productCollectionsTable),
}));

export const productCollectionsRelations = relations(
  productCollectionsTable,
  ({ one }) => ({
    product: one(productsTable, {
      fields: [productCollectionsTable.productId],
      references: [productsTable.id],
    }),
    collection: one(collectionsTable, {
      fields: [productCollectionsTable.collectionId],
      references: [collectionsTable.id],
    }),
  })
);
```

---

## ⚙️ Como Funciona

### 1. Criação de Coleção

```typescript
import { db } from "@/db";
import { collectionsTable } from "@/db/schema";

// Criar nova coleção
const newCollection = await db.insert(collectionsTable).values({
  name: "Summer Running",
  slug: "summer-running",
  type: "sport",
  description: "Produtos perfeitos para corridas no verão",
  imageUrl: "/collections/summer-running.jpg",
  isActive: true,
}).returning();
```

### 2. Adicionar Produtos à Coleção

```typescript
import { productCollectionsTable } from "@/db/schema";

// Adicionar produtos à coleção
await db.insert(productCollectionsTable).values([
  { productId: "uuid-product-1", collectionId: 1 },
  { productId: "uuid-product-2", collectionId: 1 },
  { productId: "uuid-product-3", collectionId: 1 },
]);
```

### 3. Buscar Produtos de uma Coleção

```typescript
import { eq } from "drizzle-orm";

const collectionProducts = await db
  .select()
  .from(productsTable)
  .innerJoin(
    productCollectionsTable,
    eq(productsTable.id, productCollectionsTable.productId)
  )
  .where(eq(productCollectionsTable.collectionId, collectionId));
```

### 4. Buscar Coleções de um Produto

```typescript
const productCollections = await db
  .select()
  .from(collectionsTable)
  .innerJoin(
    productCollectionsTable,
    eq(collectionsTable.id, productCollectionsTable.collectionId)
  )
  .where(eq(productCollectionsTable.productId, productId));
```

---

## 💡 Exemplos de Uso

### Exemplo 1: Página de Coleção

```typescript
// app/collections/[slug]/page.tsx

export default async function CollectionPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  // Buscar coleção
  const collection = await db.query.collectionsTable.findFirst({
    where: eq(collectionsTable.slug, params.slug),
    with: {
      productCollections: {
        with: {
          product: {
            with: {
              variants: true,
              brand: true,
              category: true,
            },
          },
        },
      },
    },
  });

  if (!collection) notFound();

  return (
    <div>
      <h1>{collection.name}</h1>
      <p>{collection.description}</p>
      
      <div className="grid grid-cols-4 gap-4">
        {collection.productCollections.map(({ product }) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

### Exemplo 2: Banner de Coleção na Home

```typescript
// components/collection-banner.tsx

export async function CollectionBanner() {
  const featuredCollections = await db.query.collectionsTable.findMany({
    where: and(
      eq(collectionsTable.isActive, true),
      eq(collectionsTable.type, "promotion")
    ),
    limit: 3,
  });

  return (
    <div className="flex gap-4">
      {featuredCollections.map((collection) => (
        <Link key={collection.id} href={`/collections/${collection.slug}`}>
          <div className="relative h-64 rounded-lg overflow-hidden">
            <img src={collection.imageUrl} alt={collection.name} />
            <div className="absolute inset-0 bg-black/40">
              <h3 className="text-white text-2xl">{collection.name}</h3>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
```

### Exemplo 3: Filtrar por Coleção

```typescript
// app/products/page.tsx

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { collection?: string };
}) {
  let products;

  if (searchParams.collection) {
    // Filtrar por coleção
    products = await db
      .select()
      .from(productsTable)
      .innerJoin(
        productCollectionsTable,
        eq(productsTable.id, productCollectionsTable.productId)
      )
      .innerJoin(
        collectionsTable,
        eq(productCollectionsTable.collectionId, collectionsTable.id)
      )
      .where(eq(collectionsTable.slug, searchParams.collection));
  } else {
    // Todos os produtos
    products = await db.select().from(productsTable);
  }

  return <ProductGrid products={products} />;
}
```

---

## 🌱 Scripts de Seed

### Seed de Coleções

O projeto inclui um script para popular coleções de exemplo:

```bash
npm run seed:collections
```

**O que o script cria:**

1. **Sport Collections**
   - Running Collection
   - Basketball Collection
   - Football Collection

2. **Lifestyle Collections**
   - Street Style
   - Urban Fashion
   - Casual Collection

3. **Promotion Collections**
   - Black Friday
   - Summer Sale
   - Outlet

### Código do Seed

```typescript
// src/db/seed-collections.ts

const sportCollections = [
  {
    name: "Running Collection",
    slug: "running-collection",
    type: "sport" as const,
    description: "Produtos para corrida e performance",
    isActive: true,
  },
  // ... mais coleções
];

await db.insert(collectionsTable).values([
  ...sportCollections,
  ...lifestyleCollections,
  ...promotionCollections,
]);

// Associar produtos às coleções
const products = await db.select().from(productsTable).limit(10);
const collections = await db.select().from(collectionsTable);

const productCollections = products.flatMap((product, idx) => 
  collections
    .slice(0, 2) // Cada produto em 2 coleções
    .map((collection) => ({
      productId: product.id,
      collectionId: collection.id,
    }))
);

await db.insert(productCollectionsTable).values(productCollections);
```

---

## ✅ Boas Práticas

### 1. Slugs Únicos
Sempre use slugs únicos e amigáveis para SEO:
```typescript
name: "Summer Running"
slug: "summer-running" // kebab-case
```

### 2. Imagens Otimizadas
- Use imagens de alta qualidade
- Otimize para web (WebP, compressão)
- Tamanho recomendado: 1200x600px

### 3. Ativação/Desativação
Use o campo `isActive` para controlar visibilidade sem deletar dados:
```typescript
// Desativar coleção temporariamente
await db
  .update(collectionsTable)
  .set({ isActive: false })
  .where(eq(collectionsTable.id, collectionId));
```

### 4. Descrições Claras
Escreva descrições que ajudem tanto SEO quanto usuários:
```typescript
description: "Descubra nossa coleção de tênis de corrida para o verão, com tecnologia de ventilação e design leve."
```

### 5. Relacionamentos Eficientes
Use `with` do Drizzle para buscar relações de forma otimizada:
```typescript
const collection = await db.query.collectionsTable.findFirst({
  with: {
    productCollections: {
      with: { product: true },
    },
  },
});
```

### 6. Tipos no TypeScript
Sempre use os tipos corretos:
```typescript
type CollectionType = "sport" | "lifestyle" | "promotion";

interface Collection {
  id: number;
  name: string;
  slug: string;
  type: CollectionType;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
}
```

---

## 🎨 Integrações

### Com Sistema de Menus

Coleções podem ser usadas no sistema de menus:

```typescript
// Criar menu vinculado a uma coleção
await db.insert(menusTable).values({
  name: "Black Friday",
  slug: "black-friday",
  type: "collection",
  referenceId: collectionId, // ID da coleção
  order: 1,
  isActive: true,
});
```

### Com Filtros de Produtos

Adicione coleções como filtro na busca:

```typescript
const filters = {
  category: "tenis",
  brand: "nike",
  collection: "running-collection", // ← Filtro por coleção
};
```

---

## 🔍 Troubleshooting

### Produto não aparece na coleção

Verifique se o relacionamento foi criado:
```typescript
const exists = await db
  .select()
  .from(productCollectionsTable)
  .where(
    and(
      eq(productCollectionsTable.productId, productId),
      eq(productCollectionsTable.collectionId, collectionId)
    )
  );
```

### Coleção não aparece no site

Verifique se está ativa:
```typescript
const collection = await db.query.collectionsTable.findFirst({
  where: and(
    eq(collectionsTable.slug, slug),
    eq(collectionsTable.isActive, true) // ← Importante
  ),
});
```

### Erro de slug duplicado

Slugs devem ser únicos. Use um gerador:
```typescript
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
```

---

## 📚 Recursos Adicionais

- [Sistema de Menus](./menus-system.md) - Integração com menus
- [Gerenciamento de Produtos](./products.md) - Como gerenciar produtos
- [Guia de Seed](../guides/seeding-data.md) - Scripts de população

---

**Última atualização:** Novembro 2025
