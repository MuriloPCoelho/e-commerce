# 💳 Métodos de Pagamento (Stripe)

Sistema completo de gerenciamento de cartões de crédito integrado com Stripe.

## 📋 Visão Geral

O sistema permite que usuários autenticados:
- Adicionar novos cartões de crédito
- Visualizar cartões salvos
- Definir cartão padrão
- Editar informações do cartão
- Remover cartões

**Integração:** Stripe Payment Methods API + Stripe Elements

---

## 🏗️ Arquitetura

### Fluxo de Dados

```
1. Usuário → Adiciona Cartão
2. Frontend → Stripe Elements (tokenização segura)
3. Backend → Stripe API (salva Payment Method)
4. Banco → Associa com Customer ID do usuário
5. UI → Exibe cartões salvos
```

### Componentes Principais

```
src/
├── app/(main)/user/cards/
│   ├── page.tsx                           # Página principal
│   └── components/
│       ├── payment-card.tsx               # Card individual
│       └── add-payment-method-drawer.tsx  # Drawer para adicionar
├── components/commom/card-brand-icon/
│   ├── index.tsx                          # Componente principal
│   ├── visa-icon.tsx                      # Ícone Visa
│   ├── mastercard-icon.tsx                # Ícone Mastercard
│   ├── amex-icon.tsx                      # Ícone Amex
│   └── unknown-card-icon.tsx              # Ícone genérico
└── actions/stripe/
    ├── create-stripe-customer/
    ├── get-customer/
    ├── get-user-customer-id/
    ├── get-customer-payment-methods/
    ├── add-customer-payment-method/
    ├── set-default-payment-method/
    └── remove-payment-method/
```

---

## 🔐 Stripe Customer

### Schema do Usuário

```typescript
// auth-schema.ts
export const usersTable = pgTable("users_table", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  stripeCustomerId: text("stripe_customer_id"), // ← Novo campo
  // ...outros campos
});
```

### Criação Automática

Quando um usuário tenta adicionar um cartão pela primeira vez, o sistema:

1. Verifica se já existe `stripeCustomerId`
2. Se não existir, cria um Customer no Stripe
3. Salva o Customer ID no banco

```typescript
// lib/stripe.ts
export const getOrCreateStripeCustomer = async (userId: string) => {
  const customerId = await getUserStripeCustomerId(userId);
  
  if (customerId) {
    return customerId;
  }
  
  return await createStripeCustomer(userId);
};
```

---

## 🎨 Interface do Usuário

### Página de Cartões

**Rota:** `/user/cards`

**Features:**
- Lista todos os cartões salvos
- Indicador visual de cartão padrão (badge azul)
- Botão para adicionar novo cartão
- Menu de ações por cartão (3 dots)

### PaymentCard Component

```typescript
<PaymentCard
  paymentMethod={method}
  isDefault={method.id === defaultPaymentMethodId}
  ownerName={method.billing_details.name}
/>
```

**Propriedades:**
- `paymentMethod`: Dados do Stripe Payment Method
- `isDefault`: Boolean indicando se é o cartão padrão
- `ownerName`: Nome do titular do cartão

**Ações Disponíveis:**
1. **Set as Default** - Define como cartão padrão (se não for)
2. **Edit Card** - Edita informações (TODO)
3. **Remove Card** - Remove o cartão

### Ícones de Bandeiras

O sistema detecta automaticamente a bandeira do cartão e exibe o ícone correspondente:

- ✅ Visa
- ✅ Mastercard
- ✅ American Express
- 🔲 Genérico (para outras bandeiras)

```typescript
<CardBrandIcon brand={paymentMethod.card.brand} size={40} />
```

---

## 🔧 Server Actions

### 1. Create Stripe Customer

**Arquivo:** `src/actions/stripe/create-stripe-customer/index.ts`

```typescript
export const createStripeCustomer = async (userId: string)
```

**Função:** Cria um novo Customer no Stripe e salva o ID no banco.

**Retorna:** `customerId` (string)

---

### 2. Get User Customer ID

**Arquivo:** `src/actions/stripe/get-user-customer-id/index.ts`

```typescript
export const getUserStripeCustomerId = async (userId: string)
```

**Função:** Busca o Stripe Customer ID de um usuário no banco.

**Retorna:** `stripeCustomerId | null`

---

### 3. Get Customer

