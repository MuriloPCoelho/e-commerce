# 🗂️ Padrão Repository (Data Access Layer)

Documentação completa do padrão Repository implementado no projeto.

## 📋 Índice

- [O que é o Padrão Repository](#o-que-é-o-padrão-repository)
- [Por que usar](#por-que-usar)
- [Estrutura](#estrutura)
- [Repositories Disponíveis](#repositories-disponíveis)
- [Como Usar](#como-usar)
- [Exemplos Práticos](#exemplos-práticos)
- [Migrando de Actions](#migrando-de-actions)

---

## 🎯 O que é o Padrão Repository

O Repository Pattern é um padrão de design que abstrai a lógica de acesso a dados, criando uma camada intermediária entre a lógica de negócio e a fonte de dados.

### Antes (Actions diretas)

```typescript
// src/actions/get-bag/index.ts
export async function getBag() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session?.user) throw new Error("Unauthorized");

  return await db.query.bagsTable.findFirst({
    where: eq(bagsTable.userId, session.user.id),
    with: { items: {...} },
  });
}
```

### Depois (Repository Pattern)

```typescript
// src/repositories/bagRepository.tsx
export async function getCurrentUserBagWithItems() {
  const user = await getCurrentUser();
  if (user == null) return redirect("/sign-in");

  return await db.query.bagsTable.findFirst({
    where: eq(bagsTable.userId, user.id),
    with: { items: {...} },
  });
}
```

---

## 💡 Por que usar

| Benefício | Descrição |
|-----------|-----------|
| 🎯 **Controle Granular** | Escolha quais colunas buscar do banco |
| ♻️ **Reutilização** | Mesmas queries em vários lugares |
| 🔒 **Type-Safety** | TypeScript garante segurança de tipos |
| 🧪 **Testabilidade** | Fácil de mockar e testar |
| 📖 **Manutenibilidade** | Lógica centralizada em um lugar |
| ⚡ **Performance** | Busque apenas o necessário |

---

## 📁 Estrutura

```
src/repositories/
├── index.ts                    # Exports centralizados
├── bagRepository.tsx           # Operações com sacolas
├── bagItemRepository.tsx       # Operações com itens da sacola
├── productRepository.tsx       # Operações com produtos
├── userRepository.tsx          # Operações com usuários
└── menuRepository.tsx          # Operações com menus
```

---

## 📦 Repositories Disponíveis

### 1. **bagRepository.tsx**

Gerenciamento de sacolas de compras.

**Funções:**
- `getCurrentUserBag()` - Busca sacola com colunas selecionáveis
- `getCurrentUserBagWithItems()` - Busca sacola com todos os itens
- `createBag()` - Cria nova sacola
- `updateBagAddress()` - Atualiza endereço da sacola
- `updateBagStatus()` - Atualiza status da sacola
- `getOrCreateBag()` - Busca ou cria sacola

### 2. **bagItemRepository.tsx**

Gerenciamento de itens na sacola.

**Funções:**
- `getCurrentUserBagItems()` - Lista todos os itens
- `getBagItem()` - Busca item específico
- `addProductToBag()` - Adiciona produto à sacola
- `updateBagItemQuantity()` - Atualiza quantidade
- `removeBagItem()` - Remove item
- `clearBag()` - Limpa toda a sacola

### 3. **productRepository.tsx**

Gerenciamento de produtos.

**Funções:**
- `getProductBySlug()` - Busca produto por slug
- `getProductBySlugWithVariants()` - Busca produto com variantes
- `getAllProducts()` - Lista todos os produtos
- `getAllProductsWithRelations()` - Lista produtos com relações
- `getProductsByCategory()` - Filtra por categoria
- `getProductsByBrand()` - Filtra por marca
- `getProductVariantBySlug()` - Busca variante específica
- `getProductVariantSizes()` - Lista tamanhos disponíveis
- `getProductVariantSize()` - Busca tamanho específico

### 4. **userRepository.tsx**

Gerenciamento de usuários e endereços.

**Funções:**
- `getCurrentUserData()` - Dados do usuário atual
- `getUserById()` - Busca usuário por ID
- `getUserByEmail()` - Busca usuário por email
- `updateCurrentUser()` - Atualiza dados do usuário
- `getCurrentUserAddresses()` - Lista endereços do usuário
- `createUserAddress()` - Cria novo endereço
- `updateUserAddress()` - Atualiza endereço
- `deleteUserAddress()` - Remove endereço

### 5. **menuRepository.tsx**

Gerenciamento de menus de navegação.

**Funções:**
- `getAllMenus()` - Lista todos os menus
- `getMenus()` - Menus em árvore hierárquica
- `getActiveMenus()` - Apenas menus ativos
- `getMainMenus()` - Menus principais (sem pai)
- `getMenuBySlug()` - Busca menu por slug
- `getSubMenus()` - Submenus de um menu pai

---

## 🚀 Como Usar

### Importação

```typescript
// Importação individual
import { getCurrentUserBagWithItems } from "@/repositories/bagRepository";

// Importação centralizada (recomendado)
import { 
  getCurrentUserBagWithItems,
  addProductToBag,
  getMenus
} from "@/repositories";
```

### Em Server Component

```tsx
import { getCurrentUserBagWithItems } from "@/repositories";

export default async function BagPage() {
  const bag = await getCurrentUserBagWithItems();
  
  return (
    <div>
      <h1>Minha Sacola</h1>
      <p>Total de itens: {bag.items.length}</p>
      {bag.items.map(item => (
        <div key={item.id}>
          {item.productVariantSize.variant.product.name}
        </div>
      ))}
    </div>
  );
}
```

### Em Client Component com React Query

```tsx
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCurrentUserBagWithItems, addProductToBag } from "@/repositories";

export function MyComponent() {
  const queryClient = useQueryClient();

  // Query para buscar sacola
  const { data: bag, isLoading } = useQuery({
    queryKey: ["bag"],
    queryFn: getCurrentUserBagWithItems,
  });

  // Mutation para adicionar produto
  const { mutate: addToBag } = useMutation({
    mutationFn: (productVariantSizeId: number) => 
      addProductToBag(productVariantSizeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bag"] });
    },
  });

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div>
      <h1>Minha Sacola ({bag?.items.length} itens)</h1>
      <button onClick={() => addToBag(123)}>
        Adicionar Produto
      </button>
    </div>
  );
}
```

---

## 💡 Exemplos Práticos

### Exemplo 1: Buscar Sacola com Colunas Específicas

```typescript
import { getCurrentUserBag } from "@/repositories";

// Busca apenas ID e status
const bag = await getCurrentUserBag({
  id: true,
  status: true,
});

// Retorna: { id: "uuid", status: true }
```

### Exemplo 2: Buscar Produto por Slug

```typescript
import { getProductBySlugWithVariants } from "@/repositories";

const product = await getProductBySlugWithVariants("camiseta-basica");

// Retorna produto com:
// - Categoria
// - Marca
// - Todas as variantes com cores
```

### Exemplo 3: Adicionar Produto à Sacola

```typescript
import { addProductToBag } from "@/repositories";

try {
  const item = await addProductToBag(productVariantSizeId);
  console.log("Produto adicionado:", item);
} catch (error) {
  console.error("Erro:", error);
}
```

### Exemplo 4: Buscar Menus Hierárquicos

```typescript
import { getMenus } from "@/repositories";

const menus = await getMenus();

// Retorna árvore completa:
// [
//   {
//     id: 1,
//     name: "Calçados",
//     href: "/calcados",
//     children: [
//       { id: 10, name: "Tênis", href: "/calcados/tenis" }
//     ]
//   }
// ]
```

### Exemplo 5: Criar Endereço do Usuário

```typescript
import { createUserAddress } from "@/repositories";

const address = await createUserAddress({
  recipientName: "João Silva",
  phone: "(11) 98765-4321",
  street: "Rua das Flores",
  number: "123",
  complement: "Apto 45",
  neighborhood: "Centro",
  city: "São Paulo",
  state: "SP",
  zipCode: "01234-567",
  country: "Brasil",
});
```

---

## 🔄 Migrando de Actions

### Antes (Actions antigas)

```typescript
// Importações antigas
import { getMenus } from "@/actions/get-menus";
import { addProductToBag } from "@/actions/add-bag-product";
import { getBag } from "@/actions/get-bag";
```

### Depois (Repository Pattern)

```typescript
// Importações novas
import { 
  getMenus,
  addProductToBag,
  getCurrentUserBagWithItems 
} from "@/repositories";
```

### Mapeamento de Funções

| Action Antiga | Repository Novo |
|---------------|-----------------|
| `getBag()` | `getCurrentUserBagWithItems()` |
| `addProductToBag(data)` | `addProductToBag(productVariantSizeId)` |
| `getMenus()` | `getMenus()` ✅ (mesmo nome) |

---

## 🎓 Padrão de Implementação

### Função com Controle de Colunas

```typescript
export async function getCurrentUserBag<
  const T extends { [K in keyof typeof bagsTable.$inferSelect]?: boolean }
>(columns: T) {
  const user = await getCurrentUser();
  if (user == null) return redirect("/sign-in");

  return await db.query.bagsTable.findFirst({
    where: eq(bagsTable.userId, user.id),
    columns, // Colunas dinâmicas
  });
}
```

### Função com Relações Completas

```typescript
export async function getCurrentUserBagWithItems() {
  const user = await getCurrentUser();
  if (user == null) return redirect("/sign-in");

  return await db.query.bagsTable.findFirst({
    where: eq(bagsTable.userId, user.id),
    with: {
      items: {
        with: {
          productVariantSize: {
            with: {
              variant: { with: { product: true, color: true } },
              size: true,
            },
          },
        },
      },
    },
  });
}
```

### Função de Escrita (CRUD)

```typescript
export async function updateBagAddress(userAddressId: string) {
  const user = await getCurrentUser();
  if (user == null) return redirect("/sign-in");

  const [bag] = await db
    .update(bagsTable)
    .set({ userAddressId })
    .where(eq(bagsTable.userId, user.id))
    .returning();

  return bag;
}
```

---

## ✅ Boas Práticas

1. **Use funções específicas**
   - Prefira `getCurrentUserBagWithItems()` quando precisar de relações
   - Use `getCurrentUserBag({ id: true })` quando precisar só de ID

2. **Selecione apenas o necessário**
   - Controle de colunas otimiza queries
   - Menos dados = mais rápido

3. **Trate erros**
   - Sempre use try/catch em client components
   - Exiba mensagens amigáveis ao usuário

4. **Invalide cache**
   - Use `queryClient.invalidateQueries()` após mutations
   - Garante dados sempre atualizados

5. **Tipos são seus amigos**
   - TypeScript detecta erros em tempo de desenvolvimento
   - Autocomplete funciona perfeitamente

---

## 📚 Referências

- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)
- [TypeScript Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [TanStack Query](https://tanstack.com/query/latest)

---

**📅 Última atualização:** Outubro 2025  
**📌 Versão:** 1.0
