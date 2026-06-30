# Sistema - Escola de Empreendedores - Backend

> API RESTful para gestão de missões corporativas, controle de custos e tributações

**Stack:** Node.js · Express · Prisma · PostgreSQL · JWT

📚 [Documentação](#documentação) · 💻 [Instalação](#instalação) · 🔌 [API](#endpoints-da-api)

---

## Índice

- [Sobre](#sobre)
- [Funcionalidades](#funcionalidades)
- [Stack Tecnológica](#stack-tecnológica)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando o Projeto](#executando-o-projeto)
- [Documentação](#documentação)
- [Endpoints da API](#endpoints-da-api)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Segurança](#segurança)
- [Licença](#licença)

## Sobre

API robusta e escalável focada no gerenciamento completo de missões corporativas, controle de custos, tributações e análises financeiras.

Construído com arquitetura em camadas seguindo os princípios de Clean Code e SOLID, oferecendo alta performance e fácil manutenção.

## Funcionalidades

- ** Autenticação JWT** - Sistema seguro de login e gerenciamento de sessões
- ** Gestão de Usuários** - CRUD completo com diferentes níveis de permissão
- ** Categorias de Missões** - Organização hierárquica de projetos
- ** Controle de Missões** - Cadastro, edição e acompanhamento detalhado
- ** Gestão de Custos** - Registro e cálculo automático de despesas por missão
- ** Taxas e Tributações** - Sistema flexível de taxas padrão e customizadas
- ** Dashboard e KPIs** - Relatórios consolidados e análises em tempo real
- ** Documentação Swagger** - API totalmente documentada e testável

## Stack Tecnológica

- **Node.js** (20+) - Runtime JavaScript
- **Express** (4.x) - Framework web
- **Prisma** (5.x) - ORM e query builder
- **PostgreSQL** (14+) - Banco de dados relacional
- **JWT** - Autenticação stateless
- **Swagger** (3.x) - Documentação da API
- **Bcrypt** - Hash de senhas

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) versão 20 ou superior
- [PostgreSQL](https://www.postgresql.org/) versão 14 ou superior
- npm ou yarn

## Instalação

```bash
# Clone o repositório
git clone https://bitbucket.org/institutoatlantico/akatsuki.git

# Navegue até o diretório do backend
cd akatsuki/back-end

# Instale as dependências
npm install
```

## Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` no diretório raiz:

```bash
cp .env.example .env
```

Configure as seguintes variáveis:

```env
# Database
DATABASE_URL="postgresql://usuario:senha@localhost:5432/akatsuki?schema=public"

# Server
PORT=3333
NODE_ENV=development

# JWT
JWT_SECRET=sua_chave_secreta_muito_segura_com_pelo_menos_32_caracteres
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Configuração do Banco de Dados

```bash
# Execute as migrations
npx prisma migrate dev

# (Opcional) Popule o banco com dados de exemplo
npx prisma db seed

# Abra o Prisma Studio para visualizar o banco
npx prisma studio
```

## Executando o Projeto

### Desenvolvimento

```bash
npm run dev
```

A API estará disponível em `http://localhost:3333`

### Produção

```bash
# Gere o Prisma Client
npx prisma generate

# Inicie o servidor
npm start
```

## Documentação

Após iniciar o servidor, acesse a documentação interativa em:

**http://localhost:3333/api-docs**

A documentação Swagger permite testar todos os endpoints diretamente pelo navegador.

## Endpoints da API

### Autenticação

```
POST   /api/auth/login          Login de usuário
POST   /api/auth/register       Registro de novo usuário
POST   /api/auth/refresh        Renovação de token JWT
```

### Usuários

```
GET    /api/users               Listar todos os usuários
GET    /api/users/:id           Obter usuário específico
POST   /api/users               Criar usuário
PUT    /api/users/:id           Atualizar usuário
DELETE /api/users/:id           Deletar usuário
```

### Missões

```
GET    /api/missions            Listar todas as missões
GET    /api/missions/:id        Obter missão específica
POST   /api/missions            Criar missão
PUT    /api/missions/:id        Atualizar missão
DELETE /api/missions/:id        Deletar missão
GET    /api/missions/:id/costs  Obter custos de uma missão
```

### Categorias

```
GET    /api/categories          Listar todas as categorias
POST   /api/categories          Criar categoria
PUT    /api/categories/:id      Atualizar categoria
DELETE /api/categories/:id      Deletar categoria
```

### Custos

```
GET    /api/costs               Listar todos os custos
POST   /api/costs               Registrar custo
PUT    /api/costs/:id           Atualizar custo
DELETE /api/costs/:id           Deletar custo
```

### Taxas

```
GET    /api/taxes               Listar taxas padrão
PUT    /api/taxes               Atualizar taxas em lote
GET    /api/taxes/mission/:id   Obter taxas customizadas por missão
POST   /api/taxes/mission/:id   Criar taxa customizada
```

### Dashboard

```
GET    /api/dashboard/kpis      KPIs gerais
GET    /api/dashboard/missions  Análise de missões
GET    /api/dashboard/costs     Relatório de custos
```

## Estrutura do Projeto

```
back-end/
├── prisma/
│   ├── migrations/           # Histórico de migrações do banco
│   ├── schema.prisma         # Schema do banco de dados
│   └── seed.js               # Dados iniciais para desenvolvimento
├── scripts/
│   └── insert_cost.js        # Script de exemplo para inserir custos
├── src/
│   ├── controllers/          # Lógica de negócio
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── missionController.js
│   │   ├── categoryController.js
│   │   ├── costController.js
│   │   └── taxController.js
│   ├── middlewares/          # Middlewares customizados
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validator.js
│   ├── models/               # Camada de acesso aos dados
│   ├── routes/               # Definição de rotas
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── mission.routes.js
│   │   └── index.js
│   ├── utils/                # Funções utilitárias
│   ├── config/               # Arquivos de configuração
│   ├── prisma.js             # Instância do Prisma Client
│   └── server.js             # Ponto de entrada da aplicação
├── .env.example              # Template de variáveis de ambiente
├── .gitignore
├── package.json
├── SECURITY.md               # Política de segurança
└── README.md
```

## Segurança

O projeto implementa as seguintes práticas de segurança:

- Autenticação JWT com tokens de curta duração
- Hash de senhas usando bcrypt com salt rounds adequados
- Validação e sanitização de entrada em todas as rotas
- Middleware de autenticação protegendo rotas sensíveis
- CORS configurado para origens permitidas
- Helmet.js para headers de segurança HTTP
- Rate limiting para prevenir abuso e ataques DDoS
- Proteção contra SQL Injection via Prisma ORM
- Variáveis de ambiente para dados sensíveis
- Logs de auditoria para ações críticas

## Arquitetura

O projeto segue uma arquitetura em camadas:

```
Rotas → Middlewares → Controllers → Models → Prisma Client → PostgreSQL
```

Cada camada tem uma responsabilidade específica, tornando o código manutenível e testável.

## Licença

Este projeto está licenciado sob a Licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Desenvolvido pelo Instituto Atlântico**