# 📁 Estrutura de Pastas

Guia completo sobre a organização do projeto.

## 🗂️ Visão Geral

```
e-commerce/
├── .next/                      # Build do Next.js (gerado)
├── docs/                       # 📚 Documentação
├── migrations/                 # Migrations do Drizzle
├── node_modules/              # Dependências (gerado)
├── public/                    # Arquivos estáticos
├── src/                       # 💎 Código-fonte principal
│   ├── actions/              # Server Actions
│   ├── app/                  # Rotas (Next.js App Router)
│   ├── components/           # Componentes React
│   ├── db/                   # Banco de dados
│   ├── lib/                  # Utilitários
│   ├── providers/            # Providers (React Query, etc)
│   └── repositories/         # Data Access Layer
├── .env                       # Variáveis de ambiente
├── .gitignore                # Arquivos ignorados pelo Git
├── components.json           # Configuração shadcn/ui
├── docker-compose.yml        # Configuração Docker
├── Dockerfile                # Imagem Docker
├── drizzle.config.ts         # Configuração Drizzle ORM
├── eslint.config.mjs         # Configuração ESLint
├── next.config.ts            # Configuração Next.js
├── package.json              # Dependências do projeto
├── postcss.config.mjs        # Configuração PostCSS
├── README.md                 # Documentação principal
├── tailwind.config.ts        # Configuração Tailwind CSS
└── tsconfig.json             # Configuração TypeScript
```

---

## 📂 Detalhamento das Pastas

### `/src` - Código Fonte Principal

#### `/src/app` - Rotas (Next.js App Router)

```
src/app/
├── layout.tsx                 # Layout global
├── page.tsx                   # Página inicial (/)
├── globals.css               # Estilos globais
├── api/
│   └── auth/
│       └── [...all]/
│           └── route.ts      # Endpoints de autenticação
├── p/
│   └── [slug]/
│       ├── page.tsx          # Página de produto (/p/:slug)
│       └── components/       # Componentes específicos
│           ├── add-to-bag-button.tsx
│           ├── size-selector.tsx
│           └── variant-selector.tsx
├── products/
│   └── page.tsx              # Lista de produtos
├── sign-in/
│   └── page.tsx              # Página de login
├── sign-up/
│   └── page.tsx              # Página de cadastro
└── w/
    └── [slug]/
        └── page.tsx          # Página de categoria (/w/:slug)
```

**Convenções:**
- `page.tsx` = Rota renderizável
- `layout.tsx` = Layout compartilhado
- `[slug]` = Rota dinâmica
- `[...all]` = Catch-all route

#### `/src/components` - Componentes React

```
src/components/
├── commom/                    # Componentes comuns
│   ├── bag-item.tsx          # Item da sacola
│   ├── bag.tsx               # Drawer da sacola
│   ├── header.tsx            # Header global
│   ├── navigation-drawer.tsx # Menu lateral
│   ├── product-card.tsx      # Card de produto
│   ├── product-rating.tsx    # Avaliação de produto
│   └── quantity-selector.tsx # Seletor de quantidade
└── ui/                        # Componentes do shadcn/ui
    ├── accordion.tsx
    ├── button-group.tsx
    ├── button.tsx
    ├── form.tsx
    ├── input.tsx
    ├── label.tsx
    ├── separator.tsx
    ├── sheet.tsx
    ├── sonner.tsx
    └── spinner.tsx
```

**Convenções:**
- `commom/` = Componentes de negócio
- `ui/` = Componentes de interface (shadcn/ui)

#### `/src/db` - Banco de Dados

```
src/db/
├── index.ts                   # Conexão com o banco
├── schema.ts                  # Schema completo (Drizzle)
├── clear-db.ts                # Limpar banco de dados
├── seed-all.ts                # Seed completo (orquestrador)
├── seed.ts                    # Seed de produtos
├── seed-categories.ts         # Seed de categorias
├── seed-collections.ts        # Seed de coleções
└── seed-menus.ts              # Seed de menus
```

**Tabelas do Schema:**

**Autenticação (Better Auth):**
- `user` - Usuários
- `session` - Sessões
- `account` - Contas OAuth
- `verification` - Tokens de verificação

**Catálogo:**
- `tb_categories` - Categorias e subcategorias
- `tb_brands` - Marcas
- `tb_products` - Produtos principais
- `tb_product_variants` - Variantes (cores)
- `tb_product_variant_sizes` - Tamanhos por variante
- `tb_colors` - Cores disponíveis
- `tb_sizes` - Tamanhos disponíveis

