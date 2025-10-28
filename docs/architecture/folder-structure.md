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
├── seed.ts                    # Seed de produtos
├── seed-menus.ts             # Seed de menus
└── clear-menus.ts            # Limpar menus
```

**Tabelas do Schema:**
- `user`, `session`, `account`, `verification` (Better Auth)
- `tb_categories`, `tb_brands` (Catálogo)
- `tb_products`, `tb_product_variants`, `tb_product_variant_sizes`
- `tb_colors`, `tb_sizes`
- `tb_bags`, `tb_bag_items` (Carrinho)
- `tb_menus` (Navegação)
- `tb_user_addresses` (Endereços)

#### `/src/actions` - Server Actions

```
src/actions/
├── add-bag-product/
│   ├── index.ts              # Action para adicionar à sacola
│   └── schema.ts             # Validação Zod
├── get-bag/
│   └── index.ts              # Action para buscar sacola
└── get-menus/
    └── index.ts              # Action para buscar menus
```

**Nota:** Estamos migrando para o padrão Repository. Veja `/src/repositories`.

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
├── auth.ts                    # Configuração Better Auth
├── auth-client.ts             # Cliente de autenticação
├── getCurrentUser.ts          # Helper para usuário atual
└── utils.ts                   # Funções utilitárias
```

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
