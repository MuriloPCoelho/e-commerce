# 👤 Área do Usuário

Sistema completo de gerenciamento de conta do usuário com navegação intuitiva.

## 📋 Visão Geral

A área do usuário oferece acesso centralizado a:
- 📦 Pedidos (Orders)
- ❤️ Favoritos (Favorites)
- 📍 Endereços (Addresses)
- 💳 Cartões (Cards)
- 🔄 Devoluções e Trocas (RMA)
- ⭐ Preferências (Preferences)

**Rota Base:** `/user/*`

---

## 🎨 Layout e Navegação

### Estrutura de Rotas

```
/user
├── /orders         → Meus Pedidos
├── /favorites      → Meus Favoritos
├── /adresses       → Meus Endereços
├── /cards          → Meus Cartões
├── /rma            → Devoluções e Trocas
└── /preferences    → Preferências
```

### Layout Compartilhado

**Arquivo:** `src/app/(main)/user/layout.tsx`

O layout inclui:
- Header com título da seção
- Navegação por tabs (mobile e desktop)
- Conteúdo da página

---

## 🧭 Componentes de Navegação

### 1. User Navigation Tabs

**Componente:** `src/components/commom/user-navigation-tabs.tsx`

**Features:**
- Tabs horizontais com scroll suave
- Auto-centralização da tab ativa
- Gradientes indicando conteúdo adicional (mobile)
- Responsivo (stack vertical em desktop se necessário)

**Ícones por seção:**
- 📦 Package → Orders
- ❤️ Heart → Favorites
- 📍 MapPin → Addresses
- 💳 CreditCard → Cards
- 🔄 RefreshCcw → Returns
- ⭐ Star → Preferences

**Comportamento:**
```typescript
const activeTab = menuItems.find((item) => 
  pathname.startsWith(item.href)
)?.value || "orders";
```

---

### 2. User Dropdown

**Componente:** `src/components/commom/user-dropdown.tsx`

**Versões:**
- **Desktop:** Dropdown menu
- **Mobile:** Drawer em tela cheia

**Menu Items:**
1. Orders
2. Favorites
3. Addresses
4. Cards
5. Returns
6. Preferences
7. **Sair da conta** (vermelho, com separador)

**Implementação de Logout:**
```typescript
authClient.signOut({
  fetchOptions: {
    onSuccess: () => {
      window.location.href = "/";
    },
  },
});
```

---

### 3. Navigation Drawer

**Componente:** `src/components/commom/navigation-drawer.tsx`

**Exibição condicional:**
- Se autenticado: Mostra nome do usuário + link para Orders
- Se não autenticado: Mostra opções de Sign In/Sign Up

**Features:**
- Menu lateral (mobile)
- Integração com sistema de menus hierárquicos
- Estado de sessão (Better Auth)

---

## 📄 Páginas

### 1. Orders (Pedidos)

**Rota:** `/user/orders`  
**Status:** 🚧 TODO

**Objetivo:** Exibir histórico de pedidos com status, valores e detalhes.

**Campos planejados:**
- Número do pedido
- Data
- Status (Pendente, Enviado, Entregue, etc.)
- Total
- Produtos

---

### 2. Favorites (Favoritos)

**Rota:** `/user/favorites`  
**Status:** 🚧 TODO

**Objetivo:** Lista de produtos marcados como favoritos.

**Features planejadas:**
- Grid de produtos favoritos
- Remover dos favoritos
- Adicionar à sacola diretamente

---

### 3. Addresses (Endereços)

**Rota:** `/user/adresses`  
**Status:** 🚧 TODO

**Objetivo:** Gerenciar endereços de entrega e cobrança.

**Schema existente:** `tb_user_addresses`

**Features planejadas:**
- Listar endereços
- Adicionar novo
- Editar existente
- Definir endereço padrão
- Remover

---

### 4. Cards (Cartões)

**Rota:** `/user/cards`  
**Status:** ✅ Implementado

**Documentação:** [Payment Methods](./payment-methods.md)

**Features:**
- Listar cartões salvos
- Adicionar novo cartão (Stripe Elements)
- Definir cartão padrão
- Remover cartão
- Ícones de bandeiras (Visa, Mastercard, Amex)

---

### 5. RMA (Devoluções e Trocas)

