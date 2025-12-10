# 🛒 Sistema de Checkout

Sistema completo de checkout com integração Stripe, seleção de endereço, cálculo de frete e processamento de pagamento.

## 📋 Visão Geral

O checkout permite que usuários autenticados:
- ✅ Visualizem resumo do pedido
- ✅ Selecionem endereço de entrega
- ✅ Escolham método de entrega (frete)
- ✅ Realizem pagamento via Stripe
- ✅ Utilizem cartões salvos ou adicionem novos

**Rota:** `/checkout`

---

## 🏗️ Arquitetura

### Estrutura de Arquivos

```
src/
├── app/checkout/
│   ├── page.tsx                      # Página principal
│   └── _components/
│       ├── order-summary.tsx         # Resumo do pedido
│       ├── address-section.tsx       # Seleção de endereço
│       ├── delivery-section.tsx      # Seleção de frete
│       ├── payment-section.tsx       # Pagamento (Stripe)
│       └── sticky-advance-button.tsx # Botão flutuante
├── actions/
│   ├── stripe/
│   │   └── initialize-checkout/
│   │       └── index.ts              # Inicializar checkout
│   ├── calculate-shipping/
│   │   ├── index.ts                  # Calcular frete
│   │   └── schema.ts                 # Validação
│   └── update-bag-shipping/
│       ├── index.ts                  # Atualizar frete na sacola
│       └── schema.ts                 # Validação
└── hooks/
    └── stripe/
        └── use-initialize-checkout.ts # Hook React Query
```

---

## 🔄 Fluxo do Checkout

```
1. Usuário acessa /checkout com itens na sacola
2. Sistema inicializa checkout:
   - Cria/atualiza Payment Intent no Stripe
   - Cria Customer Session
   - Busca endereços do usuário
3. Usuário seleciona/adiciona endereço
4. Sistema calcula opções de frete baseado no CEP
5. Usuário escolhe método de entrega
6. Sistema atualiza sacola com frete selecionado
7. Usuário preenche dados de pagamento (Stripe Elements)
8. Usuário confirma pedido
9. Stripe processa pagamento
10. Pedido é finalizado
```

---

## 🔧 Server Actions

### 1. Initialize Checkout

**Arquivo:** `src/actions/stripe/initialize-checkout/index.ts`

```typescript
export const initializeCheckout = async (): Promise<{
  clientSecret: string;
  customerSessionSecret: string;
  addresses: UserAddress[];
}>
```

**Responsabilidades:**
1. Buscar sacola do usuário
2. Validar se sacola tem itens
3. Buscar endereços do usuário
4. Criar/atualizar Payment Intent
5. Criar Customer Session (Stripe)

**Implementação:**
```typescript
export const initializeCheckout = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  // Buscar sacola
  const bag = await getBag();

  if (bag.totalPriceInCents <= 0) {
    throw new Error("Bag is empty");
  }

  // Buscar endereços
  const addresses = await getAllUserAddresses(session.user.id);

  // Criar/atualizar Payment Intent
  const paymentIntent = await createPaymentIntent(
    bag.id,
    bag.totalPriceInCents,
    `Order for ${session.user.email}`
  );

  // Criar Customer Session
  const customerSession = await createCustomerSession();

  return {
    clientSecret: paymentIntent.client_secret!,
    customerSessionSecret: customerSession.client_secret,
    addresses,
  };
};
```

---

### 2. Calculate Shipping

**Arquivo:** `src/actions/calculate-shipping/index.ts`

```typescript
export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: number;
}

export const calculateShipping = async (
  data: CalculateShippingSchema
): Promise<ShippingOption[]>
```

**Schema (schema.ts):**
```typescript
export const calculateShippingSchema = z.object({
  postalCode: z.string().min(8).max(9),
  productPriceInCents: z.number().min(0),
});
```

