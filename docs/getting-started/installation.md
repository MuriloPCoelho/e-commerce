# 🚀 Instalação e Configuração

Guia completo para configurar o ambiente de desenvolvimento.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** >= 18.x ([Download](https://nodejs.org/))
- **Docker** e **Docker Compose** ([Download](https://www.docker.com/))
- **Git** ([Download](https://git-scm.com/))

## 📥 1. Clonar o Repositório

```bash
git clone https://github.com/MuriloPCoelho/e-commerce.git
cd e-commerce
```

## 📦 2. Instalar Dependências

```bash
npm install
```

Isso instalará todas as dependências necessárias, incluindo:
- Next.js 15
- Drizzle ORM
- Better Auth
- Tailwind CSS
- shadcn/ui

## 🐳 3. Configurar o Banco de Dados

### Iniciar PostgreSQL com Docker

```bash
docker compose up -d
```

Isso irá:
- Criar um container PostgreSQL
- Expor na porta `5432`
- Criar o banco `ecommerce`

### Verificar se está rodando

```bash
docker compose ps
```

Você deve ver algo como:

```
NAME                IMAGE               STATUS
e-commerce-db-1     postgres:latest     Up 2 minutes
```

## ⚙️ 4. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Ou crie manualmente com o seguinte conteúdo:

```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=ecommerce
POSTGRES_PORT=5432
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecommerce

# Application
NODE_ENV=development
PORT=3000

# Authentication (opcional para login social)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000
```

### Gerar BETTER_AUTH_SECRET

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🗄️ 5. Migrar o Banco de Dados

Execute as migrations para criar as tabelas:

```bash
npx drizzle-kit push
```

Isso criará todas as tabelas necessárias:
- `user`, `session`, `account`, `verification` (autenticação)
- `tb_categories`, `tb_brands`, `tb_products`, etc.
- `tb_menus` (sistema de navegação)
- `tb_bags`, `tb_bag_items` (carrinho de compras)

## 🌱 6. Popular o Banco (Seed)

### Seed de Produtos

```bash
npm run seed
```

Cria:
- Categorias
- Marcas
- Produtos com variantes
- Cores e tamanhos

### Seed de Menus

```bash
npx tsx src/db/seed-menus.ts
```

Cria:
- 5 menus principais
- 16 submenus
- Total de 21 itens

## 🎨 7. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## ✅ Verificação

Se tudo estiver correto, você deve ver:

- ✅ Página inicial carregando
- ✅ Menu hambúrguer funcionando
- ✅ Produtos na página `/products`
- ✅ Sistema de login funcionando

---

## 🐛 Solução de Problemas

### Erro: "Cannot connect to database"

**Causa:** PostgreSQL não está rodando

**Solução:**
```bash
docker compose up -d
docker compose ps
```

### Erro: "Port 5432 is already in use"

**Causa:** Já existe outro PostgreSQL rodando

**Solução:**
```bash
# Parar o PostgreSQL local
sudo service postgresql stop

# OU alterar a porta no docker-compose.yml
ports:
  - "5433:5432"  # Porta 5433 no host

# E atualizar DATABASE_URL
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/ecommerce
```

### Erro: "Module not found"

**Causa:** Dependências não foram instaladas

**Solução:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro ao executar seed

**Causa:** Banco não foi migrado

**Solução:**
```bash
npx drizzle-kit push
npm run seed
```

---

## 🔄 Comandos Úteis

```bash
# Iniciar desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar produção
npm start

# Executar migrations
npx drizzle-kit push

# Limpar banco de dados
npm run clear-db

# Popular produtos
npm run seed

# Popular menus
npx tsx src/db/seed-menus.ts

# Limpar menus
npx tsx src/db/clear-menus.ts
```

---

## 📚 Próximos Passos

- [Guia Rápido](./quick-start.md) - Tutorial de 5 minutos
- [Variáveis de Ambiente](./environment.md) - Configurações detalhadas
- [Sistema de Menus](../features/menus-system.md) - Aprenda sobre navegação

---

**💡 Dica:** Use `npm run dev` em um terminal e mantenha aberto para hot-reload automático!