**Rota:** `/user/rma`  
**Status:** 🚧 TODO

**Objetivo:** Gerenciar solicitações de devolução/troca.

**Features planejadas:**
- Solicitar devolução
- Acompanhar status
- Upload de comprovantes
- Comunicação com suporte

---

### 6. Preferences (Preferências)

**Rota:** `/user/preferences`  
**Status:** 🚧 TODO

**Objetivo:** Configurações de conta e preferências.

**Features planejadas:**
- Notificações por email
- Newsletter
- Idioma/Região
- Tema (claro/escuro)
- Privacidade

---

## 🔐 Autenticação

### Proteção de Rotas

Todas as rotas `/user/*` requerem autenticação via Better Auth.

**Verificação:**
```typescript
const { data: session } = authClient.useSession();

if (!session?.user) {
  // Redirecionar para /sign-in
}
```

### Integração com Better Auth

**Schema:** `auth-schema.ts`

**Tabelas:**
- `usersTable` - Dados do usuário
- `sessionsTable` - Sessões ativas
- `accountsTable` - OAuth providers
- `verificationsTable` - Verificação de email

**Campo adicional:**
```typescript
stripeCustomerId: text("stripe_customer_id")
```

---

## 🎨 Design System

### Layout Consistente

Todas as páginas seguem o padrão:

```tsx
export default function PageName() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Título</h1>
      {/* Conteúdo */}
    </div>
  );
}
```

**Removido:** Cards brancos (`bg-white rounded-lg shadow`) para layout mais limpo.

### Componentes UI (shadcn/ui)

- Drawer
- Dropdown Menu
- Tabs
- Badge
- Button
- Skeleton (loading states)

---

## 📱 Responsividade

### Mobile First

- Tabs com scroll horizontal
- Drawers em tela cheia
- Stack vertical quando necessário

### Desktop

- Dropdowns compactos
- Tabs inline sem scroll
- Maior densidade de informação

---

## 🔄 Estado e Cache

### React Query

Usado para cache de dados do usuário:

```typescript
const { data: session } = authClient.useSession();
const { data: paymentMethods } = useQuery({
  queryKey: ['payment-methods', session?.user.id],
  queryFn: getMyPaymentMethods,
});
```

**Benefícios:**
- Cache automático
- Refetch em background
- Invalidação seletiva

---

## 🚀 Próximos Passos

### Prioridade Alta

- [ ] Implementar página de Orders
- [ ] Implementar sistema de Favoritos
- [ ] Completar CRUD de Endereços

### Prioridade Média

- [ ] Sistema de RMA
- [ ] Página de Preferências
- [ ] Edição de perfil

### Melhorias

- [ ] Adicionar breadcrumbs
- [ ] Melhorar loading states
- [ ] Adicionar empty states ilustrados
- [ ] Notificações toast para ações

---

## 📚 Arquivos Relacionados

```
src/
├── app/(main)/user/
│   ├── layout.tsx              # Layout compartilhado
│   ├── orders/page.tsx
│   ├── favorites/page.tsx
│   ├── adresses/page.tsx
│   ├── cards/page.tsx         # ✅ Completo
│   ├── rma/page.tsx
│   └── preferences/page.tsx
├── components/commom/
│   ├── user-dropdown.tsx       # Dropdown/Drawer do usuário
│   ├── user-navigation-tabs.tsx # Tabs de navegação
│   └── navigation-drawer.tsx   # Menu lateral
└── lib/
    ├── auth.ts                 # Better Auth (servidor)
    └── auth-client.ts          # Better Auth (cliente)
```

---

## 🧪 Testing

### Acesso Rápido

1. Fazer login: `/sign-in`
2. Acessar área do usuário: `/user/orders`
3. Navegar entre seções usando tabs
4. Testar logout no dropdown

### Casos de Teste

- [ ] Navegação entre seções preserva estado
- [ ] Tab ativa é destacada corretamente
- [ ] Scroll auto-centraliza tab ativa (mobile)
- [ ] Logout redireciona para home
- [ ] Rotas protegidas redirecionam quando não autenticado

---

## 📖 Referências

- [Better Auth Docs](https://www.better-auth.com/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [React Query](https://tanstack.com/query/latest)
- [shadcn/ui](https://ui.shadcn.com/)
