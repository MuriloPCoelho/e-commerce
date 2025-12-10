# 📍 Sistema de Endereços

Sistema completo de gerenciamento de endereços de entrega dos usuários com suporte a múltiplos endereços e endereço padrão.

## 📋 Visão Geral

O sistema de endereços permite que usuários autenticados:
- ✅ Cadastrem múltiplos endereços de entrega
- ✅ Definam um endereço como padrão
- ✅ Editem endereços existentes
- ✅ Removam endereços
- ✅ Utilizem endereços no checkout

**Rota:** `/user/addresses`

---

## 🗄️ Schema do Banco de Dados

### Tabela `tb_user_addresses`

```typescript
export const userAddressesTable = pgTable("tb_user_addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .references(() => usersTable.id)
    .notNull(),
  recipientName: text("recipient_name").notNull(),
  phone: text("phone").notNull(),
  street: text("street").notNull(),
  number: text("number").notNull(),
  complement: text("complement"),
  neighborhood: text("neighborhood").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  country: text("country").notNull(),
  label: text("label"),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

### Campos

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único |
| `userId` | Text | Referência ao usuário |
| `recipientName` | Text | Nome do destinatário |
| `phone` | Text | Telefone (apenas números) |
| `street` | Text | Rua/Avenida |
| `number` | Text | Número do endereço |
| `complement` | Text | Complemento (opcional) |
| `neighborhood` | Text | Bairro |
| `city` | Text | Cidade |
| `state` | Text | Estado (2 caracteres, ex: SP) |
| `zipCode` | Text | CEP (apenas números, 8 dígitos) |
| `country` | Text | País |
| `label` | Text | Etiqueta/apelido (ex: "Casa", "Trabalho") |
| `isDefault` | Boolean | Define se é o endereço padrão |
| `createdAt` | Timestamp | Data de criação |

---

## 🏗️ Arquitetura

### Estrutura de Arquivos

```
src/
├── app/(main)/user/addresses/
│   ├── page.tsx                      # Página de listagem
│   └── _components/
│       ├── address-card.tsx          # Card de endereço
│       ├── add-address-drawer.tsx    # Drawer para adicionar
│       └── edit-address-drawer.tsx   # Drawer para editar
├── actions/addresses/
│   ├── create-user-address/
│   │   ├── index.ts                  # Criar endereço
│   │   └── schema.ts                 # Validação
│   ├── get-all-user-addresses/
│   │   └── index.ts                  # Listar todos
│   ├── get-user-address/
│   │   └── index.ts                  # Buscar um endereço
│   ├── update-user-address/
│   │   ├── index.ts                  # Atualizar
│   │   └── schema.ts                 # Validação
│   ├── remove-user-address/
│   │   └── index.ts                  # Remover
│   └── set-default-user-address/
│       └── index.ts                  # Definir como padrão
└── hooks/address/
    ├── use-all-user-addresses.ts     # Hook para listar
    ├── use-create-address.ts         # Hook para criar
    ├── use-update-address.ts         # Hook para atualizar
    ├── use-remove-address.ts         # Hook para remover
    └── use-set-default-address.ts    # Hook para definir padrão
