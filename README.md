# 🛍️ E-commerce Next.js

> E-commerce moderno e escalável desenvolvido com Next.js 15, PostgreSQL e Drizzle ORM.

[![Next.js](https://img.shields.io/badge/Next.js-15.4-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.1-blue?logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue?logo=postgresql)](https://www.postgresql.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-green)](https://orm.drizzle.team/)

## 📚 Documentação

**📖 [Acesse a documentação completa em `/docs`](./docs/README.md)**

### Links Rápidos

- **🚀 [Guia de Instalação](./docs/getting-started/installation.md)** - Configure o ambiente completo
- **⚡ [Quick Start (5 minutos)](./docs/getting-started/quick-start.md)** - Comece rapidamente
- **📱 [Sistema de Menus](./docs/features/menus-system.md)** - Navegação hierárquica avançada
- **🎨 [Collections](./docs/features/collections.md)** - Coleções de produtos (Sport, Lifestyle, Promoções)
- **🛒 [Sacola de Compras](./docs/features/shopping-bag.md)** - Sistema de carrinho de compras
- **💳 [Métodos de Pagamento](./docs/features/payment-methods.md)** - Integração com Stripe
- **👤 [Área do Usuário](./docs/features/user-account.md)** - Gerenciamento de conta
- **📁 [Estrutura de Pastas](./docs/architecture/folder-structure.md)** - Organização do projeto

---

## ✨ Sobre o Projeto

Este é um e-commerce completo e moderno desenvolvido com as melhores práticas e tecnologias atuais. O projeto inclui:

- ✅ Sistema de autenticação completo (email/senha + OAuth)
- ✅ Integração com Stripe para pagamentos
- ✅ Área do usuário com gerenciamento de cartões
- ✅ Catálogo de produtos com variantes (cores e tamanhos)
- ✅ Sistema de navegação hierárquica por menus
- ✅ Coleções de produtos (Sport, Lifestyle, Promoções)
- ✅ Sacola de compras com gerenciamento de itens
- ✅ Filtros avançados de produtos
- ✅ Sistema de marcas e categorias
- ✅ Design responsivo e moderno

### 🛠️ Stack Tecnológica

- **Framework:** Next.js 15 (App Router) + React 19
- **Banco de Dados:** PostgreSQL (via Docker)
- **ORM:** Drizzle ORM + drizzle-kit
- **Autenticação:** Better Auth (OAuth + Email/Senha)
- **Pagamentos:** Stripe
- **UI:** Tailwind CSS + shadcn/ui
- **Linguagem:** TypeScript
- **Validação:** Zod
- **State Management:** React Query (TanStack Query)

---

## ⚡ Começando (em 5 minutos)

### Pré-requisitos

- **Node.js** >= 18.x ([Download](https://nodejs.org/))
- **Docker** & **Docker Compose** ([Download](https://www.docker.com/))
- **Git** ([Download](https://git-scm.com/))

### Instalação Rápida

1️⃣ **Clone o repositório:**

```bash
git clone https://github.com/MuriloPCoelho/e-commerce.git
cd e-commerce
```

2️⃣ **Instale as dependências:**

```bash
npm install
```

3️⃣ **Configure as variáveis de ambiente:**

Crie um arquivo `.env` na raiz do projeto:

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

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000

# Stripe (Pagamentos)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# OAuth Providers (opcional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

> 💡 **Dica:** Gere o `BETTER_AUTH_SECRET` com:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

4️⃣ **Inicie o banco de dados:**

```bash
docker compose up -d
```

5️⃣ **Popule o banco com dados de exemplo:**

```bash
npm run db:seed
```

Este comando irá criar:
- ✅ Categorias e subcategorias
- ✅ Marcas de produtos
- ✅ Cores e tamanhos
- ✅ Produtos com variantes
- ✅ Coleções (Sport, Lifestyle, Promoções)
- ✅ Sistema de menus hierárquicos

6️⃣ **Inicie a aplicação:**

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador! 🎉

---

## 📦 Scripts Disponíveis

### Desenvolvimento

```bash
npm run dev          # Inicia o servidor de desenvolvimento
npm run build        # Gera build de produção
npm run start        # Inicia o servidor de produção
npm run lint         # Executa o linter
```

### Banco de Dados

```bash
npm run db:seed      # Popula o banco com dados completos
npm run db:clear     # Limpa todas as tabelas do banco
npm run db:reset     # Limpa e repopula o banco (clear + seed)
```

### Seeds Específicos

```bash
npm run seed:categories   # Popula apenas categorias
npm run seed:collections  # Popula apenas coleções
npm run seed:menus        # Popula apenas menus
npm run seed:products     # Popula apenas produtos
```

---

## 🗄️ Estrutura do Banco de Dados

O projeto utiliza PostgreSQL com as seguintes tabelas principais:

### Autenticação
- `usersTable` - Usuários do sistema (inclui `stripeCustomerId`)
- `sessionsTable` - Sessões ativas
- `accountsTable` - Contas OAuth
- `verificationsTable` - Tokens de verificação

### Catálogo
- `tb_categories` - Categorias e subcategorias (hierárquicas)
- `tb_brands` - Marcas de produtos
- `tb_products` - Produtos principais
- `tb_product_variants` - Variantes (cores) de produtos
- `tb_product_variant_sizes` - Tamanhos disponíveis por variante
- `tb_colors` - Cores disponíveis
- `tb_sizes` - Tamanhos disponíveis

### Coleções
- `tb_collections` - Coleções (Sport, Lifestyle, Promoções)
- `tb_product_collections` - Relação produtos ↔ coleções

### Navegação
- `tb_menus` - Sistema de menus hierárquicos

### Carrinho
- `tb_bags` - Sacolas de compras dos usuários
- `tb_bag_items` - Itens na sacola

### Endereços
- `tb_user_addresses` - Endereços de entrega dos usuários

---

## 🏗️ Arquitetura do Projeto

```
e-commerce/
├── src/
│   ├── actions/          # Server Actions (Next.js)
│   │   ├── stripe/       # Integrações Stripe
│   │   └── ...
│   ├── app/              # Rotas e páginas (App Router)
│   │   ├── (main)/       # Grupo de rotas principais
│   │   │   ├── user/     # Área do usuário
│   │   │   └── ...
│   │   ├── api/auth/     # Endpoints de autenticação
│   │   ├── checkout/     # Página de checkout
│   │   ├── sign-in/      # Login
│   │   └── sign-up/      # Cadastro
│   ├── components/       # Componentes React
│   │   ├── commom/       # Componentes de negócio
│   │   └── ui/           # Componentes UI (shadcn/ui)
│   ├── db/               # Configuração do banco + seeds
│   ├── lib/              # Utilitários e helpers
│   ├── providers/        # Context Providers
│   ├── repositories/     # Data Access Layer
│   └── types/            # Definições TypeScript
├── docs/                 # Documentação completa
├── migrations/           # Migrations do Drizzle
└── public/              # Arquivos estáticos
```

### Principais Funcionalidades

#### 🔐 Autenticação (Better Auth)
- Login com email/senha
- OAuth (Google, GitHub, etc)
- Gerenciamento de sessões
- Proteção de rotas

#### 💳 Pagamentos (Stripe)
- Gerenciamento de cartões de crédito
- Payment Methods salvos
- Customer Session seguro
- Ícones de bandeiras (Visa, Mastercard, Amex)

#### 👤 Área do Usuário
- Meus Pedidos
- Favoritos
- Endereços
- Cartões salvos
- Devoluções e Trocas (RMA)
- Preferências

#### 📱 Sistema de Menus
- Navegação hierárquica (níveis ilimitados)
- Menus dinâmicos baseados em categorias, marcas ou coleções
- Drawer lateral com animações suaves
- Integração com ícones (Lucide React)

#### 🎨 Sistema de Coleções
- Coleções de produtos organizadas por tema:
  - **Sport**: Produtos esportivos
  - **Lifestyle**: Moda casual e lifestyle
  - **Promotion**: Produtos em promoção
- Produtos podem pertencer a múltiplas coleções

#### 🛒 Sacola de Compras
- Adicionar/remover produtos
- Gerenciamento de quantidade
- Seleção de tamanhos e cores
- Persistência por usuário
- Merge de sacola guest → usuário autenticado

#### 🔍 Sistema de Filtros
- Filtros por categoria, marca, cor, tamanho
- Filtros por faixa de preço
- URLs amigáveis para SEO
- Filtros combinados

---

## 🎯 Recursos Destacados

### ✨ Modern UI/UX
- Design responsivo (mobile-first)
- Animações suaves e transições
- Componentes acessíveis (shadcn/ui)
- Dark mode ready

### ⚡ Performance
- Server-side rendering (SSR)
- Static generation quando possível
- Imagens otimizadas
- Code splitting automático

### 🧪 Qualidade de Código
- TypeScript em todo o projeto
- Validação com Zod
- ESLint configurado
- Estrutura organizada e escalável
- Padrão Repository (Data Access Layer)

---

## 📖 Documentação Completa

Para informações mais detalhadas, consulte a documentação em [`/docs`](./docs/README.md):

### 🚀 Getting Started
- [Guia de Instalação Completo](./docs/getting-started/installation.md)
- [Quick Start (5 minutos)](./docs/getting-started/quick-start.md)
- [Variáveis de Ambiente](./docs/getting-started/environment.md)

### ✨ Funcionalidades
- [Sistema de Menus Hierárquicos](./docs/features/menus-system.md)
- [Sistema de Coleções](./docs/features/collections.md)
- [Sacola de Compras](./docs/features/shopping-bag.md)
- [Métodos de Pagamento (Stripe)](./docs/features/payment-methods.md)
- [Área do Usuário](./docs/features/user-account.md)

### 🏗️ Arquitetura
- [Estrutura de Pastas](./docs/architecture/folder-structure.md)
- [Schema do Banco de Dados](./docs/architecture/database-schema.md)
- [Padrão Repository](./docs/architecture/repository-pattern.md)

### 📖 Guias Práticos
- [Scripts de Seed](./docs/guides/seeding-data.md)

---

## 🛠️ Dicas de Desenvolvimento

### Migrations e Schema
- Use `drizzle-kit push` para atualizar o schema do banco
- Use `drizzle-kit generate` para gerar migrations
- Configuração em `drizzle.config.ts`

### Customização
- Imagens, variações e preços podem ser customizados nos scripts de seed
- Adicione novos produtos em `src/db/seed.ts`
- Configure menus personalizados em `src/db/seed-menus.ts`

### Boas Práticas
- Use Server Actions para operações de escrita
- Valide inputs com Zod
- Mantenha componentes pequenos e reutilizáveis
- Documente mudanças importantes

---

## 🤝 Contribuindo

Contribuições são muito bem-vindas! Aqui estão algumas ideias:

### Próximas Features
- [ ] Sistema de pedidos e checkout completo
- [ ] Painel administrativo
- [ ] Sistema de avaliações de produtos
- [ ] Wishlist (lista de desejos)
- [ ] Sistema de cupons e descontos
- [ ] Testes automatizados (unit + e2e)
- [ ] CI/CD com GitHub Actions

### Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença especificada no arquivo [LICENSE](./LICENSE).

---

## 👨‍💻 Autor

**Murilo Coelho**

- GitHub: [@MuriloPCoelho](https://github.com/MuriloPCoelho)

---

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/) - Framework React
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [Better Auth](https://www.better-auth.com/) - Sistema de autenticação
- [Stripe](https://stripe.com/) - Plataforma de pagamentos
- [shadcn/ui](https://ui.shadcn.com/) - Componentes de UI
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Lucide React](https://lucide.dev/) - Ícones

---

<div align="center">

**Última atualização:** Novembro 2025

⭐ Se este projeto foi útil, considere dar uma estrela!

</div>