# 📖 Guia: Scripts de Seed

> Guia completo sobre os scripts de seed disponíveis no projeto para popular o banco de dados com dados de exemplo.

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Ordem Recomendada](#-ordem-recomendada)
- [Detalhamento dos Seeds](#-detalhamento-dos-seeds)
- [Personalizando Seeds](#-personalizando-seeds)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Visão Geral

Os scripts de seed são ferramentas que populam o banco de dados com dados de exemplo, permitindo testar e desenvolver o projeto com dados realistas.

### Por que usar seeds?

✅ **Desenvolvimento rápido**: Dados prontos para testar  
✅ **Ambiente consistente**: Mesmos dados para todos os devs  
✅ **Demonstração**: Mostre o projeto com dados reais  
✅ **Testes**: Base de dados para testes automatizados

---

## 📦 Scripts Disponíveis

### Comando Principal

```bash
npm run db:seed
```

Executa todos os seeds na ordem correta. **Este é o comando recomendado** para popular o banco completo.

### Comandos Individuais

| Comando | Descrição |
|---------|-----------|
| `npm run seed:categories` | Popula categorias e subcategorias |
| `npm run seed:collections` | Popula coleções (Sport, Lifestyle, Promotion) |
| `npm run seed:menus` | Popula sistema de menus |
| `npm run seed:products` | Popula produtos com variantes, cores e tamanhos |

### Comandos de Limpeza

```bash
npm run db:clear      # Limpa todas as tabelas
npm run db:reset      # Limpa e repopula (clear + seed)
```

---

## 🔢 Ordem Recomendada

Ao rodar seeds individuais, siga esta ordem devido às dependências:

```
1. Categorias       (tb_categories)
2. Marcas           (tb_brands) 
3. Cores            (tb_colors)
4. Tamanhos         (tb_sizes)
5. Produtos         (tb_products + tb_product_variants + tb_product_variant_sizes)
6. Coleções         (tb_collections + tb_product_collections)
7. Menus            (tb_menus)
```

**Atalho**: Use `npm run db:seed` que já executa tudo na ordem certa!

---

## 📝 Detalhamento dos Seeds

### 1. Seed de Categorias

**Comando:**
```bash
npm run seed:categories
```

**O que cria:**
- Categorias principais (Calçados, Roupas, Acessórios)
- Subcategorias (Tênis, Chuteiras, Camisetas, etc.)
- Relacionamentos hierárquicos

**Estrutura criada:**
```
Calçados
├── Tênis
├── Chuteiras
└── Sandálias

Roupas
├── Camisetas
├── Calças
└── Jaquetas

Acessórios
├── Bonés
├── Mochilas
└── Meias
```

**Arquivo:** `src/db/seed-categories.ts`

### 2. Seed de Coleções

**Comando:**
```bash
npm run seed:collections
```

**O que cria:**
- Coleções Sport (Running, Basketball, Football)
- Coleções Lifestyle (Street Style, Urban, Casual)
- Coleções Promotion (Black Friday, Summer Sale, Outlet)

**Arquivo:** `src/db/seed-collections.ts`

### 3. Seed de Menus

**Comando:**
```bash
npm run seed:menus
```

**O que cria:**
- Menu "Início" (link para home)
- Menu "Categorias" com submenus para cada categoria
- Menu "Marcas" com submenus para cada marca
- Menus "Novidades" e "Promoções"

**Estrutura criada:**
```
Início
Categorias
├── Calçados
│   ├── Tênis
│   ├── Chuteiras
│   └── Sandálias
├── Roupas
└── Acessórios
Marcas
├── Nike
├── Adidas
└── Puma
Novidades
Promoções
```

**Arquivo:** `src/db/seed-menus.ts`

### 4. Seed de Produtos

**Comando:**
```bash
npm run seed:products
```

**O que cria:**
- Marcas (Nike, Adidas, Puma, etc.)
- Cores (Preto, Branco, Vermelho, etc.)
- Tamanhos (P, M, G, GG, 38, 39, 40, etc.)
- Produtos completos com:
  - Múltiplas variantes (cores)
  - Múltiplos tamanhos por variante
  - Preços em centavos
  - Estoque
  - Imagens

**Exemplos de produtos:**
- Tênis Nike Air Max
- Camiseta Adidas Trefoil
- Chuteira Puma Future
- Jaqueta Nike Windrunner
- Mochila Adidas Classic

**Arquivo:** `src/db/seed.ts`

---

## 🎨 Personalizando Seeds

### Adicionar Novas Categorias

Edite `src/db/seed-categories.ts`:

```typescript
const categories = [
  {
    name: "Eletrônicos", // Nova categoria
    slug: "eletronicos",
    parentId: null,
  },
  // ... outras categorias
];
```

### Adicionar Novos Produtos

Edite `src/db/seed.ts`:

```typescript
const products = [
  {
    name: "Seu Produto",
    slug: "seu-produto",
    description: "Descrição do produto",
    categoryId: 1, // ID da categoria
    subcategoryId: 2, // ID da subcategoria (opcional)
    brandId: 1, // ID da marca
    gender: "unisex", // "men" | "women" | "unisex"
  },
  // ... outros produtos
];
```

### Adicionar Novas Coleções

Edite `src/db/seed-collections.ts`:

```typescript
const customCollections = [
  {
    name: "Winter Collection",
    slug: "winter-collection",
    type: "sport" as const,
    description: "Produtos para o inverno",
    isActive: true,
  },
];

await db.insert(collectionsTable).values(customCollections);
```

### Alterar Preços

Os preços são em centavos:

```typescript
priceInCents: 29990  // R$ 299,90
priceInCents: 15000  // R$ 150,00
priceInCents: 9999   // R$ 99,99
```

### Alterar Estoque

```typescript
stock: 10  // 10 unidades disponíveis
stock: 0   // Sem estoque
stock: 100 // 100 unidades
```

---

## 🔧 Executando Programaticamente

### Seed Completo em JavaScript

```typescript
import { execSync } from "child_process";

// Limpar e popular
execSync("npm run db:clear", { stdio: "inherit" });
execSync("npm run db:seed", { stdio: "inherit" });

console.log("✅ Banco populado com sucesso!");
```

### Seed Customizado

```typescript
// src/db/my-custom-seed.ts

import { db } from "./index";
import { productsTable } from "./schema";

async function customSeed() {
  console.log("🌱 Iniciando seed customizado...");

  await db.insert(productsTable).values([
    {
      name: "Produto Custom",
      slug: "produto-custom",
      description: "Descrição",
      categoryId: 1,
      brandId: 1,
      gender: "unisex",
    },
  ]);

  console.log("✅ Seed customizado concluído!");
}

customSeed().catch(console.error);
```

Execute com:
```bash
npx tsx src/db/my-custom-seed.ts
```

---

## 🛠️ Troubleshooting

### Erro: "relation does not exist"

**Problema:** Tabelas não foram criadas.

**Solução:**
```bash
npx drizzle-kit push
```

### Erro: "duplicate key value violates unique constraint"

**Problema:** Dados já existem no banco.

**Solução:**
```bash
npm run db:clear    # Limpar banco
npm run db:seed     # Popular novamente
```

### Erro: "Cannot read properties of undefined"

**Problema:** Ordem incorreta dos seeds (dependências não criadas).

**Solução:** Use `npm run db:seed` que executa na ordem correta.

### Seed muito lento

**Problema:** Muitas inserções individuais.

**Solução:** Use inserções em batch:

```typescript
// ❌ Lento
for (const product of products) {
  await db.insert(productsTable).values(product);
}

// ✅ Rápido
await db.insert(productsTable).values(products);
```

### Erro de conexão com banco

**Problema:** PostgreSQL não está rodando.

**Solução:**
```bash
docker compose up -d
```

Verifique se está rodando:
```bash
docker compose ps
```

---

## 📊 Estatísticas dos Seeds

Após rodar `npm run db:seed`, você terá aproximadamente:

| Tabela | Quantidade |
|--------|-----------|
| Categorias | 10-15 |
| Marcas | 5-10 |
| Cores | 10-15 |
| Tamanhos | 10-15 |
| Produtos | 20-50 |
| Variantes | 50-150 |
| Tamanhos por Variante | 200-500 |
| Coleções | 9 |
| Menus | 20-30 |

---

## 🚀 Próximos Passos

Após popular o banco:

1. **Inicie o servidor**: `npm run dev`
2. **Acesse**: http://localhost:3000
3. **Teste a navegação**: Use os menus para navegar
4. **Visualize produtos**: Acesse categorias e produtos
5. **Teste a sacola**: Adicione produtos ao carrinho

---

## 📚 Recursos Adicionais

- [Estrutura do Banco](../architecture/database-schema.md)
- [Sistema de Menus](../features/menus-system.md)
- [Sistema de Coleções](../features/collections.md)

---

**Última atualização:** Novembro 2025
