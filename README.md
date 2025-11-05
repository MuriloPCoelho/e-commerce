# 🛍️ E-commerce Next.js# 🛍️ E-commerce Next.js



> E-commerce moderno e escalável desenvolvido com Next.js 15, PostgreSQL e Drizzle ORM.> E-commerce moderno e escalável desenvolvido com Next.js 15, PostgreSQL e Drizzle ORM.



[![Next.js](https://img.shields.io/badge/Next.js-15.4-black?logo=next.js)](https://nextjs.org)[![Next.js](https://img.shields.io/badge/Next.js-15.4-black?logo=next.js)](https://nextjs.org)

[![React](https://img.shields.io/badge/React-19.1-blue?logo=react)](https://reactjs.org)[![React](https://img.shields.io/badge/React-19.1-blue?logo=react)](https://reactjs.org)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue?logo=postgresql)](https://www.postgresql.org/)[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue?logo=postgresql)](https://www.postgresql.org/)

[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-green)](https://orm.drizzle.team/)[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-green)](https://orm.drizzle.team/)



## 📚 Documentação## 📚 Documentação



**📖 [Acesse a documentação completa em `/docs`](./docs/README.md)****📖 [Acesse a documentação completa em `/docs`](./docs/README.md)**



### Links Rápidos### Links Rápidos



- **🚀 [Guia de Instalação](./docs/getting-started/installation.md)** - Configure o ambiente completo- **🚀 [Guia de Instalação](./docs/getting-started/installation.md)** - Configure o ambiente completo

- **⚡ [Quick Start (5 minutos)](./docs/getting-started/quick-start.md)** - Comece rapidamente- **⚡ [Quick Start (5 minutos)](./docs/getting-started/quick-start.md)** - Comece rapidamente

- **📱 [Sistema de Menus](./docs/features/menus-system.md)** - Navegação hierárquica avançada- **📱 [Sistema de Menus](./docs/features/menus-system.md)** - Navegação hierárquica avançada

- **🎨 [Collections](./docs/features/collections.md)** - Coleções de produtos (Sport, Lifestyle, Promoções)- **🎨 [Collections](./docs/features/collections.md)** - Coleções de produtos (Sport, Lifestyle, Promoções)

- **🛒 [Sacola de Compras](./docs/features/shopping-bag.md)** - Sistema de carrinho de compras- **🛒 [Sacola de Compras](./docs/features/shopping-bag.md)** - Sistema de carrinho de compras

- **📁 [Estrutura de Pastas](./docs/architecture/folder-structure.md)** - Organização do projeto- **📁 [Estrutura de Pastas](./docs/architecture/folder-structure.md)** - Organização do projeto



------



## ✨ Sobre o Projeto## ✨ Sobre o Projeto



Este é um e-commerce completo e moderno desenvolvido com as melhores práticas e tecnologias atuais. O projeto inclui:Este é um e-commerce completo e moderno desenvolvido com as melhores práticas e tecnologias atuais. O projeto inclui:



- ✅ Sistema de autenticação completo (email/senha + OAuth)- ✅ Sistema de autenticação completo (email/senha + OAuth)

- ✅ Catálogo de produtos com variantes (cores e tamanhos)- ✅ Catálogo de produtos com variantes (cores e tamanhos)

- ✅ Sistema de navegação hierárquica por menus- ✅ Sistema de navegação hierárquica por menus

- ✅ Coleções de produtos (Sport, Lifestyle, Promoções)- ✅ Coleções de produtos (Sport, Lifestyle, Promoções)

- ✅ Sacola de compras com gerenciamento de itens- ✅ Sacola de compras com gerenciamento de itens

- ✅ Filtros avançados de produtos- ✅ Filtros avançados de produtos

- ✅ Sistema de marcas e categorias- ✅ Sistema de marcas e categorias

- ✅ Design responsivo e moderno- ✅ Design responsivo e moderno



### 🛠️ Stack Tecnológica### 🛠️ Stack Tecnológica



- **Framework:** Next.js 15 (App Router) + React 19- **Framework:** Next.js 15 (App Router) + React 19

- **Banco de Dados:** PostgreSQL (via Docker)- **Banco de Dados:** PostgreSQL (via Docker)

- **ORM:** Drizzle ORM + drizzle-kit- **ORM:** Drizzle ORM + drizzle-kit

- **Autenticação:** Better Auth (OAuth + Email/Senha)- **Autenticação:** Better Auth (OAuth + Email/Senha)

- **UI:** Tailwind CSS + shadcn/ui- **UI:** Tailwind CSS + shadcn/ui

- **Linguagem:** TypeScript- **Linguagem:** TypeScript

- **Validação:** Zod- **Validação:** Zod

- **State Management:** React Query (TanStack Query)- **State Management:** React Query (TanStack Query)



---## ⚡ Começando (em 5 minutos)



## ⚡ Começando (em 5 minutos)### Pré-requisitos



### Pré-requisitos- **Node.js** >= 18.x ([Download](https://nodejs.org/))

- **Docker** & **Docker Compose** ([Download](https://www.docker.com/))

- **Node.js** >= 18.x ([Download](https://nodejs.org/))- **Git** ([Download](https://git-scm.com/))

- **Docker** & **Docker Compose** ([Download](https://www.docker.com/))

- **Git** ([Download](https://git-scm.com/))### Instalação Rápida



### Instalação Rápida1️⃣ **Clone o repositório:**



1️⃣ **Clone o repositório:**```bash

git clone https://github.com/MuriloPCoelho/e-commerce.git

```bashcd e-commerce

git clone https://github.com/MuriloPCoelho/e-commerce.git```

cd e-commerce

```2️⃣ **Instale as dependências:**



2️⃣ **Instale as dependências:**```bash

npm install

```bash```

npm install

```3️⃣ **Configure as variáveis de ambiente:**



3️⃣ **Configure as variáveis de ambiente:**Crie um arquivo `.env` na raiz do projeto:



Crie um arquivo `.env` na raiz do projeto:```env

# Database

```envPOSTGRES_USER=postgres

# DatabasePOSTGRES_PASSWORD=postgres

POSTGRES_USER=postgresPOSTGRES_DB=ecommerce

POSTGRES_PASSWORD=postgresPOSTGRES_PORT=5432

POSTGRES_DB=ecommerceDATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecommerce

POSTGRES_PORT=5432

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecommerce# Application

NODE_ENV=development

# ApplicationPORT=3000

NODE_ENV=development

PORT=3000# Better Auth

BETTER_AUTH_SECRET=your-secret-key-here

# Better AuthBETTER_AUTH_URL=http://localhost:3000

BETTER_AUTH_SECRET=your-secret-key-here

BETTER_AUTH_URL=http://localhost:3000# OAuth Providers (opcional)

GOOGLE_CLIENT_ID=your-google-client-id

# OAuth Providers (opcional)GOOGLE_CLIENT_SECRET=your-google-client-secret

GOOGLE_CLIENT_ID=your-google-client-id```

GOOGLE_CLIENT_SECRET=your-google-client-secret

```> 💡 **Dica:** Gere o `BETTER_AUTH_SECRET` com:

> ```bash

> 💡 **Dica:** Gere o `BETTER_AUTH_SECRET` com:> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

> ```bash> ```

> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

> ```4️⃣ **Inicie o banco de dados:**



4️⃣ **Inicie o banco de dados:**```bash

docker compose up -d

```bash```

docker compose up -d

```5️⃣ **Popule o banco com dados de exemplo:**



5️⃣ **Popule o banco com dados de exemplo:**```bash

npm run db:seed

```bash```

npm run db:seed

```Este comando irá criar:

- ✅ Categorias e subcategorias

Este comando irá criar:- ✅ Marcas de produtos

- ✅ Categorias e subcategorias- ✅ Cores e tamanhos

- ✅ Marcas de produtos- ✅ Produtos com variantes

- ✅ Cores e tamanhos- ✅ Coleções (Sport, Lifestyle, Promoções)

- ✅ Produtos com variantes- ✅ Sistema de menus hierárquicos

- ✅ Coleções (Sport, Lifestyle, Promoções)

- ✅ Sistema de menus hierárquicos6️⃣ **Inicie a aplicação:**



6️⃣ **Inicie a aplicação:**```bash

npm run dev

```bash```

npm run dev

```Abra [http://localhost:3000](http://localhost:3000) no navegador! 🎉



Abra [http://localhost:3000](http://localhost:3000) no navegador! 🎉---



---## 📦 Scripts Disponíveis



## 📦 Scripts Disponíveis### Desenvolvimento



### Desenvolvimento```bash

npm run dev          # Inicia o servidor de desenvolvimento

```bashnpm run build        # Gera build de produção

npm run dev          # Inicia o servidor de desenvolvimentonpm run start        # Inicia o servidor de produção

npm run build        # Gera build de produçãonpm run lint         # Executa o linter

npm run start        # Inicia o servidor de produção```

npm run lint         # Executa o linter

```### Banco de Dados



### Banco de Dados```bash

npm run db:seed      # Popula o banco com dados completos

```bashnpm run db:clear     # Limpa todas as tabelas do banco

npm run db:seed      # Popula o banco com dados completosnpm run db:reset     # Limpa e repopula o banco (clear + seed)

npm run db:clear     # Limpa todas as tabelas do banco```

npm run db:reset     # Limpa e repopula o banco (clear + seed)

```### Seeds Específicos



### Seeds Específicos```bash

npm run seed:categories   # Popula apenas categorias

```bashnpm run seed:collections  # Popula apenas coleções

npm run seed:categories   # Popula apenas categoriasnpm run seed:menus        # Popula apenas menus

npm run seed:collections  # Popula apenas coleçõesnpm run seed:products     # Popula apenas produtos

npm run seed:menus        # Popula apenas menus```

npm run seed:products     # Popula apenas produtos

```---



---## 🗄️ Estrutura do Banco de Dados



## 🗄️ Estrutura do Banco de DadosO projeto utiliza PostgreSQL com as seguintes tabelas principais:



O projeto utiliza PostgreSQL com as seguintes tabelas principais:### Autenticação

- `user` - Usuários do sistema

### Autenticação- `session` - Sessões ativas

- `user` - Usuários do sistema- `account` - Contas OAuth

- `session` - Sessões ativas- `verification` - Tokens de verificação

- `account` - Contas OAuth

- `verification` - Tokens de verificação### Catálogo

- `tb_categories` - Categorias e subcategorias (hierárquicas)

### Catálogo- `tb_brands` - Marcas de produtos

- `tb_categories` - Categorias e subcategorias (hierárquicas)- `tb_products` - Produtos principais

- `tb_brands` - Marcas de produtos- `tb_product_variants` - Variantes (cores) de produtos

- `tb_products` - Produtos principais- `tb_product_variant_sizes` - Tamanhos disponíveis por variante

- `tb_product_variants` - Variantes (cores) de produtos- `tb_colors` - Cores disponíveis

- `tb_product_variant_sizes` - Tamanhos disponíveis por variante- `tb_sizes` - Tamanhos disponíveis

- `tb_colors` - Cores disponíveis

- `tb_sizes` - Tamanhos disponíveis### Coleções

- `tb_collections` - Coleções (Sport, Lifestyle, Promoções)

### Coleções- `tb_product_collections` - Relação produtos ↔ coleções

- `tb_collections` - Coleções (Sport, Lifestyle, Promoções)

- `tb_product_collections` - Relação produtos ↔ coleções### Navegação

- `tb_menus` - Sistema de menus hierárquicos

### Navegação

- `tb_menus` - Sistema de menus hierárquicos### Carrinho

- `tb_bags` - Sacolas de compras dos usuários

### Carrinho- `tb_bag_items` - Itens na sacola

- `tb_bags` - Sacolas de compras dos usuários

- `tb_bag_items` - Itens na sacola### Endereços

- `tb_user_addresses` - Endereços de entrega dos usuários

### Endereços

- `tb_user_addresses` - Endereços de entrega dos usuários---



---## 🏗️ Arquitetura do Projeto



## 🏗️ Arquitetura do Projeto```

e-commerce/

```├── src/

e-commerce/│   ├── actions/          # Server Actions (Next.js)

├── src/│   ├── app/              # Rotas e páginas (App Router)

│   ├── actions/          # Server Actions (Next.js)│   ├── components/       # Componentes React

│   ├── app/              # Rotas e páginas (App Router)│   │   ├── commom/       # Componentes de negócio

│   ├── components/       # Componentes React│   │   └── ui/           # Componentes UI (shadcn/ui)

│   │   ├── commom/       # Componentes de negócio│   ├── db/               # Configuração do banco + seeds

│   │   └── ui/           # Componentes UI (shadcn/ui)│   ├── lib/              # Utilitários e helpers

│   ├── db/               # Configuração do banco + seeds│   └── providers/        # Context Providers (React Query, etc)

│   ├── lib/              # Utilitários e helpers├── docs/                 # Documentação completa

│   └── providers/        # Context Providers (React Query, etc)├── migrations/           # Migrations do Drizzle

├── docs/                 # Documentação completa└── public/              # Arquivos estáticos

├── migrations/           # Migrations do Drizzle```

└── public/              # Arquivos estáticos

```### Principais Funcionalidades



### Principais Funcionalidades#### 🔐 Autenticação (Better Auth)

- Login com email/senha

#### 🔐 Autenticação (Better Auth)- OAuth (Google, GitHub, etc)

- Login com email/senha- Gerenciamento de sessões

- OAuth (Google, GitHub, etc)- Proteção de rotas

- Gerenciamento de sessões

- Proteção de rotas#### 📱 Sistema de Menus

- Navegação hierárquica (níveis ilimitados)

#### 📱 Sistema de Menus- Menus dinâmicos baseados em categorias, marcas ou coleções

- Navegação hierárquica (níveis ilimitados)- Drawer lateral com animações suaves

- Menus dinâmicos baseados em categorias, marcas ou coleções- Integração com ícones (Lucide React)

- Drawer lateral com animações suaves

- Integração com ícones (Lucide React)#### 🎨 Sistema de Coleções

- Coleções de produtos organizadas por tema:

#### 🎨 Sistema de Coleções  - **Sport**: Produtos esportivos

- Coleções de produtos organizadas por tema:  - **Lifestyle**: Moda casual e lifestyle

  - **Sport**: Produtos esportivos  - **Promotion**: Produtos em promoção

  - **Lifestyle**: Moda casual e lifestyle- Produtos podem pertencer a múltiplas coleções

  - **Promotion**: Produtos em promoção

- Produtos podem pertencer a múltiplas coleções#### 🛒 Sacola de Compras

- Adicionar/remover produtos

#### 🛒 Sacola de Compras- Gerenciamento de quantidade

- Adicionar/remover produtos- Seleção de tamanhos e cores

- Gerenciamento de quantidade- Persistência por usuário

- Seleção de tamanhos e cores

- Persistência por usuário#### 🔍 Sistema de Filtros

- Filtros por categoria, marca, cor, tamanho

#### 🔍 Sistema de Filtros- Filtros por faixa de preço

- Filtros por categoria, marca, cor, tamanho- URLs amigáveis para SEO

- Filtros por faixa de preço- Filtros combinados

- URLs amigáveis para SEO

- Filtros combinados---



---## 🎯 Recursos Destacados



## 🎯 Recursos Destacados### ✨ Modern UI/UX

- Design responsivo (mobile-first)

### ✨ Modern UI/UX- Animações suaves e transições

- Design responsivo (mobile-first)- Componentes acessíveis (shadcn/ui)

- Animações suaves e transições- Dark mode ready

- Componentes acessíveis (shadcn/ui)

- Dark mode ready### ⚡ Performance

- Server-side rendering (SSR)

### ⚡ Performance- Static generation quando possível

- Server-side rendering (SSR)- Imagens otimizadas

- Static generation quando possível- Code splitting automático

- Imagens otimizadas

- Code splitting automático### 🧪 Qualidade de Código

- TypeScript em todo o projeto

### 🧪 Qualidade de Código- Validação com Zod

- TypeScript em todo o projeto- ESLint configurado

- Validação com Zod- Estrutura organizada e escalável

- ESLint configurado

- Estrutura organizada e escalável---



---Tabelas relevantes:



## 📖 Documentação Completa- `user`, `session`, `account`, `verification` — usadas por `better-auth` (veja `src/lib/auth.ts`).

- `tb_categories`, `tb_products`, `tb_product_variants`, `tb_product_variant_sizes`, `tb_colors`, `tb_sizes`, `tb_brands` — modelo de produtos e estoque.

Para informações mais detalhadas, consulte a documentação em [`/docs`](./docs/README.md):

## Autenticação

### 🚀 Getting Started

- [Guia de Instalação Completo](./docs/getting-started/installation.md)O sistema de autenticação usa `better-auth` com um adaptador Drizzle (`better-auth/adapters/drizzle`). A configuração está em `src/lib/auth.ts` e suporta:

- [Quick Start (5 minutos)](./docs/getting-started/quick-start.md)

- [Variáveis de Ambiente](./docs/getting-started/environment.md)- Email + senha

- Google OAuth (se `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` estiverem definidos)

### ✨ Funcionalidades

- [Sistema de Menus Hierárquicos](./docs/features/menus-system.md)As tabelas para autenticação são gerenciadas pelo schema do Drizzle (`user`, `session`, `account`, `verification`).

- [Sistema de Coleções](./docs/features/collections.md)

- [Sacola de Compras](./docs/features/shopping-bag.md)## Estrutura do projeto (resumida)

- [Autenticação](./docs/features/authentication.md)

- `src/app/` — rotas e páginas (Next.js App Router)

### 🏗️ Arquitetura	- `api/auth/[...all]/route.ts` — endpoints de autenticação

- [Estrutura de Pastas](./docs/architecture/folder-structure.md)	- `products`, `category`, `sign-in`, `sign-up` — páginas do e-commerce

- [Schema do Banco de Dados](./docs/architecture/database-schema.md)- `src/components/` — componentes UI e comuns (header, cards, forms)

- [Padrão Repository](./docs/architecture/repository-pattern.md)- `src/db/` — conexão, schema e seed

- `src/lib/` — utilitários, auth client, helpers

### 📖 Guias Práticos- `src/repositories/` — Data Access Layer com padrão Repository

- [Como Adicionar Produtos](./docs/guides/adding-products.md)

- [Como Criar Menus](./docs/guides/creating-menus.md)## 📚 Documentação Adicional

- [Scripts de Seed](./docs/guides/seeding-data.md)

Este projeto possui documentação detalhada em arquivos separados:

---

### � [Documentação Completa em `/docs`](./docs/)

## 🛠️ Dicas de Desenvolvimento

A documentação está organizada em:

### Migrations e Schema- **Getting Started** - Instalação, configuração e quick start

- Use `drizzle-kit push` para atualizar o schema do banco- **Features** - Funcionalidades do sistema (menus, auth, produtos)

- Use `drizzle-kit generate` para gerar migrations- **Architecture** - Estrutura técnica e padrões de design

- Configuração em `drizzle.config.ts`- **Guides** - Tutoriais práticos e exemplos

- **Testing** - Estratégias e ferramentas de teste

### Customização

- Imagens, variações e preços podem ser customizados nos scripts de seed**Links diretos:**

- Adicione novos produtos em `src/db/seed.ts`- [📱 Sistema de Menus](./docs/features/menus-system.md) - Navegação hierárquica completa

- Configure menus personalizados em `src/db/seed-menus.ts`- [🗂️ Padrão Repository](./docs/architecture/repository-pattern.md) - Data Access Layer

- [📁 Estrutura de Pastas](./docs/architecture/folder-structure.md) - Organização do código

### Boas Práticas- [🧪 Estratégia de Testes](./docs/testing/strategy.md) - Como testar o projeto

- Use Server Actions para operações de escrita

- Valide inputs com Zod### Destaques das Funcionalidades

- Mantenha componentes pequenos e reutilizáveis

- Documente mudanças importantes#### 🎯 Sistema de Menus Dinâmico

- Menus configuráveis via banco de dados

---- Suporte a hierarquia (menus e submenus ilimitados)

- 3 tipos: Custom, Categoria e Marca

## 🤝 Contribuindo- Navegação por níveis similar a Amazon/Magazine Luiza

- Ícones dinâmicos do Lucide React

Contribuições são muito bem-vindas! Aqui estão algumas ideias:

#### 🗂️ Padrão Repository (DAL)

### Próximas Features- Acesso a dados centralizado e reutilizável

- [ ] Sistema de pedidos e checkout- Controle granular de quais colunas buscar

- [ ] Painel administrativo- Type-safety com TypeScript

- [ ] Sistema de avaliações de produtos- Fácil manutenção e teste

- [ ] Wishlist (lista de desejos)

- [ ] Sistema de cupons e descontos**Exemplo:**

- [ ] Testes automatizados (unit + e2e)```typescript

- [ ] CI/CD com GitHub Actionsimport { getCurrentUserBagWithItems, addProductToBag } from "@/repositories";



### Como Contribuir// Busca sacola com todos os itens e relações

const bag = await getCurrentUserBagWithItems();

1. Faça um fork do projeto

2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)// Adiciona produto à sacola

3. Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)await addProductToBag(productVariantSizeId);

4. Push para a branch (`git push origin feature/MinhaFeature`)```

5. Abra um Pull Request

## Desenvolvimento e dicas

---

- Para ajustar o schema e gerar migrations use `drizzle-kit` (configuração em `drizzle.config.ts`).

## 📝 Licença- O seed define imagens de exemplo, variações, preços (em centavos) e estoque; pode ser customizado no `src/db/seed.ts`.

- Execute `npm run clear-db` com cuidado — ele remove todo o conteúdo do schema `public` do Postgres (usa `docker compose exec`).

Este projeto está sob a licença especificada no arquivo [LICENSE](./LICENSE).

## Contribuição

---

Contribuições são bem-vindas. Boas próximas tarefas:

## 👨‍💻 Autor

- Adicionar testes automatizados (unit + e2e)

**Murilo Coelho**- CI (GitHub Actions) para lint, build e testes

- Documentar a API (OpenAPI / Swagger) para os endpoints REST

- GitHub: [@MuriloPCoelho](https://github.com/MuriloPCoelho)- Implementar páginas de admin para gerenciar produtos e pedidos

- Substituir ESlint e Prettier por Biome

---

Por favor abra issues e PRs com descrições claras e pequenos commits.

## 🙏 Agradecimentos

## Licença

- [Next.js](https://nextjs.org/) - Framework React

- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORMEste projeto está licenciado sob os termos do arquivo `LICENSE` (ver repositório).

- [Better Auth](https://www.better-auth.com/) - Sistema de autenticação

- [shadcn/ui](https://ui.shadcn.com/) - Componentes de UI
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Lucide React](https://lucide.dev/) - Ícones

---

<div align="center">

**Última atualização:** Novembro 2025

⭐ Se este projeto foi útil, considere dar uma estrela!

</div>