**Lógica de Cálculo:**
```typescript
// Baseado na região (primeiros 2 dígitos do CEP)
const region = parseInt(postalCode.substring(0, 2));

const basePriceInCents = 
  region < 20 ? 1500 :  // Sul/Sudeste
  region < 50 ? 2500 :  // Centro-Oeste
  region < 70 ? 3500 :  // Nordeste
  4500;                 // Norte

// Frete grátis para compras acima de R$ 299
const isFreeShippingEligible = productPriceInCents >= 29900;

// Opções de entrega
const shippingOptions: ShippingOption[] = [
  {
    id: "standard",
    name: "Standard Delivery",
    description: "Receive in up to 10 business days",
    price: isFreeShippingEligible ? 0 : basePriceInCents,
    estimatedDays: 10,
  },
  {
    id: "express",
    name: "Express Delivery",
    description: "Receive in up to 5 business days",
    price: Math.round(basePriceInCents * 1.8),
    estimatedDays: 5,
  },
  {
    id: "priority",
    name: "Priority Delivery",
    description: "Receive in up to 2 business days",
    price: Math.round(basePriceInCents * 2.5),
    estimatedDays: 2,
  },
];
```

**Regras:**
- Frete grátis (Standard) para compras ≥ R$ 299
- Express custa 1.8x o valor base
- Priority custa 2.5x o valor base

---

### 3. Update Bag Shipping

**Arquivo:** `src/actions/update-bag-shipping/index.ts`

```typescript
export const updateBagShipping = async (
  data: UpdateBagShippingSchema
)
```

**Schema (schema.ts):**
```typescript
export const updateBagShippingSchema = z.object({
  shippingMethod: z.string(),
  shippingPriceInCents: z.number().min(0),
});
```

**Comportamento:**
- Atualiza `bag.shippingMethod` e `bag.shippingPriceInCents`
- Recalcula `totalPriceInCents` (subtotal + frete)
- Atualiza Payment Intent no Stripe com novo valor

---

## 🎨 Componentes

### 1. Order Summary

**Arquivo:** `src/app/checkout/_components/order-summary.tsx`

**Features:**
- Lista todos os itens da sacola
- Exibe imagem, nome, cor, tamanho, quantidade
- Mostra preço unitário e total por item
- Cálculo de subtotal
- Responsivo (scroll horizontal em mobile)

**Dados exibidos:**
```typescript
{
  product.name
  variant.name (cor)
  size.name
  quantity
  variant.priceInCents
  total: quantity * priceInCents
}
```

---

### 2. Address Section

**Arquivo:** `src/app/checkout/_components/address-section.tsx`

**Features:**
- Exibe endereço padrão automaticamente
- Permite trocar endereço
- Permite adicionar novo endereço
- Integração com AddAddressDrawer
- Validação via React Hook Form

**Comportamento:**
```typescript
// Buscar endereço padrão
const defaultAddress = addresses.find(a => a.isDefault);

// Ao selecionar endereço
onChange={(addressId) => {
  // Salva na sacola
  // Recalcula frete
}}
```

**Estados:**
- Loading: Skeleton
- Sem endereço: Botão "Add Address"
- Com endereço: Exibe dados completos

---

### 3. Delivery Section

**Arquivo:** `src/app/checkout/_components/delivery-section.tsx`

**Features:**
- Calcula frete automaticamente baseado no endereço
- Exibe opções de entrega (Standard, Express, Priority)
- Permite seleção via Radio Group
- Atualiza sacola ao trocar opção
- Loading states durante cálculo

**Implementação:**
```typescript
useEffect(() => {
  const fetchShipping = async () => {
    if (!bag || !bagAddress?.zipCode) return;
    
    setIsLoading(true);
    
    const options = await calculateShipping({
      postalCode: bagAddress.zipCode,
      productPriceInCents: bag.totalPriceInCents,
    });
    
    setShippingOptions(options);
    
    // Pré-seleciona opção da sacola ou primeira
    if (bag.shippingMethod) {
      setSelectedOption(bag.shippingMethod);
    } else if (options.length > 0) {
      setSelectedOption(options[0].id);
    }
  };
  
  fetchShipping();
}, [bag?.userAddressId, bag?.totalPriceInCents]);
```

