# ⚙️ Variáveis de Ambiente

Guia completo sobre configuração de variáveis de ambiente.

## 📋 Visão Geral

O projeto usa variáveis de ambiente para configurar:
- Conexão com banco de dados
- Autenticação (Better Auth)
- Login social (Google, GitHub, etc.)
- Modo de desenvolvimento/produção

---

## 📝 Arquivo `.env`

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

### Template Completo

```env
# ==========================================
# DATABASE
# ==========================================
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=ecommerce
POSTGRES_PORT=5432
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecommerce

# ==========================================
# APPLICATION
# ==========================================
NODE_ENV=development
PORT=3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ==========================================
# BETTER AUTH
# ==========================================
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000

# ==========================================
# OAUTH PROVIDERS (opcional)
# ==========================================
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# ==========================================
# STRIPE (Pagamentos)
# ==========================================
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

---

## 🔑 Variáveis Obrigatórias

### Database

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecommerce
```

**Formato:**
```
postgresql://[user]:[password]@[host]:[port]/[database]
```

**Quando alterar:**
- Host diferente de `localhost`
- Porta diferente de `5432`
- Credenciais diferentes

### Better Auth Secret

```env
BETTER_AUTH_SECRET=your-secret-key-here
```

**Como gerar:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**⚠️ Importante:** 
- Nunca commite este valor no Git
- Use um valor diferente para produção
- Mínimo 32 caracteres

### Better Auth URL

```env
BETTER_AUTH_URL=http://localhost:3000
```

**Quando alterar:**
- Produção: `https://seudominio.com`
- Outra porta: `http://localhost:3001`

---

## 💳 Variáveis do Stripe

### Stripe Secret Key

```env
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

**Como obter:**
1. Acesse [Stripe Dashboard](https://dashboard.stripe.com/)
2. Vá em **Developers** → **API Keys**
3. Copie a **Secret key** (começa com `sk_test_` ou `sk_live_`)

**⚠️ Importante:** 
- Nunca exponha esta chave no frontend
- Use `sk_test_` para desenvolvimento
- Use `sk_live_` apenas em produção

### Stripe Publishable Key

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

**Como obter:**
1. Mesmo caminho acima (Stripe Dashboard)
2. Copie a **Publishable key** (começa com `pk_test_` ou `pk_live_`)

**Nota:** Esta chave pode ser exposta no frontend (prefixo `NEXT_PUBLIC_`)

---

## 🌐 Variáveis Públicas (Next.js)

Variáveis com prefixo `NEXT_PUBLIC_` são expostas no navegador:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**⚠️ Cuidado:**
- Não coloque segredos em variáveis públicas
- São visíveis no código client-side
- Use apenas para URLs, flags públicas, etc.

---

## 🔐 OAuth Providers (Opcional)

### Google OAuth

```env
GOOGLE_CLIENT_ID=1234567890-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
```

**Como obter:**

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um projeto (ou selecione existente)
3. Vá em **APIs & Services** > **Credentials**
4. Clique em **Create Credentials** > **OAuth 2.0 Client ID**
5. Configure:
   - Application type: **Web application**
   - Authorized redirect URIs: 
     - `http://localhost:3000/api/auth/callback/google`
     - `https://seudominio.com/api/auth/callback/google` (produção)
6. Copie **Client ID** e **Client Secret**

### GitHub OAuth

```env
GITHUB_CLIENT_ID=Iv1.1234567890abcdef
GITHUB_CLIENT_SECRET=1234567890abcdef1234567890abcdef12345678
```

**Como obter:**

