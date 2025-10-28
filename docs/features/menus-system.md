# 🚀 Sistema de Menus e Navegação - Guia Completo# 🚀 Sistema de Menus e Navegação - Guia Completo



> Documentação completa do sistema de menus hierárquicos com navegação por níveis, similar aos principais e-commerces mobile como Amazon e Magazine Luiza.> Documentação completa do sistema de menus hierárquicos com navegação por níveis, similar aos principais e-commerces mobile como Amazon e Magazine Luiza.



## 📑 Índice## 📑 Índice



- [O que foi implementado](#-o-que-foi-implementado)- [O que foi implementado](#-o-que-foi-implementado)

- [Como Usar](#-como-usar)- [Como Usar](#-como-usar)

- [Estrutura de Arquivos](#-estrutura-de-arquivos)- [Estrutura de Arquivos](#-estrutura-de-arquivos)

- [Tabela de Menus](#-tabela-de-menus-tb_menus)- [Tabela de Menus](#-tabela-de-menus-tb_menus)

- [Tipos de Menu](#-tipos-de-menu)- [Tipos de Menu](#-tipos-de-menu)

- [Hierarquia de Menus](#-hierarquia-de-menus)- [Hierarquia de Menus](#-hierarquia-de-menus)

- [Sistema de Navegação por Níveis](#-sistema-de-navegação-por-níveis)- [Sistema de Navegação por Níveis](#-sistema-de-navegação-por-níveis)

- [Scripts Disponíveis](#-scripts-disponíveis)- [Scripts Disponíveis](#-scripts-disponíveis)

- [Exemplos de Uso](#-exemplos-de-uso)- [Exemplos de Uso](#-exemplos-de-uso)

- [Customização](#-customização-da-navegação)- [Customização](#-customização-da-navegação)

- [Troubleshooting](#-troubleshooting)- [Troubleshooting](#-troubleshooting)



------



## 📋 O que foi implementado## 📋 O que foi implementado



### 1. **Tabela de Menus** (`tb_menus`)### 1. **Tabela de Menus** (`tb_menus`)

Tabela flexível que suporta hierarquia ilimitada (menus e submenus):Tabela flexível que suporta hierarquia (menus e submenus) com os seguintes campos:



| Campo | Tipo | Descrição |- `id`: Identificador único

|-------|------|-----------|- `name`: Nome do menu

| `id` | serial | Identificador único (auto-incremento) |- `slug`: Slug único

| `name` | text | Nome exibido do menu |- `icon`: Nome do ícone do Lucide React

| `slug` | text | Slug único para identificação |- `href`: URL customizada (para menus tipo "custom")

| `href` | text | URL customizada (opcional, para tipo "custom") |- `parentId`: ID do menu pai (para criar submenus)

| `parentId` | integer | ID do menu pai (null = menu principal) |- `type`: Tipo do menu (`custom`, `category`, `brand`)

| `type` | enum | Tipo: `custom`, `category` ou `brand` |- `referenceId`: ID da categoria/marca referenciada

| `referenceId` | integer | ID da categoria/marca (quando aplicável) |- `order`: Ordem de exibição

| `order` | integer | Ordem de exibição (default: 0) |- `isActive`: Menu ativo/inativo

| `isActive` | boolean | Menu ativo/inativo (default: true) |- `createdAt`: Data de criação

| `createdAt` | timestamp | Data de criação |

### 2. **Componentes**

### 2. **Componentes**

#### `NavigationDrawer`

#### `Header` (`src/components/commom/header.tsx`)- Drawer lateral com menus hierárquicos

- Header global renderizado no layout- Suporta ícones dinâmicos do Lucide React

- Busca menus do banco via action server-side- Expandir/colapsar submenus

- Passa menus para o NavigationDrawer- Fecha automaticamente ao clicar em um link

- Integrado com autenticação (mostra usuário logado)

#### `NavigationDrawer` (`src/components/commom/navigation-drawer.tsx`)

- Drawer lateral com navegação por níveis#### `Header`

- Animações suaves de transição- Header globalizado no layout

- Fecha automaticamente ao clicar em links- Recebe os menus do servidor

- Botão "Voltar" para navegação hierárquica- Passa os menus para o NavigationDrawer

- Mostra informações do usuário logado

### 3. **Actions**

### 3. **Action Server-Side**

#### `getMenus()`

#### `getMenus()` (`src/actions/get-menus/index.ts`)Action server-side que:

Action que:- Busca menus ativos do banco

- Busca apenas menus ativos do banco- Constrói hierarquia de menus

- Constrói árvore hierárquica automaticamente- Gera URLs baseadas no tipo:

- Gera URLs baseadas no tipo do menu:  - `custom`: usa o campo `href`

  - **custom**: usa o campo `href`  - `category`: gera `/w/{category-slug}`

  - **category**: gera `/w/{category-slug}`  - `brand`: gera `/b/{brand-slug}`

  - **brand**: gera `/b/{brand-slug}`

- Ordena menus conforme campo `order`### 4. **Scripts de Seed**

- Retorna interface `MenuItem[]`

#### `seed-menus.ts`

```typescriptSeed simples com menus básicos:

export interface MenuItem {- Início

  id: number;- Produtos

  name: string;- Novidades

  slug: string;- Promoções

  href: string;

  children?: MenuItem[];#### `sync-menus.ts` (RECOMENDADO)

  isActive: boolean;Seed inteligente que:

}- Cria menu "Início"

```- Cria menu "Categorias" com submenus para cada categoria existente

- Cria menu "Marcas" com submenus para cada marca existente

---- Cria menus "Novidades" e "Promoções"



## 🎯 Como Usar## 🎯 Como Usar



### Passo 1: Migrar o Banco de Dados### Passo 1: Migrar o Banco de Dados



```bash```bash

npx drizzle-kit pushnpx drizzle-kit push

``````



### Passo 2: Popular os Menus### Passo 2: Popular os Menus



Execute o script de seed para criar a estrutura de menus:Escolha uma opção:



```bash**Opção A - Menus simples:**

npx tsx src/db/seed-menus.ts```bash

```npx tsx src/db/seed-menus.ts

```

Isso criará:

- **5 menus principais**: Calçados, Roupas, Acessórios, Novidades, Promoções**Opção B - Sincronizar com dados existentes (RECOMENDADO):**

- **16 submenus** distribuídos nos menus principais```bash

- **Total**: 21 itens de menunpx tsx src/db/sync-menus.ts

```

### Passo 3: Limpar Menus (Opcional)

### Passo 3: Testar

Se precisar remover todos os menus:

```bash

```bashnpm run dev

npx tsx src/db/clear-menus.ts```

```

Abra o navegador e clique no menu hambúrguer no header!

### Passo 4: Testar

## 📐 Estrutura de Arquivos

```bash

npm run dev```

```src/

├── db/

Abra http://localhost:3000 e clique no menu hambúrguer no header!│   ├── schema.ts              ✅ Tabela tb_menus

│   ├── seed-menus.ts          ✅ Seed simples

---│   └── sync-menus.ts          ✅ Seed inteligente

├── actions/

## 📐 Estrutura de Arquivos│   └── get-menus/

│       └── index.ts           ✅ Action para buscar menus

```├── components/

src/│   └── commom/

├── db/│       ├── header.tsx         ✅ Header com menus

│   ├── schema.ts              # Tabela tb_menus + relações│       └── navigation-drawer.tsx ✅ Drawer com menu hierárquico

│   ├── seed-menus.ts          # Script para popular menus└── app/

│   └── clear-menus.ts         # Script para limpar menus    └── layout.tsx             ✅ Layout com getMenus()

│```

├── actions/

│   └── get-menus/## 🎨 Tipos de Menu

│       └── index.ts           # Action para buscar menus (getMenus)

│### 1. Menu Custom

├── components/Link personalizado definido no campo `href`.

│   └── commom/

│       ├── header.tsx         # Header com menus```typescript

│       └── navigation-drawer.tsx  # Drawer com navegação por níveis{

│  name: "Início",

└── app/  slug: "inicio",

    ├── layout.tsx             # Layout que chama getMenus()  icon: "Home",

    ├── w/  href: "/",

    │   └── [slug]/            # Páginas de categorias  type: "custom"

    │       └── page.tsx}

    └── [outras rotas...]```

```

### 2. Menu de Categoria

---Aponta para uma categoria existente (gera `/w/{slug}`).



## 🗂️ Tabela de Menus (`tb_menus`)```typescript

{

### Campos Detalhados  name: "Roupas",

  slug: "roupas-menu",

#### `type` - Tipo do Menu  icon: "Shirt",

Define como o menu se comporta:  type: "category",

  referenceId: 1 // ID da categoria

| Valor | Descrição | URL Gerada |}

|-------|-----------|------------|```

| `custom` | Link personalizado | Usa campo `href` |

| `category` | Referência a categoria | `/w/{category.slug}` |### 3. Menu de Marca

| `brand` | Referência a marca | `/b/{brand.slug}` |Aponta para uma marca existente (gera `/b/{slug}`).



#### `parentId` - Hierarquia```typescript

- `null` → Menu principal (nível raiz){

- `número` → Submenu do menu com este ID  name: "Nike",

  slug: "nike-menu",

#### `order` - Ordenação  icon: "Star",

- Números menores aparecem primeiro  type: "brand",

- Permite reordenar menus visualmente  referenceId: 1 // ID da marca

- Default: `0`}

```

### Relações

## 🔄 Hierarquia de Menus

```typescript

menusRelations:Para criar submenus, use o campo `parentId`:

  - parent: Menu pai (self-relation)

  - children: Submenus (array)```typescript

  - category: Categoria referenciada// Menu principal

  - brand: Marca referenciada{

```  id: 1,

  name: "Roupas",

---  slug: "roupas",

  icon: "Shirt",

## 🎨 Tipos de Menu  parentId: null

}

### 1. Menu Custom (Link Personalizado)

// Submenu

Cria um link direto para qualquer URL.{

  id: 2,

**Exemplo:**  name: "Camisetas",

```typescript  slug: "camisetas",

{  type: "category",

  name: "Novidades",  referenceId: 5,

  slug: "novidades",  parentId: 1 // Filho de "Roupas"

  href: "/novidades",}

  type: "custom",```

  parentId: null,

  order: 4,## 🎭 Ícones Disponíveis

  isActive: true

}Use nomes de ícones do [Lucide React](https://lucide.dev/icons):

```

- `Home` - Casa

**Resultado:**- `ShoppingBag` - Sacola

- Link para `/novidades`- `Shirt` - Camisa

- Não depende de categoria ou marca- `Sparkles` - Estrelinhas

- `Tag` - Etiqueta

### 2. Menu de Categoria- `LayoutGrid` - Grade

- `Award` - Prêmio

Aponta para uma categoria existente no banco.- `Package` - Pacote

- `Heart` - Coração

**Exemplo:**- `Star` - Estrela

```typescript

{## 💡 Exemplos de Uso

  name: "Camisetas",

  slug: "camisetas-menu",### Adicionar Menu Manualmente

  type: "category",

  referenceId: 5,  // ID da categoria```typescript

  parentId: 2,     // Submenu de "Roupas"import { db } from "@/db";

  order: 1,import { menusTable } from "@/db/schema";

  isActive: true

}await db.insert(menusTable).values({

```  name: "Black Friday",

  slug: "black-friday",

**Resultado:**  icon: "Zap",

- Busca categoria com `id = 5`  href: "/black-friday",

- Gera link `/w/{slug-da-categoria}`  type: "custom",

- Exemplo: `/w/camisetas`  order: 10,

  isActive: true,

### 3. Menu de Marca});

```

Aponta para uma marca existente no banco.

### Criar Submenu

**Exemplo:**

```typescript```typescript

{// 1. Criar menu principal

  name: "Nike",const [mainMenu] = await db.insert(menusTable).values({

  slug: "nike-menu",  name: "Acessórios",

  type: "brand",  slug: "acessorios",

  referenceId: 1,  // ID da marca  icon: "Watch",

  parentId: null,  href: "/acessorios",

  order: 6,  type: "custom",

  isActive: true  order: 5,

}}).returning();

```

// 2. Criar submenus

**Resultado:**await db.insert(menusTable).values([

- Busca marca com `id = 1`  {

- Gera link `/b/{slug-da-marca}`    name: "Relógios",

- Exemplo: `/b/nike`    slug: "relogios",

    type: "category",

**⚠️ Importante:** Para usar menus de marca, crie a rota `/b/[slug]/page.tsx`    referenceId: 10,

    parentId: mainMenu.id,

---    order: 1,

  },

## 🔄 Hierarquia de Menus  {

    name: "Bolsas",

### Estrutura de Níveis    slug: "bolsas",

    type: "category",

```    referenceId: 11,

Menu Principal (parentId = null)    parentId: mainMenu.id,

└── Submenu Nível 1 (parentId = ID do principal)    order: 2,

    └── Submenu Nível 2 (parentId = ID do nível 1)  },

        └── Submenu Nível 3 (e assim por diante...)]);

``````



### Exemplo Prático### Criar Página de Marca



```typescriptSe usar menus tipo `brand`, crie a rota `/b/[slug]/page.tsx`:

// 1. Menu Principal

{```tsx

  id: 1,import { db } from "@/db";

  name: "Calçados",import { brandsTable, productsTable } from "@/db/schema";

  slug: "calcados",import { eq } from "drizzle-orm";

  parentId: null,import { notFound } from "next/navigation";

  order: 1import ProductCard from "@/components/commom/product-card";

}

interface BrandPageProps {

// 2. Submenus de Calçados  params: Promise<{ slug: string }>;

{}

  id: 10,

  name: "Tênis",export default async function BrandPage({ params }: BrandPageProps) {

  slug: "calcados-tenis",  const { slug } = await params;

  parentId: 1,  // Filho de "Calçados"  

  order: 1  const brand = await db.query.brandsTable.findFirst({

}    where: eq(brandsTable.slug, slug),

  });

{

  id: 11,  if (!brand) return notFound();

  name: "Casual",

  slug: "calcados-casual",  const products = await db.query.productsTable.findMany({

  parentId: 1,  // Filho de "Calçados"    where: eq(productsTable.brandId, brand.id),

  order: 2    with: {

}      variants: {

```        with: { color: true },

      },

### Estrutura Atual do Seed    },

  });

```

📦 Menus (21 itens)  return (

├── 🏃 Calçados (8 submenus)    <div className="p-4">

│   ├── Tênis      <h1 className="text-2xl font-semibold mb-4">{brand.name}</h1>

│   ├── Casual      <div className="grid grid-cols-2 gap-x-2 gap-y-6">

│   ├── Corrida        {products.map((product) => (

│   ├── Chuteiras          <ProductCard product={product} key={product.slug} />

│   ├── Academia        ))}

│   ├── Skate      </div>

│   ├── Basquete    </div>

│   └── Vôlei  );

│}

├── 👕 Roupas (4 submenus)```

│   ├── Camisetas

│   ├── Calças## 🚀 Próximos Passos

│   ├── Shorts

│   └── Jaquetas1. **Painel Admin** - Criar interface para gerenciar menus

│2. **Drag & Drop** - Reordenar menus visualmente

├── 🎒 Acessórios (4 submenus)3. **Badges** - Adicionar "Novo", "Sale", etc.

│   ├── Mochilas4. **Permissões** - Menus condicionais por usuário

│   ├── Bonés5. **Busca** - Adicionar busca na sidebar

│   ├── Meias6. **Favoritos** - Permitir usuário favoritar menus

│   └── Relógios

│## 🐛 Troubleshooting

├── ✨ Novidades

└── 🏷️ Promoções### Menus não aparecem?

```1. Verifique se executou `npx drizzle-kit push`

2. Verifique se executou o seed

---3. Confira o console por erros



## 📱 Sistema de Navegação por Níveis### Ícones não aparecem?

Use nomes exatos do Lucide React:

### 🎯 Comportamento Implementado- ✅ `Home`

- ❌ `home`

O `NavigationDrawer` funciona com **navegação por níveis**, similar aos apps mobile modernos.

### Links de marcas não funcionam?

#### 1️⃣ Menu PrincipalCrie a rota `/b/[slug]/page.tsx`

Ao abrir o drawer, você vê todos os menus principais:

## � Sistema de Navegação por Níveis

```

┌─────────────────────────┐### 🎯 Comportamento Implementado

│ Calçados           →    │

│ Roupas             →    │O `NavigationDrawer` funciona com **navegação por níveis**, similar aos apps mobile modernos como Amazon, Magazine Luiza, etc.

│ Acessórios         →    │

│ Novidades               │#### 1️⃣ Menu Principal

│ Promoções               │Ao abrir o drawer, você vê todos os menus principais:

└─────────────────────────┘- Início

```- Calçados →

- Roupas →

**📝 Nota:** Menus com submenus mostram uma seta `→`- Acessórios →

- Novidades

#### 2️⃣ Navegação para Submenus- Promoções

Ao clicar em um menu com submenus (ex: **Calçados**):

**Nota:** Menus com submenus mostram uma seta `→` à direita

✨ **A tela muda completamente**  

🔙 Aparece um botão **"Voltar"** no topo  #### 2️⃣ Navegação para Submenus

📋 Aparece o **título** do menu atual  Ao clicar em um menu com submenus (ex: **Calçados**):

📝 Lista **apenas os submenus** daquele menu- ✨ A tela **muda completamente**

- 🔙 Aparece um botão **"Voltar"** no topo

```- 📋 Aparece o **título** do menu ("Calçados")

┌─────────────────────────┐- �📝 Lista **apenas os submenus** daquele menu

│ ← Voltar                │

├─────────────────────────┤Exemplo visual ao clicar em "Calçados":

│ Calçados                │ ← Título```

├─────────────────────────┤┌─────────────────────────┐

│ Tênis              →    ││ ← Voltar                │

│ Casual             →    │├─────────────────────────┤

│ Corrida            →    ││ Calçados                │ ← Título

│ Chuteiras          →    │├─────────────────────────┤

│ Academia           →    ││ Tênis              →    │

│ Skate              →    ││ Casual             →    │

│ Basquete           →    ││ Corrida            →    │

│ Vôlei              →    ││ Chuteiras          →    │

└─────────────────────────┘│ Academia           →    │

```│ Skate              →    │

│ Basquete           →    │

#### 3️⃣ Clique em um Submenu│ Vôlei              →    │

Ao clicar em qualquer submenu:└─────────────────────────┘

- 🚀 Navega para a página correspondente```

- ✅ Fecha automaticamente o drawer

#### 3️⃣ Clique em um Submenu

#### 4️⃣ Botão VoltarAo clicar em qualquer submenu (ex: **Tênis**):

Ao clicar no botão **"Voltar"**:- 🚀 Navega para a página correspondente

- 🔄 Retorna para o menu principal- ✅ Fecha automaticamente o drawer

- 📱 Mantém o drawer aberto

#### 4️⃣ Botão Voltar

#### 5️⃣ Fechar o DrawerAo clicar no botão **"Voltar"**:

Ao fechar o drawer (botão X ou clique fora):- 🔄 Retorna para o menu principal

- 🔄 Reseta automaticamente para o menu principal- 📱 Mantém o drawer aberto

- 📱 Próxima vez que abrir, mostra o menu principal

#### 5️⃣ Fechar o Drawer

### 🎨 Características VisuaisAo fechar o drawer (botão X ou clicar fora):

- 🔄 Automaticamente reseta para o menu principal

#### Menu Principal- 📱 Próxima vez que abrir, mostra o menu principal novamente

- ✅ Bordas entre itens

- ✅ Seta → indica submenus disponíveis### 🎨 Características Visuais

- ✅ Hover com fundo cinza claro

- ✅ Layout limpo e espaçado#### Menu Principal

- **Bordas** entre itens para melhor separação

#### Tela de Submenus- **Ícones** nos menus principais (dinâmicos do Lucide React)

- ✅ Botão voltar com ícone de seta- **Seta →** indica que há submenus disponíveis

- ✅ Título em negrito do menu atual- **Hover** com fundo cinza claro para feedback visual

- ✅ Separadores visuais entre itens

- ✅ Setas em submenus profundos#### Tela de Submenus

- **Botão Voltar** com ícone de seta e fundo cinza claro

### 💡 Vantagens do Sistema- **Título em negrito** mostrando o menu atual

- **Separadores** visuais entre submenus

| Vantagem | Descrição |- **Setas →** em submenus que possuem filhos (hierarquia profunda)

|----------|-----------|

| 🧹 **Interface Limpa** | Não acumula menus abertos |### 💡 Vantagens do Sistema

| 🎯 **Foco no Conteúdo** | Mostra apenas o relevante |

| 📱 **Mobile-First** | Comportamento familiar |✅ **Interface Limpa** - Não acumula menus abertos na tela  

| ⚡ **Menos Scroll** | Navegação rápida |✅ **Foco no Conteúdo** - Mostra apenas o que é relevante no momento  

| 📊 **Hierarquia Clara** | Organização visual intuitiva |✅ **Mobile-First** - Comportamento familiar para usuários de apps mobile  

| 🚀 **Performance** | Renderiza apenas o nível atual |✅ **Menos Scroll** - Não precisa rolar muito para encontrar itens  

✅ **Hierarquia Clara** - Organização visual intuitiva  

### 📊 Estrutura do Código✅ **Performance** - Renderiza apenas o nível atual  



```tsx### 🔧 Customização da Navegação

// Estado para controlar qual menu está sendo visualizado

const [currentMenu, setCurrentMenu] = useState<MenuItem | null>(null);#### Alterar Estilos do Botão Voltar

```tsx

// null = menu principal// src/components/commom/navigation-drawer.tsx

// MenuItem = visualizando submenus daquele item<button

  onClick={handleBackToMain}

// Renderização condicional  className="flex items-center gap-3 w-full px-4 py-4 text-sm hover:bg-zinc-100 transition-colors"

{currentMenu ? (>

  // Tela de submenus com botão voltar  <ChevronLeft className="size-5" />

  <div>  <span className="font-semibold">Voltar</span>

    <button onClick={handleBackToMain}>← Voltar</button></button>

    <h2>{currentMenu.name}</h2>```

    {currentMenu.children?.map(...)}

  </div>#### Alterar Estilos do Título

) : (```tsx

  // Tela do menu principal<div className="px-4 py-4 border-b bg-white">

  <nav>  <h2 className="text-lg font-bold">{currentMenu.name}</h2>

    {menus.map(...)}</div>

  </nav>```

)}

```#### Adicionar Animações com Framer Motion

Para transições suaves entre níveis:

---

```bash

## 🔧 Scripts Disponíveisnpm install framer-motion

```

### 1. Seed de Menus

```tsx

**Arquivo:** `src/db/seed-menus.ts`import { motion, AnimatePresence } from "framer-motion";



**Comando:**// No conteúdo do drawer

```bash<AnimatePresence mode="wait">

npx tsx src/db/seed-menus.ts  {currentMenu ? (

```    <motion.div

      key="submenu"

**O que faz:**      initial={{ x: 300, opacity: 0 }}

- Cria 5 menus principais      animate={{ x: 0, opacity: 1 }}

- Cria 16 submenus      exit={{ x: -300, opacity: 0 }}

- Define ordem e hierarquia      transition={{ duration: 0.2 }}

- Todos os menus ativos por padrão    >

      {/* Conteúdo dos submenus */}

**Output:**    </motion.div>

```  ) : (

🌱 Criando menus com submenus...    <motion.nav

✅ Menu 'Calçados' criado      key="main"

✅ 8 submenus de 'Calçados' criados      initial={{ x: -300, opacity: 0 }}

✅ Menu 'Roupas' criado      animate={{ x: 0, opacity: 1 }}

✅ 4 submenus de 'Roupas' criados      exit={{ x: 300, opacity: 0 }}

✅ Menu 'Acessórios' criado      transition={{ duration: 0.2 }}

✅ 4 submenus de 'Acessórios' criados    >

✅ Menus 'Novidades' e 'Promoções' criados      {/* Menu principal */}

    </motion.nav>

🎉 Todos os menus foram criados com sucesso!  )}

</AnimatePresence>

📊 Resumo:```

  - 1 menu: Calçados (com 8 submenus)

  - 1 menu: Roupas (com 4 submenus)### 🧪 Testando o Sistema de Navegação

  - 1 menu: Acessórios (com 4 submenus)

  - 2 menus: Novidades e Promoções1. **Abra o drawer** - Clique no ícone de menu hambúrguer no header

2. **Navegue para submenus** - Clique em "Calçados" ou outro menu com filhos

  Total: 5 menus principais + 16 submenus = 21 itens3. **Use o botão Voltar** - Retorne ao menu principal

4. **Troque de seção** - Clique em "Roupas" para ver outros submenus

✅ Seed completado com sucesso!5. **Clique em um item** - Navegue para uma página e veja o drawer fechar

```6. **Feche e reabra** - Verifique que sempre inicia no menu principal



### 2. Limpar Menus### 📊 Estrutura do Código



**Arquivo:** `src/db/clear-menus.ts````tsx

// Estado para controlar qual menu está sendo visualizado

**Comando:**const [currentMenu, setCurrentMenu] = useState<MenuItem | null>(null);

```bash

npx tsx src/db/clear-menus.ts// null = menu principal

```// MenuItem = visualizando submenus daquele item específico



**O que faz:**// Renderização condicional

- Remove TODOS os menus do banco{currentMenu ? (

- Usa SQL DELETE direto  // Tela de submenus com botão voltar

- Útil para recomeçar do zero  <SubmenuView 

    menu={currentMenu} 

**⚠️ Aviso:** Esta ação é irreversível!    onBack={handleBackToMain} 

  />

**Output:**) : (

```  // Tela do menu principal

🗑️  Limpando menus existentes...  <MainMenuView 

✅ Todos os menus foram removidos!    menus={menus}

✅ Limpeza completada!    onNavigate={handleNavigateToSubmenu}

```  />

)}

---```



## 💡 Exemplos de Uso### 🚀 Melhorias Futuras para Navegação



### Exemplo 1: Adicionar Menu Manualmente- ✨ **Animações de transição** entre níveis (slide, fade)

- 🔍 **Busca dentro dos submenus** para encontrar itens rapidamente

```typescript- 📱 **Breadcrumbs** para menus com 3+ níveis de profundidade

import { db } from "@/db";- 🎨 **Temas customizáveis** (claro/escuro)

import { menusTable } from "@/db/schema";- ⚡ **Gestos de swipe** para voltar ao menu anterior

- 📍 **Highlight do menu ativo** baseado na rota atual

// Criar menu simples- 🔢 **Badges com contadores** de produtos por categoria

await db.insert(menusTable).values({- ⭐ **Menus favoritos** do usuário no topo

  name: "Black Friday",

  slug: "black-friday",## 📝 Notas Técnicas

  href: "/black-friday",

  type: "custom",- O Header está globalizado no `layout.tsx`

  order: 10,- Os menus são buscados no servidor (Server Component)

  isActive: true,- O NavigationDrawer é Client Component (usa hooks React)

});- A navegação por níveis usa estado local (`useState`)

```- Submenus são carregados on-demand (performance)

- Clicar em um link fecha o drawer automaticamente

### Exemplo 2: Criar Menu com Submenus- O estado é resetado quando o drawer fecha



```typescript## 🗂️ Padrão Repository (DAL)

import { db } from "@/db";

import { menusTable } from "@/db/schema";Este projeto utiliza o padrão **Data Access Layer (DAL)** através de repositories para acesso ao banco de dados.



// 1. Criar menu principal### Por que Repositories?

const [esportesMenu] = await db

  .insert(menusTable)- ✅ **Controle granular de colunas** - Escolha quais campos buscar

  .values({- ✅ **Reutilização de código** - Mesmas queries em vários lugares

    name: "Esportes",- ✅ **Type-safety** - TypeScript garante segurança de tipos

    slug: "esportes",- ✅ **Testabilidade** - Fácil de mockar e testar

    type: "custom",- ✅ **Manutenibilidade** - Lógica centralizada

    order: 3,

    isActive: true,### Uso com Menus

  })

  .returning();#### Importação

```typescript

// 2. Criar submenus// Actions antigas (depreciado)

await db.insert(menusTable).values([import { getMenus } from "@/actions/get-menus";

  {

    name: "Futebol",// Padrão Repository (atual)

    slug: "esportes-futebol",import { getMenus } from "@/repositories/menuRepository";

    href: "/esportes/futebol",// OU

    type: "custom",import { getMenus } from "@/repositories";

    parentId: esportesMenu.id,```

    order: 1,

    isActive: true,#### Exemplo em Server Component

  },```tsx

  {import { getMenus } from "@/repositories/menuRepository";

    name: "Basquete",

    slug: "esportes-basquete",export default async function Layout() {

    href: "/esportes/basquete",  const menus = await getMenus();

    type: "custom",  

    parentId: esportesMenu.id,  return (

    order: 2,    <Header menus={menus} />

    isActive: true,  );

  },}

  {```

    name: "Vôlei",

    slug: "esportes-volei",#### Funções Disponíveis no menuRepository

    href: "/esportes/volei",

    type: "custom",```typescript

    parentId: esportesMenu.id,// Menus em árvore hierárquica (RECOMENDADO)

    order: 3,const menus = await getMenus();

    isActive: true,

  },// Todos os menus com controle de colunas

]);const menus = await getAllMenus({

```  id: true,

  name: true,

### Exemplo 3: Menu Baseado em Categoria  slug: true,

});

```typescript

import { db } from "@/db";// Apenas menus ativos com relações

import { menusTable, categoriesTable } from "@/db/schema";const menus = await getActiveMenus();

import { eq } from "drizzle-orm";

// Apenas menus principais (sem pai)

// Buscar categoriaconst mainMenus = await getMainMenus();

const camisetas = await db.query.categoriesTable.findFirst({

  where: eq(categoriesTable.slug, "camisetas"),// Buscar menu específico por slug

});const menu = await getMenuBySlug("calcados");



if (camisetas) {// Buscar submenus de um menu pai

  // Criar menu apontando para categoriaconst submenus = await getSubMenus(parentId);

  await db.insert(menusTable).values({```

    name: "Camisetas Esportivas",

    slug: "menu-camisetas",### Estrutura dos Repositories

    type: "category",

    referenceId: camisetas.id,```

    parentId: null,src/repositories/

    order: 5,├── index.ts                    # Exports centralizados

    isActive: true,├── menuRepository.tsx          # Operações com menus

  });├── bagRepository.tsx           # Operações com sacolas

}├── bagItemRepository.tsx       # Operações com itens

```├── productRepository.tsx       # Operações com produtos

└── userRepository.tsx          # Operações com usuários

### Exemplo 4: Desativar Menu Temporariamente```



```typescript### Migração de Actions para Repositories

import { db } from "@/db";

import { menusTable } from "@/db/schema";Se você ainda tem código usando as actions antigas:

import { eq } from "drizzle-orm";

**Antes:**

// Desativar menu específico```typescript

await dbimport { getMenus } from "@/actions/get-menus";

  .update(menusTable)import { addProductToBag } from "@/actions/add-bag-product";

  .set({ isActive: false })import { getBag } from "@/actions/get-bag";

  .where(eq(menusTable.slug, "promocoes"));```

```

**Depois:**

### Exemplo 5: Reordenar Menus```typescript

import { 

```typescript  getMenus,

import { db } from "@/db";  addProductToBag,

import { menusTable } from "@/db/schema";  getCurrentUserBagWithItems 

import { eq } from "drizzle-orm";} from "@/repositories";

```

// Alterar ordem dos menus

await db### Documentação Completa

  .update(menusTable)

  .set({ order: 1 })Para mais informações sobre o padrão Repository, consulte:

  .where(eq(menusTable.slug, "novidades"));- `src/repositories/README.md` - Documentação completa

- `src/repositories/examples.ts` - 15 exemplos práticos

await db

  .update(menusTable)## 🔗 Links Úteis

  .set({ order: 2 })

  .where(eq(menusTable.slug, "promocoes"));- [Drizzle ORM](https://orm.drizzle.team/) - ORM utilizado

```- [Lucide Icons](https://lucide.dev/icons) - Biblioteca de ícones

- [Better Auth](https://www.better-auth.com/) - Sistema de autenticação

### Exemplo 6: Buscar Menus no Código- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI

- [TanStack Query](https://tanstack.com/query) - Data fetching

```typescript

import { getMenus } from "@/actions/get-menus";---



// Em Server Component**Última atualização:** Outubro 2025  

export default async function MyPage() {**Versão do guia:** 2.0 - Unificado com navegação por níveis e padrão Repository

  const menus = await getMenus();
  
  console.log(menus);
  // Retorna árvore hierárquica completa
  
  return <div>...</div>;
}
```

---

## 🎨 Customização da Navegação

### Alterar Estilos do Botão Voltar

```tsx
// src/components/commom/navigation-drawer.tsx

<button
  onClick={handleBackToMain}
  className="flex items-center gap-3 w-full px-4 py-4 text-sm hover:bg-zinc-100 transition-colors"
>
  <ChevronLeft className="size-5" />
  <span className="font-semibold">Voltar</span>
</button>
```

### Alterar Estilos do Título

```tsx
<div className="px-4 py-4 border-b bg-white">
  <h2 className="text-lg font-bold">{currentMenu.name}</h2>
</div>
```

### Adicionar Animações com Framer Motion

```bash
npm install framer-motion
```

```tsx
import { motion, AnimatePresence } from "framer-motion";

// No conteúdo do drawer
<AnimatePresence mode="wait">
  {currentMenu ? (
    <motion.div
      key="submenu"
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Conteúdo dos submenus */}
    </motion.div>
  ) : (
    <motion.nav
      key="main"
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Menu principal */}
    </motion.nav>
  )}
</AnimatePresence>
```

### Adicionar Badges aos Menus

```tsx
<Link href={item.href} className="flex items-center justify-between">
  <span>{item.name}</span>
  {item.slug === "novidades" && (
    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
      Novo
    </span>
  )}
</Link>
```

---

## 🐛 Troubleshooting

### ❌ Menus não aparecem

**Possíveis causas:**
1. Banco de dados não foi migrado
2. Seed não foi executado
3. Todos os menus estão inativos

**Solução:**
```bash
# 1. Migrar banco
npx drizzle-kit push

# 2. Popular menus
npx tsx src/db/seed-menus.ts

# 3. Verificar no banco
# Conecte ao Postgres e rode:
SELECT * FROM tb_menus WHERE is_active = true;
```

### ❌ Links de categoria não funcionam

**Causa:** Rota `/w/[slug]/page.tsx` não existe ou está quebrada

**Solução:**
```bash
# Verificar se o arquivo existe
ls src/app/w/[slug]/page.tsx

# Se não existir, criar a rota
```

### ❌ Submenus não expandem

**Causa:** `parentId` está incorreto ou não foi definido

**Solução:**
```sql
-- Verificar hierarquia
SELECT id, name, parent_id FROM tb_menus ORDER BY parent_id, "order";

-- Corrigir parentId se necessário
UPDATE tb_menus SET parent_id = 1 WHERE slug = 'calcados-tenis';
```

### ❌ Ordem dos menus está errada

**Causa:** Campo `order` não está configurado corretamente

**Solução:**
```typescript
import { db } from "@/db";
import { menusTable } from "@/db/schema";
import { eq } from "drizzle-orm";

// Reordenar menus
await db.update(menusTable).set({ order: 1 }).where(eq(menusTable.id, 1));
await db.update(menusTable).set({ order: 2 }).where(eq(menusTable.id, 2));
```

### ❌ Erro ao executar seed

**Erro:** `Cannot find module 'dotenv/config'`

**Solução:**
```bash
npm install dotenv
```

**Erro:** `Connection refused`

**Solução:**
```bash
# Verificar se o Postgres está rodando
docker compose ps

# Se não estiver, iniciar
docker compose up -d
```

---

## 🚀 Melhorias Futuras

- [ ] **Painel Admin** - Interface para gerenciar menus via UI
- [ ] **Drag & Drop** - Reordenar menus visualmente
- [ ] **Badges** - Adicionar marcadores "Novo", "Sale", etc.
- [ ] **Ícones** - Suporte a ícones dinâmicos (Lucide React)
- [ ] **Busca** - Buscar itens dentro do drawer
- [ ] **Favoritos** - Permitir usuário favoritar menus
- [ ] **Breadcrumbs** - Para menus com 3+ níveis
- [ ] **Temas** - Modo claro/escuro
- [ ] **Analytics** - Rastrear cliques nos menus
- [ ] **Permissões** - Menus condicionais por role do usuário

---

## 📝 Notas Técnicas

- Header está globalizado no `src/app/layout.tsx`
- Menus são buscados no servidor (Server Component)
- NavigationDrawer é Client Component (usa hooks React)
- Navegação por níveis usa estado local (`useState`)
- Estado é resetado quando o drawer fecha
- Suporte a hierarquia ilimitada de níveis
- Menus inativos não aparecem na navegação

---

## 🔗 Links Úteis

- [Drizzle ORM](https://orm.drizzle.team/) - ORM utilizado
- [Better Auth](https://www.better-auth.com/) - Sistema de autenticação
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- [Lucide Icons](https://lucide.dev/icons) - Biblioteca de ícones
- [TanStack Query](https://tanstack.com/query) - Data fetching

---

**📅 Última atualização:** Outubro 2025  
**📌 Versão do guia:** 3.0 - Atualizado com estrutura real do projeto  
**👤 Autor:** Equipe de Desenvolvimento
