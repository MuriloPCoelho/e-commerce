# E-commerce Next.js Project

Este projeto é um e-commerce desenvolvido com [Next.js](https://nextjs.org), banco de dados PostgreSQL via Docker, e utiliza o ORM [Drizzle](https://orm.drizzle.team/).

## E-commerce (Next.js + Drizzle + PostgreSQL)

Este repositório contém um e-commerce construído com Next.js (App Router), usando PostgreSQL como banco de dados e Drizzle ORM para mapeamento. O projeto inclui scripts para seed do banco, autenticação via `better-auth` e um conjunto inicial de páginas/components.

### Stack principal

- Next.js  (React 19)
- PostgreSQL (via Docker)
- Drizzle ORM + drizzle-kit
- better-auth (autenticação com providers sociais e email/password)
- TypeScript, Tailwind CSS

## Começando (em 5 minutos)

Pré-requisitos:

- Node.js (>=18 recomendado)
- Docker & Docker Compose (para rodar o Postgres localmente)

1) Instale dependências:

```bash
npm install
```

2) Copie o exemplo de variáveis de ambiente e ajuste conforme necessário (crie `.env` na raiz):

Exemplo mínimo (`.env`):

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=ecommerce
POSTGRES_PORT=5432
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecommerce
NODE_ENV=development
PORT=3000
# Variáveis opcionais para login social
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Observação: o `DATABASE_URL` é usado pelo Drizzle e pelos scripts. No `docker-compose.yml` o mapeamento de portas é `5432:5432` (host:container). Ajuste `POSTGRES_PORT` se necessário.

3) Suba o banco de dados com Docker Compose:

```bash
docker compose up -d
```

4) Rode o seed (popula categorias, produtos, cores, tamanhos e marcas):

```bash
npm run seed
```

5) Inicie a aplicação em modo desenvolvimento:

```bash
npm run dev
```

Abra http://localhost:3000 no navegador.

## Scripts úteis

- `npm run dev` — inicia Next.js em modo desenvolvimento
- `npm run build` — build para produção
- `npm run start` — inicia o build em produção
- `npm run lint` — executa o lint
- `npm run seed` — executa `src/db/seed.ts` para popular o banco (usa `tsx` e o `.env`)
- `npm run clear-db` — (local) reseta o schema public do Postgres (via docker compose exec)

## Banco de dados e schema

Arquivos importantes:

- `drizzle.config.ts` — configuração do drizzle-kit
- `src/db/schema.ts` — definição das tabelas (users, sessions, accounts, verifications, categories, products, product_variants, colors, sizes, brands, etc.)
- `src/db/seed.ts` — script de seed que popula dados de exemplo (produtos, categorias, variantes, cores, tamanhos, marcas)

O projeto usa `process.env.DATABASE_URL` para conectar ao banco. Certifique-se de configurar essa variável no `.env`.

Tabelas relevantes:

- `user`, `session`, `account`, `verification` — usadas por `better-auth` (veja `src/lib/auth.ts`).
- `tb_categories`, `tb_products`, `tb_product_variants`, `tb_product_variant_sizes`, `tb_colors`, `tb_sizes`, `tb_brands` — modelo de produtos e estoque.

## Autenticação

O sistema de autenticação usa `better-auth` com um adaptador Drizzle (`better-auth/adapters/drizzle`). A configuração está em `src/lib/auth.ts` e suporta:

- Email + senha
- Google OAuth (se `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` estiverem definidos)

As tabelas para autenticação são gerenciadas pelo schema do Drizzle (`user`, `session`, `account`, `verification`).

## Estrutura do projeto (resumida)

- `src/app/` — rotas e páginas (Next.js App Router)
	- `api/auth/[...all]/route.ts` — endpoints de autenticação
	- `products`, `category`, `sign-in`, `sign-up` — páginas do e-commerce
- `src/components/` — componentes UI e comuns (header, cards, forms)
- `src/db/` — conexão, schema e seed
- `src/lib/` — utilitários, auth client, helpers

## Desenvolvimento e dicas

- Para ajustar o schema e gerar migrations use `drizzle-kit` (configuração em `drizzle.config.ts`).
- O seed define imagens de exemplo, variações, preços (em centavos) e estoque; pode ser customizado no `src/db/seed.ts`.
- Execute `npm run clear-db` com cuidado — ele remove todo o conteúdo do schema `public` do Postgres (usa `docker compose exec`).

## Contribuição

Contribuições são bem-vindas. Boas próximas tarefas:

- Adicionar testes automatizados (unit + e2e)
- CI (GitHub Actions) para lint, build e testes
- Documentar a API (OpenAPI / Swagger) para os endpoints REST
- Implementar páginas de admin para gerenciar produtos e pedidos
- Substituir ESlint e Prettier por Biome

Por favor abra issues e PRs com descrições claras e pequenos commits.

## Licença

Este projeto está licenciado sob os termos do arquivo `LICENSE` (ver repositório).