**Arquivo:** `src/actions/stripe/get-customer/index.ts`

```typescript
export const getCustomer = async (customerId: string)
```

**Função:** Busca dados completos do Customer no Stripe.

**Retorna:** Objeto `Stripe.Customer`

**Uso:** Obter configurações como `invoice_settings.default_payment_method`

---

### 4. Get Customer Payment Methods

**Arquivo:** `src/actions/stripe/get-customer-payment-methods/index.ts`

```typescript
export const getMyPaymentMethods = async ()
```

**Função:** Lista todos os Payment Methods do usuário autenticado.

**Retorna:** Array de `Stripe.PaymentMethod`

---

### 5. Add Customer Payment Method

**Arquivo:** `src/actions/stripe/add-customer-payment-method/index.ts`

```typescript
export const addCustomerPaymentMethod = async (paymentMethodId: string)
```

**Função:** Anexa um Payment Method ao Customer.

**Uso:** Após tokenização no frontend com Stripe Elements.

---

### 6. Set Default Payment Method

**Arquivo:** `src/actions/stripe/set-default-payment-method/index.ts`

```typescript
export const setDefaultPaymentMethod = async (paymentMethodId: string)
```

**Função:** Define um cartão como padrão para cobranças futuras.

**Atualiza:** `customer.invoice_settings.default_payment_method`

---

### 7. Remove Payment Method

**Arquivo:** `src/actions/stripe/remove-payment-method/index.ts`

```typescript
export const removePaymentMethod = async (paymentMethodId: string)
```

**Função:** Remove um Payment Method do Customer.

**Validação:** Não permite remover o cartão padrão.

---

## 🎯 Stripe Elements

### Customer Session

Para maior segurança, o sistema usa **Stripe Customer Session**:

```typescript
// Criar sessão no backend
const { client_secret } = await createCustomerSession();

// Configurar no frontend
<Elements
  stripe={stripePromise}
  options={{
    customerSessionClientSecret: client_secret,
  }}
>
  <AddPaymentMethodDrawer />
</Elements>
```

**Vantagens:**
- Tokenização no navegador (nunca expõe dados do cartão)
- Componentes prontos e compatíveis com PCI-DSS
- Suporte a 3D Secure automático

---

## 🔒 Segurança

### Boas Práticas Implementadas

✅ **Nunca armazena dados do cartão no banco**
- Apenas Payment Method IDs do Stripe

✅ **Tokenização no cliente**
- Stripe Elements processa dados sensíveis

✅ **Validação de propriedade**
- Apenas o dono pode modificar seus cartões

✅ **HTTPS obrigatório em produção**
- Stripe requer conexão segura

✅ **Chaves separadas por ambiente**
- `sk_test_` para desenvolvimento
- `sk_live_` para produção

---

## 📱 UX/UI Design

### Estados Visuais

1. **Loading:** Spinner centralizado
2. **Empty State:** Mensagem + botão "Add your first card"
3. **Lista:** Cards com informações e ações
4. **Badge "Default":** Azul, destaque visual
5. **Drawer de Ações:** Mobile-friendly

### Responsividade

- **Mobile:** Drawer em tela cheia
- **Desktop:** Dropdown menu compacto
- **Ícones:** SVG escaláveis (parâmetro `size`)

---

## 🧪 Testando

### Cartões de Teste (Stripe Test Mode)

| Bandeira | Número | CVC | Data |
|----------|--------|-----|------|
| Visa | 4242 4242 4242 4242 | Qualquer | Futuro |
| Mastercard | 5555 5555 5555 4444 | Qualquer | Futuro |
| Amex | 3782 822463 10005 | Qualquer | Futuro |

**Nota:** Use qualquer CVC e data de expiração futura.

---

## 🚀 Próximos Passos (TODO)

- [ ] Implementar edição de cartão (atualizar billing_details)
- [ ] Adicionar suporte a mais bandeiras (Discover, Diners, etc.)
- [ ] Implementar checkout com cartão salvo
- [ ] Adicionar histórico de transações
- [ ] Suporte a Apple Pay / Google Pay

---

## 📚 Referências

- [Stripe Payment Methods API](https://stripe.com/docs/payments/payment-methods)
- [Stripe Elements](https://stripe.com/docs/stripe-js)
- [Customer Sessions](https://stripe.com/docs/payments/customer-session)
- [PCI Compliance](https://stripe.com/docs/security)