**Ao selecionar opção:**
```typescript
const handleShippingChange = async (optionId: string) => {
  const option = shippingOptions.find(opt => opt.id === optionId);
  
  await updateBagShipping({
    shippingMethod: option.id,
    shippingPriceInCents: option.price,
  });
  
  await queryClient.invalidateQueries({ queryKey: ["bag"] });
};
```

---

### 4. Payment Section

**Arquivo:** `src/app/checkout/_components/payment-section.tsx`

**Features:**
- Integração com Stripe Elements
- Payment Element (suporta múltiplos métodos)
- Auto-preenchimento de cartões salvos
- Billing address automático
- Tema customizado

**Implementação:**
```tsx
<PaymentElement
  options={{
    layout: {
      type: "accordion",
      radios: true,
      spacedAccordionItems: false,
    },
    fields: {
      billingDetails: {
        address: {
          country: "never", // Usa endereço de entrega
        },
        name: "auto",
      },
    },
    terms: {
      card: "auto",
    },
  }}
/>
```

---

### 5. Sticky Advance Button

**Arquivo:** `src/app/checkout/_components/sticky-advance-button.tsx`

**Features:**
- Botão fixo no rodapé (mobile)
- Exibe total do pedido
- Abre drawer com resumo completo ao clicar
- Botão "Advance to Payment" para finalizar

**Drawer exibe:**
- Todos os itens da sacola
- Método de pagamento selecionado
- Endereço de entrega
- Subtotal, Frete, Total

---

## 🎯 Integração Stripe

### Elementos Stripe Utilizados

#### 1. Payment Intent

**Criado em:** `initializeCheckout()`

**Características:**
- Valor baseado em `bag.totalPriceInCents`
- Vinculado ao Customer do usuário
- `payment_method_types: ["card"]`
- Metadata com informações do pedido
- Reutilizado se já existir (`bag.paymentIntentId`)

**Atualização:**
Quando frete é alterado, Payment Intent é atualizado:
```typescript
await stripe.paymentIntents.update(paymentIntentId, {
  amount: newTotalInCents,
});
```

---

#### 2. Customer Session

**Criado em:** `createCustomerSession()`

**Permite:**
- Usar Payment Element
- Salvar novos cartões
- Gerenciar cartões existentes
- Exibir cartões salvos

**Configuração:**
```typescript
const customerSession = await stripe.customerSessions.create({
  customer: customerId,
  components: {
    payment_element: {
      enabled: true,
      features: {
        payment_method_save: "enabled",
        payment_method_save_usage: "off_session",
        payment_method_remove: "enabled",
        payment_method_redisplay: "enabled",
      },
    },
  },
});
```

---

#### 3. Stripe Elements Provider

**Implementação na página:**
```tsx
<Elements
  stripe={stripePromise}
  options={{
    clientSecret: data.clientSecret,
    customerSessionClientSecret: data.customerSessionSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#353535",
        colorBackground: "#ffffff",
        fontFamily: "Geist, sans-serif",
        // ...
      },
    },
  }}
>
  {/* Componentes do checkout */}
</Elements>
```

---

## 🗄️ Schema do Banco

### Tabela `tb_bags`

Campos relacionados ao checkout:

```typescript
export const bagsTable = pgTable("tb_bags", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => usersTable.id).notNull(),
  
  // Checkout
  userAddressId: uuid("user_address_id")
    .references(() => userAddressesTable.id),
  shippingMethod: text("shipping_method"),
  shippingPriceInCents: integer("shipping_price_in_cents").default(0),
  paymentIntentId: text("payment_intent_id"),
  
  status: boolean("status").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

**Relações:**
- `userAddressId`: Endereço selecionado no checkout
- `shippingMethod`: ID da opção de frete ("standard", "express", "priority")
- `shippingPriceInCents`: Valor do frete em centavos
- `paymentIntentId`: ID do Payment Intent no Stripe

---

## 🔒 Validações e Segurança

### Autenticação

```typescript
// Todas as actions verificam autenticação
const session = await auth.api.getSession({
  headers: await headers(),
});