1. Acesse [GitHub Developer Settings](https://github.com/settings/developers)
2. Clique em **New OAuth App**
3. Configure:
   - Application name: `E-commerce`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Clique em **Register application**
5. Copie **Client ID**
6. Gere um **Client Secret**

---

## 🏭 Ambientes Diferentes

### Development (`.env`)

```env
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecommerce
BETTER_AUTH_URL=http://localhost:3000
```

### Production (`.env.production`)

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@prod-host:5432/ecommerce
BETTER_AUTH_URL=https://seudominio.com
BETTER_AUTH_SECRET=[gerar novo secret]
```

**⚠️ Importante:**
- Nunca use as mesmas credenciais em ambientes diferentes
- Gere um novo `BETTER_AUTH_SECRET` para produção
- Use HTTPS em produção

---

## 🔒 Segurança

### ✅ Boas Práticas

1. **Nunca commite `.env`**
   ```gitignore
   # .gitignore
   .env
   .env.local
   .env.production
   .env.*.local
   ```

2. **Commite `.env.example`**
   ```env
   # .env.example
   DATABASE_URL=postgresql://user:password@host:5432/database
   BETTER_AUTH_SECRET=your-secret-here
   ```

3. **Use gerenciadores de secrets**
   - AWS Secrets Manager
   - Vercel Environment Variables
   - HashiCorp Vault

4. **Rotacione secrets regularmente**
   - Gere novos secrets periodicamente
   - Especialmente após um membro sair da equipe

### ❌ Evite

- ❌ Commitar `.env` no Git
- ❌ Compartilhar secrets por email/Slack
- ❌ Usar mesmas credenciais em dev e prod
- ❌ Hardcodar secrets no código
- ❌ Logar valores de secrets

---

## 🧪 Testes

### `.env.test`

```env
NODE_ENV=test
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecommerce_test
BETTER_AUTH_SECRET=test-secret-not-for-production
```

**Importante:**
- Use banco de dados separado para testes
- Secrets podem ser hardcoded (não são reais)

---

## 🚀 Deploy

### Vercel

1. Vá em **Settings** > **Environment Variables**
2. Adicione cada variável
3. Selecione o ambiente (Production, Preview, Development)
4. Salve

### Docker

Use `docker-compose.yml`:

```yaml
services:
  app:
    environment:
      DATABASE_URL: ${DATABASE_URL}
      BETTER_AUTH_SECRET: ${BETTER_AUTH_SECRET}
    env_file:
      - .env.production
```

---

## 📦 Validação de Variáveis

### Criar `src/lib/env.ts`

```typescript
const requiredEnvVars = [
  'DATABASE_URL',
  'BETTER_AUTH_SECRET',
  'BETTER_AUTH_URL',
] as const;

export function validateEnv() {
  const missing = requiredEnvVars.filter(
    (key) => !process.env[key]
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

// Chamar no início da aplicação
validateEnv();
```

---

## 🔍 Debugging

### Verificar Variáveis

```typescript
// ✅ Server-side (funciona)
console.log(process.env.DATABASE_URL);

// ❌ Client-side (undefined se não for NEXT_PUBLIC_*)
console.log(process.env.DATABASE_URL); // undefined

// ✅ Client-side (funciona)
console.log(process.env.NEXT_PUBLIC_APP_URL);
```

### Listar Todas as Variáveis (Debug)

```typescript
// src/app/api/debug-env/route.ts (remover em produção!)
export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return Response.json({ error: 'Not allowed' }, { status: 403 });
  }
  
  return Response.json({
    env: process.env,
  });
}
```

**⚠️ ATENÇÃO:** Remova este endpoint antes de deploy!

---

## 📚 Referências

- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Better Auth Configuration](https://www.better-auth.com/docs/configuration)
- [Drizzle ORM Connection](https://orm.drizzle.team/docs/get-started-postgresql)

---

## 🆘 Problemas Comuns

### Erro: "DATABASE_URL is not defined"

**Causa:** Variável não configurada

**Solução:**
```bash
# Verificar se .env existe
ls .env

# Criar se não existir
cp .env.example .env

# Editar e adicionar DATABASE_URL
```

### Erro: "Invalid BETTER_AUTH_SECRET"

**Causa:** Secret muito curto ou inválido

**Solução:**
```bash
# Gerar novo secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Adicionar ao .env
BETTER_AUTH_SECRET=<secret-gerado>
```

### Variável NEXT_PUBLIC_ não funciona

**Causa:** Precisa rebuild

**Solução:**
```bash
# Parar o servidor
# Ctrl + C

# Restartar
npm run dev
```

---

**📅 Última atualização:** Outubro 2025  
**📌 Versão:** 1.0
