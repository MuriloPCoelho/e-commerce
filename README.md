# E-commerce Next.js Project

Este projeto é um e-commerce desenvolvido com [Next.js](https://nextjs.org), banco de dados PostgreSQL via Docker, e utiliza o ORM [Drizzle](https://orm.drizzle.team/).

## Tecnologias Utilizadas

- Next.js
- PostgreSQL (via Docker)
- Drizzle ORM
- Docker Compose

## Como rodar o projeto

### 1. Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto (já existe um exemplo configurado):

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=ecommerce
POSTGRES_PORT=5432
NODE_ENV=development
PORT=3000
```

### 2. Subindo o banco de dados

Certifique-se de que o Docker está instalado e rodando. Para subir o banco:

```bash
docker compose up -d
```

O banco estará disponível na porta **5433** do host.

### 3. Instalando dependências

```bash
npm install
```

### 4. Rodando a aplicação

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## Scripts úteis

- `npm run dev`: inicia o servidor Next.js em modo desenvolvimento
- `docker compose up -d`: sobe o banco de dados PostgreSQL

## Estrutura do Projeto

- `src/app/` — código principal da aplicação
- `docker-compose.yml` — orquestração do banco de dados
- `Dockerfile` — build da aplicação Next.js
- `.env` — variáveis de ambiente

## Observações

- O banco de dados PostgreSQL está configurado para rodar na porta **5433** do host (evita conflito com outras instâncias locais).
- O projeto utiliza Drizzle ORM para integração com o banco.

---

> Projeto inicializado com [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
