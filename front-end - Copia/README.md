# Sistema - Escola de Empreendores - Frontend

> Interface moderna e responsiva para gestão de missões corporativas

**Stack:** React · Vite · TailwindCSS · Axios · React Router

🎯 [Funcionalidades](#funcionalidades) · 💻 [Instalação](#instalação) · ⚙️ [Configuração](#configuração)

---

## Índice

- [Sobre](#sobre)
- [Funcionalidades](#funcionalidades)
- [Stack Tecnológica](#stack-tecnológica)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando o Projeto](#executando-o-projeto)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Componentes Principais](#componentes-principais)
- [Fluxo de Autenticação](#fluxo-de-autenticação)
- [Licença](#licença)

## Sobre

Aplicação web moderna construída com React, oferecendo uma interface intuitiva e responsiva para o gerenciamento completo de missões, custos, tributações e análises corporativas da Escola de Empreendedores.

Desenvolvido seguindo as melhores práticas de desenvolvimento, o projeto proporciona uma experiência de usuário fluida e profissional.

## Funcionalidades

- ** Autenticação Segura** - Sistema de login baseado em JWT com proteção de rotas
- ** Dashboard Interativo** - Visualização de KPIs e métricas em tempo real
- ** Gestão de Missões** - Interface completa para CRUD de missões
- ** Controle de Custos** - Registro e visualização detalhada de despesas
- ** Taxas e Tributações** - Gerenciamento de taxas padrão e customizadas
- ** Gestão de Usuários** - Administração de perfis e permissões
- ** Categorias** - Organização hierárquica de projetos
- ** Interface Moderna** - Design responsivo e acessível
- ** Performance Otimizada** - Carregamento rápido e experiência fluida

## Stack Tecnológica

- **React** (18+) - Biblioteca para interface de usuário
- **Vite** (5.x) - Build tool e servidor de desenvolvimento
- **TailwindCSS** (3.x) - Framework CSS utilitário
- **Axios** (1.x) - Cliente HTTP
- **React Router** (6.x) - Roteamento para SPA
- **Context API** - Gerenciamento de estado
- **React Hook Form** - Gerenciamento de formulários
- **Recharts** - Biblioteca de gráficos
- **Lucide React** - Ícones modernos

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) versão 20 ou superior
- npm ou yarn
- **Backend** rodando (consulte o [README do Backend](../back-end/README.md))

## Instalação

```bash
# Clone o repositório
git clone https://bitbucket.org/institutoatlantico/akatsuki.git

# Navegue até o diretório do frontend
cd akatsuki/front-end

# Instale as dependências
npm install
```

## Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` no diretório raiz:

```bash
cp .env.example .env
```

Configure a URL da API:

```env
# API Backend
VITE_API_URL=http://localhost:3333/api
VITE_API_TIMEOUT=30000

# Ambiente
VITE_ENV=development
```

### Configuração do Axios

O arquivo `src/services/api.js` está configurado para usar as variáveis de ambiente:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: import.meta.env.VITE_API_TIMEOUT,
});

// Interceptor para adicionar token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

## Executando o Projeto

### Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

### Preview da Build

```bash
npm run preview
```

## Estrutura do Projeto

```
front-end/
├── public/
│   ├── logo.svg
│   └── favicon.ico
├── src/
│   ├── assets/               # Imagens, fontes, etc
│   │   ├── images/
│   │   └── icons/
│   ├── components/           # Componentes reutilizáveis
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Table.jsx
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Footer.jsx
│   │   └── features/
│   │       ├── MissionCard.jsx
│   │       ├── CostForm.jsx
│   │       └── TaxTable.jsx
│   ├── context/              # Context API
│   │   ├── AuthContext.jsx
│   │   ├── MissionContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/                # Custom hooks
│   │   ├── useAuth.js
│   │   ├── useMissions.js
│   │   ├── useCosts.js
│   │   └── useDebounce.js
│   ├── pages/                # Páginas da aplicação
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── Dashboard/
│   │   │   └── Dashboard.jsx
│   │   ├── Missions/
│   │   │   ├── MissionList.jsx
│   │   │   ├── MissionDetail.jsx
│   │   │   └── MissionForm.jsx
│   │   ├── Costs/
│   │   │   └── CostManagement.jsx
│   │   ├── Taxes/
│   │   │   └── TaxManagement.jsx
│   │   └── Users/
│   │       └── UserManagement.jsx
│   ├── services/             # Serviços de API
│   │   ├── api.js            # Configuração do Axios
│   │   ├── authService.js
│   │   ├── missionService.js
│   │   ├── costService.js
│   │   └── taxService.js
│   ├── utils/                # Funções utilitárias
│   │   ├── formatters.js     # Formatação de dados
│   │   ├── validators.js     # Validações
│   │   └── constants.js      # Constantes da aplicação
│   ├── routes/               # Configuração de rotas
│   │   ├── PrivateRoute.jsx
│   │   └── routes.jsx
│   ├── styles/               # Estilos globais
│   │   └── index.css
│   ├── App.jsx               # Componente raiz
│   └── main.jsx              # Ponto de entrada
├── .env.example              # Template de variáveis de ambiente
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## Componentes Principais

### AuthContext

Gerencia a autenticação do usuário:

```jsx
import { useAuth } from './context/AuthContext';

function MeuComponente() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  // Usar o contexto
}
```

### PrivateRoute

Protege rotas que requerem autenticação:

```jsx
<Route path="/dashboard" element={
  <PrivateRoute>
    <Dashboard />
  </PrivateRoute>
} />
```

### Serviços de API

Todos os serviços são centralizados:

```javascript
import { missionService } from './services/missionService';

// Listar missões
const missions = await missionService.getAll();

// Criar missão
const newMission = await missionService.create(data);

// Atualizar missão
const updated = await missionService.update(id, data);
```

## Fluxo de Autenticação

1. Usuário faz login com credenciais
2. Backend retorna token JWT
3. Token é armazenado no localStorage
4. Token é enviado em todas as requisições via interceptor do Axios
5. Rotas protegidas verificam token válido
6. Token expirado redireciona automaticamente para login

### Proteção de Rotas

```jsx
<PrivateRoute requiredRole="admin">
  <PainelAdmin />
</PrivateRoute>
```

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Linting
npm run lint

# Formatação de código
npm run format

# Executar testes
npm test
```

## Design Responsivo

A aplicação é totalmente responsiva com breakpoints do TailwindCSS:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## Customização de Tema

O TailwindCSS permite fácil customização. Edite o `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
    },
  },
}
```

## Boas Práticas

### Organização de Código

- Componentes pequenos e reutilizáveis
- Custom hooks para lógica compartilhada
- Separação de responsabilidades (UI, lógica, dados)
- Nomenclatura consistente e descritiva

### Performance

- Lazy loading de rotas
- Memoização de componentes pesados
- Debounce em campos de busca
- Paginação e virtualização de listas grandes

### Estilo de Código

- ESLint e Prettier configurados
- TailwindCSS para estilos consistentes
- Comentários em código complexo
- PropTypes para validação de props

## Solução de Problemas

### Erro de CORS

Se encontrar erros de CORS, verifique se o backend está configurado corretamente:

```javascript
// No backend: server.js
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### Token Expirado

O sistema redireciona automaticamente para login quando o token expira. Verifique os interceptors do Axios em `src/services/api.js`.

### Build Falha

```bash
# Limpe o cache e reinstale as dependências
rm -rf node_modules dist
npm install
npm run build
```

## Licença

Este projeto está licenciado sob a Licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Desenvolvido pelo Instituto Atlântico