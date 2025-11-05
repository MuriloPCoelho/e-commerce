# 🛒 Sistema de Sacola de Compras

> Sistema completo de carrinho de compras (bag/cart) com persistência por usuário, gerenciamento de itens e integração com Server Actions.

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Estrutura do Banco de Dados](#-estrutura-do-banco-de-dados)
- [Server Actions](#-server-actions)
- [Componentes](#-componentes)
- [Fluxo de Uso](#-fluxo-de-uso)
- [Exemplos de Código](#-exemplos-de-código)
- [Boas Práticas](#-boas-práticas)

---

## 🎯 Visão Geral

O sistema de sacola (bag) permite que usuários:
- ✅ Adicionem produtos à sacola
- ✅ Selecionem tamanho e cor específicos
- ✅ Gerenciem quantidades
- ✅ Removam itens
- ✅ Visualizem resumo e total
- ✅ Persistam a sacola entre sessões

### Características

- **Persistência**: Sacola salva no banco de dados
- **Por Usuário**: Cada usuário tem sua própria sacola
- **Type-Safe**: Totalmente tipado com TypeScript
- **Validação**: Schemas Zod para validação de dados
- **Server Actions**: Operações otimizadas no servidor

---

## 🗄️ Estrutura do Banco de Dados

### Tabela: `tb_bags`

Armazena as sacolas dos usuários.

```sql
CREATE TABLE tb_bags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE REFERENCES user(id),
  user_address_id UUID REFERENCES tb_user_addresses(id),
  status BOOLEAN NOT NULL DEFAULT false, -- false = ativa, true = finalizada
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Campos:**
- `id`: Identificador único da sacola
- `user_id`: ID do usuário (relação 1:1)
- `user_address_id`: Endereço selecionado (opcional)
- `status`: Status da sacola (ativa/finalizada)
- `created_at`: Data de criação

### Tabela: `tb_bag_items`

Armazena os itens dentro de cada sacola.

```sql
CREATE TABLE tb_bag_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bag_id UUID NOT NULL REFERENCES tb_bags(id),
  product_variant_size_id INTEGER NOT NULL REFERENCES tb_product_variant_sizes(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Campos:**
- `id`: Identificador único do item
- `bag_id`: ID da sacola
- `product_variant_size_id`: Variante específica (cor + tamanho)
- `quantity`: Quantidade do produto
- `created_at`: Data de adição

### Relações

```typescript
// Em src/db/schema.ts

export const bagsRelations = relations(bagsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [bagsTable.userId],
    references: [usersTable.id],
  }),
  userAddress: one(userAddressesTable, {
    fields: [bagsTable.userAddressId],
    references: [userAddressesTable.id],
  }),
  items: many(bagItemsTable),
}));

export const bagItemsRelations = relations(bagItemsTable, ({ one }) => ({
  bag: one(bagsTable, {
    fields: [bagItemsTable.bagId],
    references: [bagsTable.id],
  }),
  productVariantSize: one(productVariantSizesTable, {
    fields: [bagItemsTable.productVariantSizeId],
    references: [productVariantSizesTable.id],
  }),
}));
```

---

## ⚡ Server Actions

### 1. Adicionar Produto à Sacola

```typescript
// src/actions/add-bag-product/index.ts

"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { bagsTable, bagItemsTable } from "@/db/schema";
import { addBagProductSchema } from "./schema";
import { eq, and } from "drizzle-orm";

export async function addBagProduct(
  productVariantSizeId: number
) {
  // Validação com Zod
  const validated = addBagProductSchema.parse({ productVariantSizeId });

  // Verificar autenticação
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Usuário não autenticado");
  }

  // Buscar ou criar sacola do usuário
  let bag = await db.query.bagsTable.findFirst({
    where: and(
      eq(bagsTable.userId, session.user.id),
      eq(bagsTable.status, false) // Sacola ativa
    ),
  });

  if (!bag) {
    // Criar nova sacola
    const [newBag] = await db
      .insert(bagsTable)
      .values({
        userId: session.user.id,
        status: false,
      })
      .returning();
    bag = newBag;
  }

  // Verificar se o item já existe na sacola
  const existingItem = await db.query.bagItemsTable.findFirst({
    where: and(
      eq(bagItemsTable.bagId, bag.id),
      eq(bagItemsTable.productVariantSizeId, validated.productVariantSizeId)
    ),
  });

  if (existingItem) {
    // Incrementar quantidade
    await db
      .update(bagItemsTable)
      .set({ quantity: existingItem.quantity + 1 })
      .where(eq(bagItemsTable.id, existingItem.id));
  } else {
    // Adicionar novo item
    await db.insert(bagItemsTable).values({
      bagId: bag.id,
      productVariantSizeId: validated.productVariantSizeId,
      quantity: 1,
    });
  }

  return { success: true };
}
```

### 2. Buscar Sacola do Usuário

```typescript
// src/actions/get-bag/index.ts

"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { eq, and } from "drizzle-orm";

export async function getBag() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  const bag = await db.query.bagsTable.findFirst({
    where: and(
      eq(bagsTable.userId, session.user.id),
      eq(bagsTable.status, false)
    ),
    with: {
      items: {
        with: {
          productVariantSize: {
            with: {
              variant: {
                with: {
                  product: {
                    with: {
                      brand: true,
                    },
                  },
                  color: true,
                },
              },
              size: true,
            },
          },
        },
      },
    },
  });

  return bag;
}
```

### 3. Remover Produto da Sacola

```typescript
// src/actions/remove-bag-product/index.ts

"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { bagItemsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function removeBagProduct(bagItemId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Usuário não autenticado");
  }

  // Deletar item
  await db
    .delete(bagItemsTable)
    .where(eq(bagItemsTable.id, bagItemId));

  return { success: true };
}
```

### 4. Atualizar Quantidade

```typescript
// src/actions/update-bag-item-quantity/index.ts

"use server";

import { db } from "@/db";
import { bagItemsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function updateBagItemQuantity(
  bagItemId: string,
  quantity: number
) {
  if (quantity < 1) {
    throw new Error("Quantidade deve ser maior que 0");
  }

  await db
    .update(bagItemsTable)
    .set({ quantity })
    .where(eq(bagItemsTable.id, bagItemId));

  return { success: true };
}
```

---

## 🎨 Componentes

### Componente: Drawer da Sacola

```typescript
// src/components/commom/bag.tsx

"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { getBag } from "@/actions/get-bag";
import { BagItem } from "./bag-item";

export function Bag({ open, onOpenChange }: BagProps) {
  const { data: bag, isLoading } = useQuery({
    queryKey: ["bag"],
    queryFn: getBag,
  });

  const total = bag?.items.reduce((acc, item) => {
    return acc + item.productVariantSize.variant.priceInCents * item.quantity;
  }, 0) ?? 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Sacola ({bag?.items.length ?? 0})</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 mt-8">
          {isLoading && <p>Carregando...</p>}

          {bag?.items.map((item) => (
            <BagItem key={item.id} item={item} />
          ))}

          {bag?.items.length === 0 && (
            <p className="text-center text-muted-foreground">
              Sua sacola está vazia
            </p>
          )}
        </div>

        {bag && bag.items.length > 0 && (
          <div className="mt-8 border-t pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>R$ {(total / 100).toFixed(2)}</span>
            </div>

            <button className="w-full mt-4 bg-black text-white py-3 rounded-lg">
              Finalizar Compra
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
```

### Componente: Item da Sacola

```typescript
// src/components/commom/bag-item.tsx

"use client";

import { removeBagProduct } from "@/actions/remove-bag-product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QuantitySelector } from "./quantity-selector";

export function BagItem({ item }: BagItemProps) {
  const queryClient = useQueryClient();

  const removeMutation = useMutation({
    mutationFn: removeBagProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bag"] });
    },
  });

  const { variant, size } = item.productVariantSize;
  const { product, color, priceInCents } = variant;

  return (
    <div className="flex gap-4 border-b pb-4">
      <img
        src={variant.imageUrl}
        alt={product.name}
        className="w-24 h-24 object-cover rounded"
      />

      <div className="flex-1">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-sm text-muted-foreground">
          {product.brand.name}
        </p>
        <p className="text-sm">
          Cor: {color.name} | Tamanho: {size.name}
        </p>

        <div className="flex items-center gap-4 mt-2">
          <QuantitySelector
            value={item.quantity}
            itemId={item.id}
          />

          <button
            onClick={() => removeMutation.mutate(item.id)}
            className="text-sm text-red-500"
          >
            Remover
          </button>
        </div>

        <p className="font-bold mt-2">
          R$ {((priceInCents * item.quantity) / 100).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
```

### Componente: Botão Adicionar à Sacola

```typescript
// src/app/p/[slug]/components/add-to-bag-button.tsx

"use client";

import { addBagProduct } from "@/actions/add-bag-product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function AddToBagButton({ 
  productVariantSizeId 
}: AddToBagButtonProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => addBagProduct(productVariantSizeId),
    onSuccess: () => {
      toast.success("Produto adicionado à sacola!");
      queryClient.invalidateQueries({ queryKey: ["bag"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <button
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      className="w-full bg-black text-white py-3 rounded-lg disabled:opacity-50"
    >
      {mutation.isPending ? "Adicionando..." : "Adicionar à Sacola"}
    </button>
  );
}
```

---

## 🔄 Fluxo de Uso

### 1. Página do Produto
```
Usuário visualiza produto
  ↓
Seleciona cor e tamanho
  ↓
Clica em "Adicionar à Sacola"
  ↓
Server Action: addBagProduct()
  ↓
Item adicionado (ou quantidade incrementada)
```

### 2. Visualização da Sacola
```
Usuário clica no ícone da sacola
  ↓
Abre drawer lateral (Sheet)
  ↓
React Query busca dados: getBag()
  ↓
Exibe lista de itens com totais
```

### 3. Gerenciamento de Itens
```
Usuário altera quantidade
  ↓
Server Action: updateBagItemQuantity()
  ↓
React Query revalida cache
  ↓
UI atualizada automaticamente
```

---

## 💡 Exemplos de Código

### Calcular Total da Sacola

```typescript
function calculateBagTotal(bag: Bag) {
  return bag.items.reduce((total, item) => {
    const itemPrice = item.productVariantSize.variant.priceInCents;
    return total + (itemPrice * item.quantity);
  }, 0);
}

// Uso
const totalInCents = calculateBagTotal(bag);
const totalInReais = totalInCents / 100;
```

### Verificar Estoque Antes de Adicionar

```typescript
async function addBagProductWithStockCheck(
  productVariantSizeId: number
) {
  // Buscar estoque disponível
  const variantSize = await db.query.productVariantSizesTable.findFirst({
    where: eq(productVariantSizesTable.id, productVariantSizeId),
  });

  if (!variantSize || variantSize.stock < 1) {
    throw new Error("Produto fora de estoque");
  }

  // Verificar quantidade já na sacola
  const currentBagItem = await db.query.bagItemsTable.findFirst({
    where: and(
      eq(bagItemsTable.bagId, bagId),
      eq(bagItemsTable.productVariantSizeId, productVariantSizeId)
    ),
  });

  const currentQuantity = currentBagItem?.quantity ?? 0;

  if (currentQuantity + 1 > variantSize.stock) {
    throw new Error("Quantidade excede estoque disponível");
  }

  // Adicionar à sacola
  return addBagProduct(productVariantSizeId);
}
```

---

## ✅ Boas Práticas

### 1. Validação com Zod

```typescript
// src/actions/add-bag-product/schema.ts

import { z } from "zod";

export const addBagProductSchema = z.object({
  productVariantSizeId: z.number().positive(),
});

export type AddBagProductInput = z.infer<typeof addBagProductSchema>;
```

### 2. Cache com React Query

```typescript
// Invalidar cache após mutações
const mutation = useMutation({
  mutationFn: addBagProduct,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["bag"] });
  },
});
```

### 3. Feedback Visual

```typescript
import { toast } from "sonner";

// Sucesso
toast.success("Produto adicionado!");

// Erro
toast.error("Erro ao adicionar produto");

// Loading inline
{mutation.isPending && <Spinner />}
```

### 4. Tratamento de Erros

```typescript
try {
  await addBagProduct(productVariantSizeId);
} catch (error) {
  if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error("Erro desconhecido");
  }
}
```

### 5. Otimistic Updates

```typescript
const mutation = useMutation({
  mutationFn: removeBagProduct,
  onMutate: async (bagItemId) => {
    // Cancelar queries pendentes
    await queryClient.cancelQueries({ queryKey: ["bag"] });

    // Snapshot do estado anterior
    const previousBag = queryClient.getQueryData(["bag"]);

    // Atualizar otimisticamente
    queryClient.setQueryData(["bag"], (old: Bag) => ({
      ...old,
      items: old.items.filter((item) => item.id !== bagItemId),
    }));

    return { previousBag };
  },
  onError: (err, variables, context) => {
    // Reverter em caso de erro
    if (context?.previousBag) {
      queryClient.setQueryData(["bag"], context.previousBag);
    }
  },
});
```

---

## 🔍 Troubleshooting

### Sacola não atualiza após adicionar item

Verifique se está invalidando o cache do React Query:
```typescript
queryClient.invalidateQueries({ queryKey: ["bag"] });
```

### Usuário não autenticado

Sempre verifique a sessão antes de operações:
```typescript
const session = await auth.api.getSession({ headers: await headers() });
if (!session?.user) throw new Error("Não autenticado");
```

### Performance com muitos itens

Use paginação ou limite de itens por sacola:
```typescript
const MAX_ITEMS_PER_BAG = 50;

if (bag.items.length >= MAX_ITEMS_PER_BAG) {
  throw new Error("Limite de itens na sacola atingido");
}
```

---

## 📚 Recursos Adicionais

- [Server Actions no Next.js](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)
- [React Query](https://tanstack.com/query/latest)
- [Zod Validation](https://zod.dev/)

---

**Última atualização:** Novembro 2025