**Coleções:**
- `tb_collections` - Coleções (Sport, Lifestyle, Promotion)
- `tb_product_collections` - Relação N:N produtos ↔ coleções

**Navegação:**
- `tb_menus` - Sistema de menus hierárquicos

**Carrinho:**
- `tb_bags` - Sacolas de compras
- `tb_bag_items` - Itens da sacola

**Endereços:**
- `tb_user_addresses` - Endereços de entrega

#### `/src/actions` - Server Actions

```
src/actions/
├── add-bag-product/
│   ├── index.ts              # Action para adicionar à sacola
│   └── schema.ts             # Validação Zod
├── get-bag/
│   └── index.ts              # Action para buscar sacola
├── get-filtered-products/
│   └── index.ts              # Action para buscar produtos com filtros
├── get-menus/
│   └── index.ts              # Action para buscar menus
└── remove-bag-product/
    └── index.ts              # Action para remover item da sacola
```

**Padrão:**
- Cada action em sua própria pasta
- `index.ts` contém a lógica
- `schema.ts` contém validações Zod (quando aplicável)
- Sempre com `"use server"` no topo

#### `/src/repositories` - Data Access Layer

```
src/repositories/
├── index.ts                   # Exports centralizados
├── bagRepository.tsx          # Operações com sacolas
├── bagItemRepository.tsx      # Operações com itens
├── productRepository.tsx      # Operações com produtos
├── userRepository.tsx         # Operações com usuários
└── menuRepository.tsx         # Operações com menus
```

**Padrão Repository:**
- Centraliza lógica de acesso a dados
- Controle granular de colunas
- Type-safe com TypeScript
- [Documentação completa](./repository-pattern.md)

#### `/src/lib` - Utilitários

```
src/lib/
├── auth.ts                    # Configuração Better Auth (servidor)
├── auth-client.ts             # Cliente de autenticação (browser)
├── filters.ts                 # Helpers para filtros de produtos
└── utils.ts                   # Funções utilitárias gerais (cn, etc)
```

**Principais funções:**
- `auth` - Instância do Better Auth
- `authClient` - Cliente para uso no navegador
- `parseFilters()` - Parse de filtros de URL
- `cn()` - Merge de classes CSS (clsx + tailwind-merge)

#### `/src/providers` - Context Providers

```
src/providers/
└── react-query.tsx            # Provider do React Query (TanStack Query)
```

**Providers implementados:**
- React Query para cache e state management
- Configurações de retry, stale time, etc.

---

## 📄 Arquivos na Raiz

### Configuração

#### `next.config.ts`
Configurações do Next.js:
- Imagens externas permitidas
- Redirects e rewrites
- Variáveis de ambiente públicas

#### `drizzle.config.ts`
Configurações do Drizzle ORM:
```typescript
export default {
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
};
```

#### `tsconfig.json`
Configurações do TypeScript:
- Path aliases (`@/*`)
- Strict mode habilitado
- JSX para React

#### `tailwind.config.ts`
Configurações do Tailwind CSS:
- Tema customizado
- Plugins (como shadcn/ui)
- Cores e espaçamentos

#### `components.json`
Configurações do shadcn/ui:
```json
{
  "style": "default",
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css"
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### Docker

#### `docker-compose.yml`
Configuração do PostgreSQL:
```yaml
services:
  db:
    image: postgres:latest
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: ecommerce
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

#### `Dockerfile`
Imagem Docker para produção (Next.js)

---

## 📚 Pasta `/docs`

```
docs/
├── README.md                      # Índice da documentação
├── getting-started/               # Primeiros passos
│   ├── installation.md
│   ├── quick-start.md
│   └── environment.md
├── features/                      # Funcionalidades
│   ├── menus-system.md
│   ├── collections.md
│   ├── shopping-bag.md
│   ├── authentication.md
│   └── products.md
├── architecture/                  # Arquitetura
│   ├── folder-structure.md        # Este arquivo
│   ├── database-schema.md
│   └── repository-pattern.md
├── guides/                        # Guias práticos
│   ├── creating-menus.md
│   ├── adding-products.md
│   ├── collections-setup.md
│   ├── seeding-data.md
│   └── customization.md
└── testing/
    └── strategy.md
```