if (!session?.user) {
  throw new Error("User not authenticated");
}
```

---

### Propriedade da Sacola

```typescript
// Verifica se a sacola pertence ao usuário
if (bag.userId !== session.user.id) {
  throw new Error("Operation not allowed");
}
```

---

### Validação de Endereço

```typescript
// Verifica se endereço pertence ao usuário
const address = await db.query.userAddressesTable.findFirst({
  where: and(
    eq(userAddressesTable.id, addressId),
    eq(userAddressesTable.userId, session.user.id)
  ),
});

if (!address) {
  throw new Error("Address not found");
}
```

---

### Validação de Valores

```typescript
// Zod valida todos os inputs
calculateShippingSchema.parse(data);
updateBagShippingSchema.parse(data);

// Valores são sempre em centavos (evita problemas de ponto flutuante)
```

---

## 📱 Responsividade

### Mobile

- Layout em coluna única
- Sticky button no rodapé
- Drawer para resumo completo
- Scroll suave entre seções

### Desktop

- Layout em grid/flexbox
- Sidebar com resumo fixo (planejado)
- Botão de finalização visível

---

## 🚀 Como Testar

### 1. Configurar Stripe

```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

### 2. Adicionar Produtos à Sacola

```bash
# Navegue pelo site
# Adicione produtos à sacola
# Vá para /checkout
```

---

### 3. Testar Fluxo Completo

```
1. Acesse /checkout
2. Verifique se endereço padrão aparece
3. Adicione novo endereço (se necessário)
4. Aguarde cálculo de frete
5. Selecione opção de entrega
6. Preencha dados do cartão (teste Stripe)
   - Número: 4242 4242 4242 4242
   - Data: Qualquer futura
   - CVC: Qualquer 3 dígitos
7. Clique em "Pay"
8. Verifique se pagamento foi processado
```

---

### 4. Testar Cartões de Teste Stripe

| Cenário | Número do Cartão | Resultado |
|---------|------------------|-----------|
| Sucesso | 4242 4242 4242 4242 | Aprovado |
| Recusado | 4000 0000 0000 0002 | Recusado (generic) |
| 3D Secure | 4000 0027 6000 3184 | Requer autenticação |

**Mais:** https://stripe.com/docs/testing

---

## 💡 Boas Práticas

### Performance

- ✅ React Query cache automático
- ✅ Debounce em cálculos de frete
- ✅ Skeletons durante loading
- ✅ Invalidação seletiva de queries

### UX

- ✅ Feedback visual em todas as ações
- ✅ Mensagens de erro descritivas
- ✅ Auto-seleção de endereço padrão
- ✅ Auto-seleção de frete mais barato
- ✅ Preview do total antes de pagar

### Segurança

- ✅ Validação em múltiplas camadas
- ✅ Tokens Stripe não expostos
- ✅ Server-side validation
- ✅ HTTPS obrigatório em produção

---

## 🔗 Relacionado

- [Métodos de Pagamento](./payment-methods.md) - Gerenciamento de cartões
- [Endereços](./addresses.md) - Sistema de endereços
- [Sacola de Compras](./shopping-bag.md) - Gerenciamento da sacola
- [Autenticação](./authentication.md) - Sistema de login

---

## 📖 Próximos Passos

### Features Planejadas

- [ ] Cupons de desconto
- [ ] Rastreamento de pedido
- [ ] Histórico de compras
- [ ] Notificação de status
- [ ] One-click checkout (cartão salvo)
- [ ] Apple Pay / Google Pay
- [ ] PIX (pagamento brasileiro)
- [ ] Boleto bancário