```

---

## 🔧 Server Actions

### 1. Create User Address

**Arquivo:** `src/actions/addresses/create-user-address/index.ts`

```typescript
export const createUserAddress = async (data: CreateAddressSchema)
```

**Validação (schema.ts):**
```typescript
export const createAddressSchema = z.object({
  recipientName: z.string().min(3, "Name must be at least 3 characters"),
  phone: z.string().min(10, "Invalid phone number"),
  street: z.string().min(3, "Street is required"),
  number: z.string().min(1, "Number is required"),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, "Neighborhood is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().length(2, "State must be 2 characters (e.g., SP)"),
  zipCode: z.string().min(8, "Invalid zip code"),
  country: z.string(),
  label: z.string().optional(),
  isDefault: z.boolean(),
});
```

**Comportamento:**
- Se for o primeiro endereço, automaticamente se torna padrão
- Se `isDefault: true`, remove a flag de outros endereços
- Valida autenticação do usuário

---

### 2. Get All User Addresses

**Arquivo:** `src/actions/addresses/get-all-user-addresses/index.ts`

```typescript
export const getAllUserAddresses = async (userId: string)
```

**Retorna:** Array de endereços do usuário ordenados por padrão primeiro.

---

### 3. Get User Address

**Arquivo:** `src/actions/addresses/get-user-address/index.ts`

```typescript
export const getUserAddress = async (addressId: string)
```

**Validações:**
- Verifica autenticação
- Verifica se o endereço pertence ao usuário

---

### 4. Update User Address

**Arquivo:** `src/actions/addresses/update-user-address/index.ts`

```typescript
export const updateUserAddress = async (
  addressId: string,
  data: UpdateAddressSchema
)
```

**Schema:** Mesma validação de criação.

**Comportamento:**
- Se `isDefault: true`, remove flag de outros endereços
- Revalida caminho após atualização

---

### 5. Remove User Address

**Arquivo:** `src/actions/addresses/remove-user-address/index.ts`

```typescript
export const removeUserAddress = async (addressId: string)
```

**Validações:**
- Não permite remover endereço padrão sem antes definir outro
- Verifica propriedade do endereço

---

### 6. Set Default User Address

**Arquivo:** `src/actions/addresses/set-default-user-address/index.ts`

```typescript
export const setDefaultUserAddress = async (addressId: string)
```

**Comportamento:**
- Remove flag `isDefault` de todos os outros endereços
- Define o endereço selecionado como padrão

---

## 🎯 Custom Hooks (React Query)

### useAllUserAddresses

```typescript
export function useAllUserAddresses(userId: string) {
  return useQuery({
    queryKey: ["user-addresses", userId],
    queryFn: async () => getAllUserAddresses(userId),
    enabled: !!userId,
  });
}
```

### useCreateAddress

```typescript
export function useCreateAddress() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createUserAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
    },
  });
}
```

### useUpdateAddress

```typescript
export function useUpdateAddress() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ addressId, data }) => 
      updateUserAddress(addressId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
    },
  });
}
```

### useRemoveAddress

```typescript
export function useRemoveAddress() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: removeUserAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
    },
  });
}
```

### useSetDefaultAddress

```typescript
export function useSetDefaultAddress() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: setDefaultUserAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
    },
  });
}
```

---

## 🎨 Componentes

### AddressCard

**Arquivo:** `src/app/(main)/user/addresses/_components/address-card.tsx`

**Features:**
- Exibe informações completas do endereço
- Badge "Default" para endereço padrão
- Botões de ação: Editar, Remover, Definir como padrão
- Confirmação antes de remover
- Loading states

**Props:**
```typescript
interface AddressCardProps {
  address: Address;
}
```

---

### AddAddressDrawer

**Arquivo:** `src/app/(main)/user/addresses/_components/add-address-drawer.tsx`

**Features:**
- Drawer em tela cheia (mobile)
- Formulário completo com validação (React Hook Form + Zod)
- Máscaras automáticas (CEP, Telefone)
- Checkbox "Set as default address"
- Se for o primeiro endereço, automaticamente define como padrão
- Estados de loading

**Campos:**
- Recipient Name
- Phone (máscara: (99) 99999-9999)
- ZIP Code (máscara: 99999-999)
- Street
- Number
- Complement (opcional)
- Neighborhood
- City
- State (2 caracteres)
- Country (padrão: "Brazil")
- Label (opcional, ex: "Casa", "Trabalho")
- Is Default (checkbox)

---

### EditAddressDrawer

**Arquivo:** `src/app/(main)/user/addresses/_components/edit-address-drawer.tsx`

**Features:**
- Mesma estrutura do AddAddressDrawer
- Pré-preenche campos com dados existentes
- Atualiza em vez de criar

---

## 📱 Página de Endereços

**Arquivo:** `src/app/(main)/user/addresses/page.tsx`

**Features:**
- Lista todos os endereços do usuário
- Botão "Add Address" no header
- Skeleton loading durante carregamento
- Empty state quando não há endereços
- Grid responsivo de cards

**Comportamento:**
```typescript
const { data: addresses = [], isLoading } = useAllUserAddresses(userId);
```

---

## 🔄 Integração com Checkout

O sistema de endereços é utilizado no checkout:

1. **Seleção de Endereço:**
   - Usuário seleciona endereço de entrega
   - Endereço padrão é pré-selecionado

2. **Cálculo de Frete:**
   - Baseado no CEP do endereço selecionado
   - Atualiza automaticamente ao trocar endereço

3. **Payment Intent:**
   - Endereço é vinculado à sacola (`bag.userAddressId`)
   - Usado para processar pagamento

**Relacionamento no Schema:**
```typescript
export const bagsTable = pgTable("tb_bags", {
  // ...
  userAddressId: uuid("user_address_id")
    .references(() => userAddressesTable.id),
  // ...
});
```

---

## 🎯 Fluxo de Uso

### Adicionar Primeiro Endereço

```
1. Usuário acessa /user/addresses
2. Clica em "Add Address"
3. Preenche formulário
4. Sistema detecta que é o primeiro endereço
5. Automaticamente define como padrão (isDefault: true)
6. Salva no banco
7. Recarrega lista
```

### Adicionar Endereço Adicional

```
1. Usuário acessa /user/addresses
2. Clica em "Add Address"
3. Preenche formulário
4. Opcionalmente marca "Set as default"
5. Se marcar, remove flag de endereço atual
6. Salva no banco
7. Recarrega lista
```

### Editar Endereço

```
1. Usuário clica em "Edit" no card
2. Drawer abre com dados pré-preenchidos
3. Usuário edita campos
4. Salva alterações
5. Recarrega lista
```

### Remover Endereço

```
1. Usuário clica em "Remove"
2. Confirmação é solicitada
3. Verifica se não é o único endereço padrão
4. Remove do banco
5. Recarrega lista
```

### Definir como Padrão

```
1. Usuário clica em "Set as default"
2. Remove isDefault de outros endereços
3. Define isDefault: true no endereço selecionado
4. Recarrega lista
```

---

## 🔒 Segurança

- ✅ Todas as actions validam autenticação via Better Auth
- ✅ Verificação de propriedade: endereços só podem ser manipulados pelo dono
- ✅ Validação de dados via Zod antes de salvar
- ✅ SQL injection protegido pelo Drizzle ORM
- ✅ Telefone e CEP são armazenados apenas com números

---

## 💡 Boas Práticas

### Formatação de Dados

**CEP:**
```typescript
// Armazenado: "12345678"
// Exibido: "12345-678"
```

**Telefone:**
```typescript
// Armazenado: "11999998888"
// Exibido: "(11) 99999-8888"
```

### Validações no Frontend

- Máscaras automáticas durante digitação
- Validação em tempo real (Zod + React Hook Form)
- Mensagens de erro descritivas

### Validações no Backend

- Schema Zod completo
- Verificação de autenticação
- Verificação de propriedade
- Normalização de dados (remover caracteres especiais)

---

## 🚀 Como Testar

1. **Adicionar Endereço:**
```bash
# Acesse a aplicação
http://localhost:3000/user/addresses

# Clique em "Add Address"
# Preencha o formulário
# Clique em "Save"
```

2. **Verificar no Checkout:**
```bash
# Adicione produtos à sacola
# Acesse /checkout
# Verifique se o endereço padrão aparece
```

3. **Testar Múltiplos Endereços:**
```bash
# Adicione 2-3 endereços
# Defina cada um como padrão
# Verifique se apenas um fica como padrão
```

---

## 🔗 Relacionado

- [Sistema de Checkout](./checkout.md) - Como endereços são usados no checkout
- [Área do Usuário](./user-account.md) - Navegação completa da área do usuário
- [Database Schema](../architecture/database-schema.md) - Estrutura completa do banco
