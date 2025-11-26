# ⚡ Guia Rápido - 5 Minutos

Configure e rode o projeto em 5 minutos!

## 🎯 Passo a Passo

### 1. Clonar e Instalar (1 min)

```bash
git clone https://github.com/MuriloPCoelho/e-commerce.git
cd e-commerce
npm install
```

### 2. Configurar Ambiente (1 min)

Crie o arquivo `.env`:

```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=ecommerce
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecommerce

# Application
NODE_ENV=development
PORT=3000

# Better Auth
BETTER_AUTH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth (Opcional - para login com Google)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Stripe (Opcional - para pagamentos)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

**📝 Notas sobre variáveis opcionais:**

- **Google OAuth:** Necessário apenas se quiser habilitar login com Google
  - Obtenha em: https://console.cloud.google.com/
  - Sem essas chaves, o sistema funcionará apenas com login por email/senha
  
- **Stripe:** Necessário para funcionalidades de pagamento e cartões
  - Obtenha em: https://dashboard.stripe.com/test/apikeys
  - Use chaves de **teste** (`sk_test_` e `pk_test_`)
  - Sem essas chaves, a área de cartões não funcionará

> 💡 **Para começar rápido:** Você pode pular as configurações do Google e Stripe inicialmente. O sistema funcionará normalmente com as outras features!

### 3. Iniciar Banco de Dados (1 min)

```bash
docker compose up -d
```

### 4. Configurar Banco (1 min)

```bash
npx drizzle-kit push
npm run seed
npx tsx src/db/seed-menus.ts
```

### 5. Iniciar Aplicação (1 min)

```bash
npm run dev
```

✅ **Pronto!** Acesse [http://localhost:3000](http://localhost:3000)

---

## 🎉 O que você tem agora

### ✅ Funcionando Imediatamente

- ✅ Aplicação rodando em http://localhost:3000
- ✅ Banco PostgreSQL configurado
- ✅ Produtos de exemplo criados
- ✅ Sistema de menus funcionando
- ✅ Autenticação com email/senha
- ✅ Sacola de compras
- ✅ Filtros de produtos
- ✅ Coleções (Sport, Lifestyle, Promoções)

### 🔧 Requer Configuração Adicional

- ⚙️ **Login com Google** - Precisa de chaves OAuth ([ver guia](#habilitar-login-com-google-oauth))
- ⚙️ **Gerenciamento de Cartões** - Precisa de chaves Stripe ([ver guia](#habilitar-pagamentos-com-stripe))

---

## 🚀 Próximos Passos

### Configurações Opcionais

#### Habilitar Login com Google (OAuth)

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Vá em "APIs & Services" → "Credentials"
4. Clique em "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure:
   - **Application type:** Web application
   - **Authorized redirect URIs:** `http://localhost:3000/api/auth/callback/google`
6. Copie o `Client ID` e `Client Secret`
7. Adicione no `.env`:
   ```env
   GOOGLE_CLIENT_ID=seu-client-id-aqui
   GOOGLE_CLIENT_SECRET=seu-client-secret-aqui
   ```
8. Reinicie a aplicação

**📖 Guia completo:** [Variáveis de Ambiente](./environment.md#oauth-providers-opcional)

#### Habilitar Pagamentos com Stripe

1. Acesse [Stripe Dashboard](https://dashboard.stripe.com/register)
2. Crie uma conta (ou faça login)
3. Vá em "Developers" → "API Keys"
4. Copie as chaves de **teste** (começam com `sk_test_` e `pk_test_`)
5. Adicione no `.env`:
   ```env
   STRIPE_SECRET_KEY=sk_test_sua-chave-secreta
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_sua-chave-publica
   ```
6. Reinicie a aplicação
7. Acesse `/user/cards` para gerenciar cartões

**💳 Cartões de teste:**
- Visa: `4242 4242 4242 4242`
- Mastercard: `5555 5555 5555 4444`
- Qualquer CVC e data futura

**📖 Guia completo:** [Métodos de Pagamento](../features/payment-methods.md)

---

### Explorar a Aplicação

1. **Página Inicial** - http://localhost:3000
2. **Produtos** - http://localhost:3000/products
3. **Produto Individual** - Clique em qualquer produto
4. **Menu de Navegação** - Clique no ícone de menu (☰)
5. **Criar Conta** - http://localhost:3000/sign-up

### Testar Funcionalidades

#### Adicionar Produto à Sacola
1. Acesse um produto
2. Selecione cor e tamanho
3. Clique em "Adicionar à sacola"
4. Veja o contador no ícone da sacola

#### Navegar pelos Menus
1. Clique no menu hambúrguer (☰)
2. Clique em "Calçados"
3. Explore os submenus
4. Clique em "Voltar"
5. Teste outros menus

#### Criar uma Conta
1. Vá para `/sign-up`
2. Preencha nome, email e senha
3. Faça login
4. Seu nome aparecerá no menu

---

## 📝 Comandos Essenciais

```bash
# Desenvolvimento
npm run dev

# Parar banco de dados
docker compose down

# Reiniciar banco de dados
docker compose restart

# Ver logs do banco
docker compose logs -f

# Limpar e popular novamente
npm run clear-db
npm run seed
npx tsx src/db/seed-menus.ts
```

---

## 🎨 Estrutura do Projeto

```
e-commerce/
├── src/
│   ├── app/              # Rotas (Next.js App Router)
│   ├── components/       # Componentes React
│   ├── db/              # Banco de dados (schema, seed)
│   ├── actions/         # Server Actions
│   └── lib/             # Utilitários
├── docs/                # Documentação (você está aqui!)
├── .env                 # Variáveis de ambiente
├── docker-compose.yml   # Configuração do PostgreSQL
└── package.json         # Dependências
```

---

## 💡 Dicas Rápidas

### Ver Produtos no Banco

```bash
docker compose exec db psql -U postgres -d ecommerce -c "SELECT name FROM tb_products;"
```

### Ver Menus no Banco

```bash
docker compose exec db psql -U postgres -d ecommerce -c "SELECT name, slug FROM tb_menus ORDER BY \"order\";"
```

### Resetar Tudo

```bash
docker compose down -v
docker compose up -d
npx drizzle-kit push
npm run seed
npx tsx src/db/seed-menus.ts
```

---

## 🐛 Problemas Comuns

### Porta 3000 em uso

```bash
# Matar processo na porta 3000
npx kill-port 3000

# Ou usar outra porta
PORT=3001 npm run dev
```

### Banco não conecta

```bash
# Verificar se está rodando
docker compose ps

# Verificar logs
docker compose logs db

# Reiniciar
docker compose restart
```

### Seed falha

```bash
# Limpar e tentar novamente
npm run clear-db
npx drizzle-kit push
npm run seed
```

---

## 📚 Documentação Completa

Para mais detalhes, consulte:

- [Instalação Completa](./installation.md)
- [Variáveis de Ambiente](./environment.md)
- [Sistema de Menus](../features/menus-system.md)
- [Padrão Repository](../architecture/repository-pattern.md)

---

## 🎓 Tutoriais em Vídeo

*Em breve: links para vídeos tutoriais*

---

**⏱️ Tempo total:** ~5 minutos  
**🎯 Dificuldade:** Fácil  
**💻 Pré-requisitos:** Node.js, Docker