---

#### `/src/providers` - Providers React

```
src/providers/
└── react-query.tsx            # Provider do TanStack Query
```

---

### `/docs` - Documentação

```
docs/
├── README.md                  # Índice da documentação
├── getting-started/
│   ├── installation.md        # Guia de instalação
│   ├── quick-start.md         # Quick start (5 min)
│   └── environment.md         # Variáveis de ambiente
├── features/
│   ├── menus-system.md        # Sistema de menus
│   ├── authentication.md      # Autenticação
│   ├── products.md            # Gerenciamento de produtos
│   └── shopping-bag.md        # Sacola de compras
├── architecture/
│   ├── folder-structure.md    # Este arquivo
│   ├── database-schema.md     # Schema do banco
│   └── repository-pattern.md  # Padrão Repository
├── guides/
│   ├── creating-menus.md      # Como criar menus
│   ├── adding-products.md     # Como adicionar produtos
│   ├── customization.md       # Customização da UI
│   └── seeding-data.md        # Scripts de seed
└── testing/
    └── strategy.md            # Estratégia de testes
```

---

### `/public` - Arquivos Estáticos

```
public/
├── favicon.ico
├── images/
└── [outros arquivos estáticos]
```

**Acesso:**
- Arquivos em `/public` são acessíveis via URL raiz
- Exemplo: `/public/logo.png` → `http://localhost:3000/logo.png`

---

### `/migrations` - Migrations do Banco

```
migrations/
└── sql/
    └── [arquivos .sql gerados pelo Drizzle Kit]
```

**Geração:**
```bash
npx drizzle-kit generate
```

**Aplicação:**
```bash
npx drizzle-kit push
```

---

## 🎯 Convenções de Nomenclatura

### Arquivos e Pastas

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Componente React | PascalCase | `ProductCard.tsx` |
| Utilitários | camelCase | `getCurrentUser.ts` |
| Rotas (App Router) | kebab-case | `sign-in/` |
| Arquivos de configuração | kebab-case | `drizzle.config.ts` |

### Código

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Componente | PascalCase | `export default function ProductCard()` |
| Função | camelCase | `export function getCurrentUser()` |
| Constante | UPPER_SNAKE_CASE | `const MAX_ITEMS = 10` |
| Tipo/Interface | PascalCase | `interface User { }` |

---

## 📦 Organização por Feature

Para features complexas, agrupe por funcionalidade:

```
src/app/checkout/              # Feature: Checkout
├── page.tsx                   # Página principal
├── layout.tsx                 # Layout específico
├── components/                # Componentes locais
│   ├── payment-form.tsx
│   └── order-summary.tsx
├── actions/                   # Actions locais
│   └── process-order.ts
└── types.ts                   # Tipos locais
```

---

## 🚀 Importações

### Aliases Configurados

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Uso

```typescript
// ❌ Evite caminhos relativos longos
import { Button } from "../../../components/ui/button";

// ✅ Use alias
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { getCurrentUser } from "@/lib/getCurrentUser";
```

---

## 📝 Arquivos de Configuração

### `package.json`
- Dependências do projeto
- Scripts npm
- Metadados do projeto

### `tsconfig.json`
- Configuração TypeScript
- Paths aliases
- Opções de compilação

### `next.config.ts`
- Configuração Next.js
- Redirects, rewrites
- Variables de ambiente públicas

### `tailwind.config.ts`
- Configuração Tailwind CSS
- Tema customizado
- Plugins

### `drizzle.config.ts`
- Configuração Drizzle ORM
- Conexão com o banco
- Migrations

### `eslint.config.mjs`
- Regras de lint
- Plugins
- Configurações por tipo de arquivo

---

## 🔒 Arquivos Sensíveis

Nunca commitar:
- ✅ `.env` (no `.gitignore`)
- ✅ `node_modules/`
- ✅ `.next/`
- ✅ `dist/`, `build/`

Commitar:
- ✅ `.env.example` (template sem valores reais)
- ✅ Todos os arquivos de configuração
- ✅ Documentação

---

## 🎓 Próximos Passos

- [Database Schema](./database-schema.md) - Estrutura do banco
- [Repository Pattern](./repository-pattern.md) - DAL
- [Quick Start](../getting-started/quick-start.md) - Comece a desenvolver

---

**📅 Última atualização:** Outubro 2025  
**📌 Versão:** 1.0
