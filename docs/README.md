# 📚 Documentação do E-commerce

Bem-vindo à documentação completa do projeto E-commerce desenvolvido com Next.js, PostgreSQL e Drizzle ORM.

## 📑 Índice Geral

### 🚀 Primeiros Passos
- [Instalação e Configuração](./getting-started/installation.md)
- [Guia Rápido (5 minutos)](./getting-started/quick-start.md)
- [Variáveis de Ambiente](./getting-started/environment.md)

### ✨ Funcionalidades
- [Sistema de Menus Hierárquicos](./features/menus-system.md)
- [Sistema de Coleções](./features/collections.md)
- [Sacola de Compras](./features/shopping-bag.md)
- [Métodos de Pagamento (Stripe)](./features/payment-methods.md)
- [Área do Usuário](./features/user-account.md)
- [Autenticação](./features/authentication.md)
- [Gerenciamento de Produtos](./features/products.md)

### 🏗️ Arquitetura
- [Estrutura de Pastas](./architecture/folder-structure.md)
- [Schema do Banco de Dados](./architecture/database-schema.md)
- [Padrão Repository (DAL)](./architecture/repository-pattern.md)

### 📖 Guias Práticos
- [Como Criar Menus](./guides/creating-menus.md)
- [Como Adicionar Produtos](./guides/adding-products.md)
- [Como Configurar Coleções](./guides/collections-setup.md)
- [Scripts de Seed](./guides/seeding-data.md)
- [Como Customizar a UI](./guides/customization.md)

### 🧪 Testes
- [Estratégia de Testes](./testing/strategy.md)

---

## 🎯 Links Rápidos

| Recurso | Descrição |
|---------|-----------|
| [Quick Start](./getting-started/quick-start.md) | Comece em 5 minutos |
| [Menus](./features/menus-system.md) | Sistema de navegação hierárquica |
| [Collections](./features/collections.md) | Coleções Sport, Lifestyle e Promoções |
| [Sacola](./features/shopping-bag.md) | Sistema de carrinho de compras |
| [Repository Pattern](./architecture/repository-pattern.md) | Data Access Layer |
| [Database](./architecture/database-schema.md) | Estrutura do banco |

---

## 🛠️ Stack Tecnológica

- **Framework:** Next.js 15 (App Router)
- **React:** 19.1
- **Banco de Dados:** PostgreSQL
- **ORM:** Drizzle ORM
- **Autenticação:** Better Auth
- **Pagamentos:** Stripe
- **UI:** Tailwind CSS + shadcn/ui
- **Linguagem:** TypeScript
- **Validação:** Zod
- **State:** React Query (TanStack Query)

---

## 📦 Estrutura da Documentação

```
docs/
├── README.md                      # Este arquivo (índice)
├── getting-started/               # Primeiros passos
│   ├── installation.md
│   ├── quick-start.md
│   └── environment.md
├── features/                      # Funcionalidades
│   ├── menus-system.md
│   ├── collections.md
│   ├── shopping-bag.md
│   ├── authentication.md
│   └── products.md
├── architecture/                  # Arquitetura técnica
│   ├── folder-structure.md
│   ├── database-schema.md
│   └── repository-pattern.md
├── guides/                        # Guias práticos
│   ├── creating-menus.md
│   ├── adding-products.md
│   ├── collections-setup.md
│   ├── seeding-data.md
│   └── customization.md
└── testing/                       # Testes
    └── strategy.md
```

---

## 🚀 Por onde começar?

1. **Novo no projeto?** Comece com o [Guia de Instalação](./getting-started/installation.md)
2. **Quer testar rápido?** Veja o [Quick Start](./getting-started/quick-start.md)
3. **Quer entender a arquitetura?** Leia sobre [Estrutura de Pastas](./architecture/folder-structure.md) e [Database Schema](./architecture/database-schema.md)
4. **Quer adicionar features?** Confira os [Guias Práticos](./guides/)

---

## 💡 Conceitos Importantes

### Sistema de Menus Hierárquicos
O projeto possui um sistema avançado de menus que permite criar navegação hierárquica (níveis ilimitados) baseada em:
- Categorias do catálogo
- Marcas de produtos
- Coleções de produtos
- Links personalizados

[Saiba mais →](./features/menus-system.md)

### Sistema de Coleções
Organize produtos em coleções temáticas:
- **Sport**: Produtos esportivos e performance
- **Lifestyle**: Moda casual e cotidiano
- **Promotion**: Produtos em promoção

[Saiba mais →](./features/collections.md)

### Padrão Repository
O projeto utiliza o padrão Repository (Data Access Layer) para:
- Centralizar acesso aos dados
- Reutilizar queries
- Manter type-safety
- Facilitar testes

[Saiba mais →](./architecture/repository-pattern.md)

---

## 🤝 Contribuindo

Veja nosso [guia de contribuição](../CONTRIBUTING.md) para saber como colaborar com o projeto.

---

## 📝 Licença

Este projeto está sob a licença especificada no arquivo [LICENSE](../LICENSE).

---

**Última atualização:** Novembro 2025
