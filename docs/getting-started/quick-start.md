# ⚡ Guia Rápido - 5 Minutos

Configure e rode o projeto em 5 minutos!

## 🎯 Passo a Passo

### 1. Clonar e Instalar (1 min)

```bash
git clone https://github.com/MuriloPCoelho/e-commerce.git
cd e-commerce
npm install
```

### 2. Configurar Ambiente (1 min)

Crie o arquivo `.env`:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=ecommerce
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecommerce
NODE_ENV=development
PORT=3000
BETTER_AUTH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
BETTER_AUTH_URL=http://localhost:3000
```

### 3. Iniciar Banco de Dados (1 min)

```bash
docker compose up -d
```

### 4. Configurar Banco (1 min)

```bash
npx drizzle-kit push
npm run seed
npx tsx src/db/seed-menus.ts
```

### 5. Iniciar Aplicação (1 min)

```bash
npm run dev
```

✅ **Pronto!** Acesse [http://localhost:3000](http://localhost:3000)

---

## 🎉 O que você tem agora

- ✅ Aplicação rodando em http://localhost:3000
- ✅ Banco PostgreSQL configurado
- ✅ Produtos de exemplo criados
- ✅ Sistema de menus funcionando
- ✅ Autenticação ativa

---

## 🚀 Próximos Passos

### Explorar a Aplicação

1. **Página Inicial** - http://localhost:3000
2. **Produtos** - http://localhost:3000/products
3. **Produto Individual** - Clique em qualquer produto
4. **Menu de Navegação** - Clique no ícone de menu (☰)
5. **Criar Conta** - http://localhost:3000/sign-up

### Testar Funcionalidades

#### Adicionar Produto à Sacola
1. Acesse um produto
2. Selecione cor e tamanho
3. Clique em "Adicionar à sacola"
4. Veja o contador no ícone da sacola

#### Navegar pelos Menus
1. Clique no menu hambúrguer (☰)
2. Clique em "Calçados"
3. Explore os submenus
4. Clique em "Voltar"
5. Teste outros menus

#### Criar uma Conta
1. Vá para `/sign-up`
2. Preencha nome, email e senha
3. Faça login
4. Seu nome aparecerá no menu

---

## 📝 Comandos Essenciais

```bash
# Desenvolvimento
npm run dev

# Parar banco de dados
docker compose down

# Reiniciar banco de dados
docker compose restart

# Ver logs do banco
docker compose logs -f

# Limpar e popular novamente
npm run clear-db
npm run seed
npx tsx src/db/seed-menus.ts
```

---

## 🎨 Estrutura do Projeto

```
e-commerce/
├── src/
│   ├── app/              # Rotas (Next.js App Router)
│   ├── components/       # Componentes React
│   ├── db/              # Banco de dados (schema, seed)
│   ├── actions/         # Server Actions
│   └── lib/             # Utilitários
├── docs/                # Documentação (você está aqui!)
├── .env                 # Variáveis de ambiente
├── docker-compose.yml   # Configuração do PostgreSQL
└── package.json         # Dependências
```

---

## 💡 Dicas Rápidas

### Ver Produtos no Banco

```bash
docker compose exec db psql -U postgres -d ecommerce -c "SELECT name FROM tb_products;"
```

### Ver Menus no Banco

```bash
docker compose exec db psql -U postgres -d ecommerce -c "SELECT name, slug FROM tb_menus ORDER BY \"order\";"
```

### Resetar Tudo

```bash
docker compose down -v
docker compose up -d
npx drizzle-kit push
npm run seed
npx tsx src/db/seed-menus.ts
```

---

## 🐛 Problemas Comuns

### Porta 3000 em uso

```bash
# Matar processo na porta 3000
npx kill-port 3000

# Ou usar outra porta
PORT=3001 npm run dev
```

### Banco não conecta

```bash
# Verificar se está rodando
docker compose ps

# Verificar logs
docker compose logs db

# Reiniciar
docker compose restart
```

### Seed falha

```bash
# Limpar e tentar novamente
npm run clear-db
npx drizzle-kit push
npm run seed
```

---

## 📚 Documentação Completa

Para mais detalhes, consulte:

- [Instalação Completa](./installation.md)
- [Variáveis de Ambiente](./environment.md)
- [Sistema de Menus](../features/menus-system.md)
- [Padrão Repository](../architecture/repository-pattern.md)

---

## 🎓 Tutoriais em Vídeo

*Em breve: links para vídeos tutoriais*

---

**⏱️ Tempo total:** ~5 minutos  
**🎯 Dificuldade:** Fácil  
**💻 Pré-requisitos:** Node.js, Docker
