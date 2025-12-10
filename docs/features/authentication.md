# 🔐 Sistema de Autenticação

Sistema completo de autenticação utilizando **Better Auth** com suporte a email/senha e OAuth (Google).

## 📋 Visão Geral

O sistema de autenticação oferece:
- ✅ Cadastro com email e senha
- ✅ Login com email e senha
- ✅ Login social via Google OAuth
- ✅ Sessões persistentes
- ✅ Logout seguro
- ✅ Integração com Stripe (Customer ID)

**Rotas:**
- `/sign-up` - Cadastro
- `/sign-in` - Login
- `/api/auth/*` - Endpoints Better Auth

---

## 🛠️ Tecnologia

### Better Auth

**Biblioteca:** [better-auth](https://www.better-auth.com/)

**Características:**
- Framework-agnostic (funciona com qualquer framework)
- Type-safe (TypeScript nativo)
- Adapter para Drizzle ORM
- Suporte a múltiplos providers OAuth
- Sessões seguras com tokens
- Hooks client-side (React)

---

## 🗄️ Schema do Banco de Dados

### Tabelas de Autenticação

**Arquivo:** `auth-schema.ts`

#### 1. users_table

```typescript
export const usersTable = pgTable("users_table", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  stripeCustomerId: text("stripe_customer_id"),
});
```

**Campos:**
- `id`: Identificador único do usuário
- `name`: Nome completo
- `email`: Email (único)
- `emailVerified`: Se o email foi verificado
- `image`: URL da foto de perfil (OAuth)
- `stripeCustomerId`: ID do customer no Stripe (integração pagamentos)

---

#### 2. sessions_table

```typescript
export const sessionsTable = pgTable("sessions_table", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
});
```

**Características:**
- Token único por sessão
- Expiração automática
- Rastreamento de IP e User-Agent
- Cascade delete quando usuário é removido

---

#### 3. accounts_table

```typescript
export const accountsTable = pgTable("accounts_table", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});
```

**Uso:**
- `providerId`: "credential" (email/senha) ou "google" (OAuth)
- Armazena tokens OAuth
- Armazena senha hashada (email/senha)
- Suporta múltiplas contas por usuário

---

#### 4. verifications_table

```typescript
export const verificationsTable = pgTable("verifications_table", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
```

**Uso:**
- Verificação de email
- Reset de senha
- Tokens temporários

---

## ⚙️ Configuração

### Server-Side

**Arquivo:** `src/lib/auth.ts`

```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  trustedOrigins: [
    "http://localhost:3000",
    // Adicione suas origens confiáveis aqui
  ],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  user: {
    modelName: "usersTable",
    additionalFields: {
      stripeCustomerId: {
        type: "string",
        required: false,
      },
    },
  },
  session: {
    modelName: "sessionsTable",
  },
  account: {
    modelName: "accountsTable",
  },
  verification: {
    modelName: "verificationsTable",
  },
});
```

**Configurações:**
- `emailAndPassword`: Habilita login tradicional
- `socialProviders`: Configura OAuth (Google)
- `trustedOrigins`: Domínios permitidos (CORS)
- `database`: Adapter Drizzle para PostgreSQL
- `additionalFields`: Campo customizado (`stripeCustomerId`)

---

### Client-Side

**Arquivo:** `src/lib/auth-client.ts`

```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});
```

**Hooks disponíveis:**
- `authClient.useSession()` - Obter sessão atual
- `authClient.signIn()` - Fazer login
- `authClient.signUp()` - Fazer cadastro
- `authClient.signOut()` - Fazer logout

---

## 🔑 Variáveis de Ambiente

### Obrigatórias

```env
# Better Auth
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000
```

### Gerar BETTER_AUTH_SECRET

**Linux/Mac:**
```bash
openssl rand -base64 32
```

**Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

---

### OAuth (Google) - Opcional

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Como obter:**
1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie ou selecione um projeto
3. Vá em "APIs & Services" → "Credentials"
4. Clique em "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure:
   - **Application type:** Web application
   - **Authorized redirect URIs:** `http://localhost:3000/api/auth/callback/google`
6. Copie Client ID e Client Secret

---

## 📱 Páginas de Autenticação

### Sign Up (Cadastro)

**Rota:** `/sign-up`  
**Arquivo:** `src/app/sign-up/page.tsx`

**Campos:**
- Nome completo
- Email
- Senha
- Confirmar senha

**Validações:**
- Nome mínimo 3 caracteres
- Email válido
- Senha mínima 8 caracteres
- Senhas devem coincidir

**Comportamento:**
```typescript
const handleSignUp = async (data) => {
  await authClient.signUp.email({
    email: data.email,
    password: data.password,
    name: data.name,
  });
  
  // Redireciona para página inicial ou dashboard
  router.push("/");
};
```

---

### Sign In (Login)

**Rota:** `/sign-in`  
**Arquivo:** `src/app/sign-in/page.tsx`

**Campos:**
- Email
- Senha

**Opções:**
- Login com email/senha
- Login com Google (OAuth)

**Comportamento:**
```typescript
// Login com email/senha
const handleSignIn = async (data) => {
  await authClient.signIn.email({
    email: data.email,
    password: data.password,
  });
  
  router.push("/");
};

// Login com Google
const handleGoogleSignIn = async () => {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: "/",
  });
};
```

---

## 🎯 Uso no Frontend

### Verificar Sessão

```typescript
"use client";

import { authClient } from "@/lib/auth-client";

export default function MyComponent() {
  const { data: session, isPending } = authClient.useSession();
  
  if (isPending) return <div>Loading...</div>;
  
  if (!session) {
    return <div>Você não está autenticado</div>;
  }
  
  return (
    <div>
      <h1>Olá, {session.user.name}!</h1>
      <p>Email: {session.user.email}</p>
    </div>
  );
}
```

---

### Logout

```typescript
const handleLogout = async () => {
  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        window.location.href = "/";
      },
    },
  });
};
```

---

### Proteção de Rotas

**Client-Side:**
```typescript
"use client";

export default function ProtectedPage() {
  const { data: session } = authClient.useSession();
  
  if (!session) {
    redirect("/sign-in");
  }
  
  return <div>Conteúdo protegido</div>;
}
```

**Server-Side:**
```typescript
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session) {
    redirect("/sign-in");
  }
  
  return <div>Conteúdo protegido</div>;
}
```

---

## 🔧 Server Actions

### Verificar Autenticação em Actions

```typescript
"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const myProtectedAction = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session?.user) {
    throw new Error("User not authenticated");
  }
  
  // Sua lógica aqui
  const userId = session.user.id;
  
  // ...
};
```

---

## 🎨 Componentes

### User Dropdown

**Arquivo:** `src/components/commom/user-dropdown.tsx`

**Features:**
- Mostra nome e email do usuário
- Menu com opções da área do usuário
- Botão de logout
- Versões Desktop (Dropdown) e Mobile (Drawer)

**Menu Items:**
1. Orders
2. Favorites
3. Addresses
4. Cards
5. Returns
6. Preferences
7. **Sign Out** (vermelho, separado)

---

### Navigation Drawer

**Arquivo:** `src/components/commom/navigation-drawer.tsx`

**Exibição Condicional:**

**Autenticado:**
- Nome do usuário
- Link para "My Orders"
- Menus do site

**Não Autenticado:**
- Botão "Sign In"
- Botão "Sign Up"
- Menus do site

---

## 🔄 Fluxo de Autenticação

### Cadastro (Email/Senha)

```
1. Usuário acessa /sign-up
2. Preenche formulário (nome, email, senha)
3. Submit → authClient.signUp.email()
4. Better Auth cria:
   - Registro em users_table
   - Registro em accounts_table (providerId: "credential")
   - Senha é hashada automaticamente
5. Sessão é criada (sessions_table)
6. Token é enviado ao client (cookie httpOnly)
7. Redirecionamento para "/"
```

---

### Login (Email/Senha)

```
1. Usuário acessa /sign-in
2. Preenche email e senha
3. Submit → authClient.signIn.email()
4. Better Auth valida:
   - Busca usuário por email
   - Compara senha hashada
5. Cria sessão (sessions_table)
6. Retorna token (cookie httpOnly)
7. Redirecionamento para "/"
```

---

### Login (Google OAuth)

```
1. Usuário clica em "Sign in with Google"
2. authClient.signIn.social({ provider: "google" })
3. Redirecionamento para Google OAuth
4. Usuário autoriza aplicação
5. Callback: /api/auth/callback/google
6. Better Auth:
   - Busca ou cria usuário em users_table
   - Cria/atualiza registro em accounts_table
   - Armazena access_token e refresh_token
   - Salva foto de perfil (image)
7. Cria sessão
8. Redirecionamento para "/"
```

---

### Logout

```
1. Usuário clica em "Sign Out"
2. authClient.signOut()
3. Better Auth:
   - Remove sessão de sessions_table
   - Limpa cookie no client
4. Redirecionamento para "/"
```

---

## 🔒 Segurança

### Senhas

- ✅ Hashadas com bcrypt (automático pelo Better Auth)
- ✅ Nunca armazenadas em plain text
- ✅ Validação de força no frontend

### Sessões

- ✅ Tokens únicos e seguros
- ✅ Cookies httpOnly (não acessível via JavaScript)
- ✅ Expiração automática
- ✅ Rastreamento de IP e User-Agent

### CSRF Protection

- ✅ Better Auth implementa proteção CSRF automaticamente
- ✅ Tokens validados em cada request

### OAuth

- ✅ State parameter para prevenir CSRF
- ✅ Tokens OAuth armazenados de forma segura
- ✅ Refresh automático de access tokens

---

## 🔗 Integração com Stripe

Quando um usuário se cadastra:
1. Campo `stripeCustomerId` é criado como `null`
2. Na primeira tentativa de adicionar cartão:
   - Sistema cria Customer no Stripe
   - Salva `stripeCustomerId` no banco
3. Todas as operações futuras usam esse Customer ID

**Ver:** [Métodos de Pagamento](./payment-methods.md)

---

## 🚀 Como Testar

### 1. Cadastro Local

```bash
# Acesse
http://localhost:3000/sign-up

# Preencha:
Nome: John Doe
Email: john@example.com
Senha: 12345678

# Após sucesso, você será redirecionado para "/"
```

---

### 2. Login Local

```bash
# Acesse
http://localhost:3000/sign-in

# Use as credenciais criadas acima
```

---

### 3. Login com Google

```bash
# Configure GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET
# Acesse /sign-in
# Clique em "Sign in with Google"
# Autorize a aplicação
# Você será redirecionado de volta
```

---

### 4. Verificar Sessão

```bash
# Em qualquer página, adicione:
const { data: session } = authClient.useSession();
console.log(session);

# Deve exibir:
{
  user: {
    id: "...",
    name: "John Doe",
    email: "john@example.com",
    image: null,
    stripeCustomerId: null
  }
}
```

---

## 📖 Documentação Oficial

- **Better Auth:** https://www.better-auth.com/
- **Better Auth + Drizzle:** https://www.better-auth.com/docs/adapters/drizzle
- **Better Auth React Hooks:** https://www.better-auth.com/docs/react

---

## 🔗 Relacionado

- [Métodos de Pagamento](./payment-methods.md) - Integração Stripe (usa stripeCustomerId)
- [Área do Usuário](./user-account.md) - Páginas protegidas por autenticação
- [Endereços](./addresses.md) - Gerenciamento de endereços (requer autenticação)
