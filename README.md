# README - Adbrás App

> **Pastas:** `api/`, `frontend/`, `private/`  
> **Este arquivo** dá a visão geral do projeto e como rodar tudo.  
> **Detalhes específicos** estão nos READMEs locais:
> - `api/README.md` — API (Express + Prisma + MySQL)
> - `frontend/README.md` — Frontend (Vite + React + TypeScript)

---

## Sumário
- [Visão geral](#visão-geral)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Pré-requisitos](#pré-requisitos)
- [Variáveis de ambiente (onde criar)](#variáveis-de-ambiente-onde-criar)
- [Como rodar em desenvolvimento](#como-rodar-em-desenvolvimento)
- [Build e pré-visualização (frontend)](#build-e-pré-visualização-frontend)
- [Scripts na raiz (opcional)](#scripts-na-raiz-opcional)
- [Git e convenções rápidas](#git-e-convenções-rápidas)
- [Troubleshooting](#troubleshooting)
- [Documentação adicional](#documentação-adicional)

---

## Visão geral
Aplicação web com **frontend** em Vite/React/TypeScript e **API** em Node/Express com **Prisma** conectado ao **MySQL**.  
O monorepo facilita rodar as duas partes juntas, manter documentação e padronizar scripts.

---

## Estrutura de pastas

> **(atualizada — Módulo 3.1)**

Abaixo está a **estrutura real e atualizada** do projeto App Igreja após a conclusão da subetapa **3.1 — Estrutura Base do Projeto**.  
Em seguida, há um **guia explicativo detalhado de cada pasta e arquivo**.

```bash
app-igreja/
│
├── api/                          # Backend (Node.js + Prisma + Express)
│   ├── prisma/                   # ORM (Prisma) — esquema e migrations
│   │   ├── migrations/           # Histórico de versões do banco de dados
│   │   └── schema.prisma         # Definição do schema do banco (modelo de dados)
│   │
│   ├── src/                      # Código-fonte principal do backend
│   │   ├── controllers/          # Controladores (entrada HTTP -> lógica)
│   │   │   └── members.controller.js
│   │   ├── lib/                  # Biblioteca de utilidades (ex.: Prisma Client)
│   │   │   └── prisma.js
│   │   ├── middlewares/          # Middlewares globais (auth, logs, validações)
│   │   ├── repositories/         # Camada de acesso ao banco (DAO/repositórios)
│   │   ├── routes/               # Rotas e agrupamentos de endpoints
│   │   │   └── members.routes.js
│   │   ├── services/             # Lógica de negócio (regras independentes da rota)
│   │   └── utils/                # Utilitários e helpers (funções auxiliares)
│   │       └── server.js         # Inicialização do servidor Express
│   │
│   ├── .env.example              # Exemplo de variáveis de ambiente
│   ├── package.json              # Scripts e dependências do backend
│   └── README.md                 # Guia técnico da API
│
├── frontend/                     # Frontend (React + Vite + TypeScript + Tailwind)
│   ├── src/                      # Código-fonte principal do frontend
│   │   ├── assets/               # Arquivos estáticos (ícones, imagens, logos)
│   │   ├── components/           # Componentes reutilizáveis da UI
│   │   │   ├── ButtonPrimary.tsx
│   │   │   └── RouteGuard.tsx
│   │   ├── contexts/             # Contextos globais (ex.: AuthContext)
│   │   ├── hooks/                # Hooks customizados reutilizáveis
│   │   │   └── useAuth.ts
│   │   ├── lib/                  # Utilitários, instâncias e funções auxiliares
│   │   ├── pages/                # Páginas da SPA (cada uma corresponde a uma rota)
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.tsx
│   │   │   └── Membros.tsx
│   │   ├── routes/               # Configuração de rotas e guards
│   │   │   └── index.tsx
│   │   ├── services/             # Comunicação HTTP (ex.: Axios)
│   │   │   └── api.ts
│   │   ├── styles/               # Estilos globais (Tailwind, CSS base)
│   │   │   └── index.css
│   │   ├── types/                # Tipagens e contratos TypeScript
│   │   │   └── http.types.ts
│   │   ├── app.tsx               # Componente raiz da aplicação React
│   │   └── main.tsx              # Ponto de entrada (renderização React/Vite)
│   │
│   ├── .env.example              # Exemplo de variáveis do ambiente de frontend
│   ├── .prettierrc               # Configuração do Prettier (formatação)
│   ├── .prettierignore           # Arquivos ignorados pelo Prettier
│   ├── eslint.config.js          # Configuração do ESLint (flat config)
│   ├── tailwind.config.js        # Configuração do TailwindCSS
│   ├── vite.config.ts            # Configuração do Vite (build, plugins, alias)
│   ├── tsconfig.json             # Configuração TypeScript principal
│   ├── tsconfig.app.json         # Configuração TS específica do app
│   ├── tsconfig.node.json        # Configuração TS específica do Node/Vite
│   ├── index.html                # HTML raiz injetado pelo Vite
│   ├── package.json              # Scripts e dependências do frontend
│   └── README.md                 # Manual técnico do frontend
│
├── .gitignore                    # Arquivos e pastas ignoradas pelo Git
└── README.md                     # Documento principal (visão geral do monorepo)
```


---

## Guia de pastas (o que vai em cada uma)

### Backend — api/

Responsável pela lógica de negócio, persistência de dados e exposição da API REST.
Funciona com Node.js + Express + Prisma.

| Caminho             | Descrição                                                            |
| ------------------- | -------------------------------------------------------------------- |
| **`prisma/`**       | Diretório do ORM Prisma — gerencia o schema e migrations do banco.   |
| ├── `schema.prisma` | Define o modelo de dados (tabelas, tipos, relações).                 |
| ├── `migrations/`   | Histórico de versões e alterações do schema.                         |
| **`src/`**          | Código-fonte principal do backend.                                   |
| ├── `controllers/`  | Controladores: recebem requisições HTTP e coordenam as respostas.    |
| ├── `lib/`          | Biblioteca compartilhada (ex.: conexão com o banco via `prisma.js`). |
| ├── `middlewares/`  | Interceptam requisições para autenticação, logs e validações.        |
| ├── `repositories/` | Camada de persistência — abstrai queries ao banco de dados.          |
| ├── `routes/`       | Define os endpoints e associa aos controllers.                       |
| ├── `services/`     | Contém as regras de negócio e lógica reutilizável.                   |
| ├── `utils/`        | Funções auxiliares e utilitários do servidor.                        |
| └── `server.js`     | Arquivo principal que inicializa o servidor Express.                 |
| **`.env.example`**  | Exemplo de variáveis de ambiente (porta, URL do banco, chaves JWT).  |
| **`README.md`**     | Guia técnico da API (setup, scripts, dependências).                  |


---


### Frontend — frontend/
Responsável pela interface do usuário (UI) e experiência do cliente final.
Construído com React + Vite + TypeScript + TailwindCSS.

| Caminho                               | Descrição                                                              |
| ------------------------------------- | ---------------------------------------------------------------------- |
| **`src/`**                            | Código-fonte principal da aplicação frontend.                          |
| ├── `assets/`                         | Recursos estáticos (imagens, ícones, fontes).                          |
| ├── `components/`                     | Componentes reutilizáveis da interface, como botões e guardas de rota. |
| ├── `contexts/`                       | Contextos globais (ex.: `AuthContext` para autenticação).              |
| ├── `hooks/`                          | Hooks customizados com lógica reutilizável (`useAuth`, etc.).          |
| ├── `lib/`                            | Utilitários e instâncias externas (como configurações de APIs).        |
| ├── `pages/`                          | Páginas principais da SPA (Dashboard, Login, Membros, etc.).           |
| ├── `routes/`                         | Configuração de rotas e guards (proteção de navegação).                |
| ├── `services/`                       | Comunicação com a API via HTTP (`api.ts` usando Axios).                |
| ├── `styles/`                         | Estilos globais (`index.css`) e base do Tailwind.                      |
| ├── `types/`                          | Tipagens globais TypeScript (interfaces e contratos).                  |
| ├── `app.tsx`                         | Componente raiz do React (estrutura base da aplicação).                |
| └── `main.tsx`                        | Ponto de entrada — renderiza o app React dentro do DOM.                |
| **`.env.example`**                    | Exemplo de variáveis de ambiente do frontend.                          |
| **`.prettierrc` / `.prettierignore`** | Configurações de formatação (Prettier).                                |
| **`eslint.config.js`**                | Configuração de linting (flat config moderna).                         |
| **`tailwind.config.js`**              | Personalização de cores, tipografia e temas.                           |
| **`vite.config.ts`**                  | Configuração do Vite (build, plugins e alias `@/`).                    |
| **`tsconfig.*`**                      | Configurações específicas do TypeScript.                               |
| **`index.html`**                      | HTML raiz do app.                                                      |
| **`README.md`**                       | Manual técnico do frontend.                                            |


---

### Raiz do Repositório

| Caminho          | Descrição                                                         |
| ---------------- | ----------------------------------------------------------------- |
| **`.gitignore`** | Arquivos e pastas ignoradas pelo Git.                             |
| **`README.md`**  | Documento principal com visão geral do monorepo (API + Frontend). |

---


## Pré-requisitos
- **Node.js** (LTS) instalado.
- **MySQL** rodando localmente (porta padrão `3306`) e acessível.
- Terminal/CLI para rodar `npm`/`npx`.

---

## Variáveis de ambiente (onde criar)

### API — `api/.env`
```bash
PORT=3000
DATABASE_URL="mysql://USUARIO:SENHA@localhost:3306/nome_do_banco"
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### Frontend — `frontend/.env`
```bash
VITE_API_BASE_URL=http://localhost:3000
```

> Observação: arquivos `.env` **não** são versionados. Use os `.env.example` como referência.

---

## Como rodar em desenvolvimento

### 1) API
```bash
    cd api
    npm install
    npx prisma migrate dev
    npm run dev
```
Disponível em `http://localhost:3000`

### 2) Frontend
Abra outro terminal:
```bash
    cd frontend
    npm install
    npm run dev
```
Disponível em `http://localhost:5173`

> Se o navegador bloquear requisições por CORS, ajuste `CORS_ORIGIN` na API para cobrir `http://localhost:5173`.

---

## Build e pré-visualização (frontend)
```bash
    cd frontend
    npm run build
    npm run preview
```
O build final fica em `frontend/dist/`.

---

## Scripts na raiz (opcional)
Se você configurar scripts de orquestração com `concurrently` no `package.json` da **raiz**, poderá usar:

```bash
    npm run dev        # sobe API e Frontend em paralelo
    npm run dev:api    # apenas API
    npm run dev:front  # apenas Frontend
    npm run build      # build do frontend
```

Exemplo de `package.json` na raiz:
```bash
    {
    "name": "adbras-app",
    "private": true,
    "scripts": {
        "dev": "concurrently -n FRONT,API -c green,blue \"npm --prefix frontend run dev\" \"npm --prefix api run dev\"",
        "dev:front": "npm --prefix frontend run dev",
        "dev:api": "npm --prefix api run dev",
        "build": "npm --prefix frontend run build"
        },
    "devDependencies": {
    "concurrently": "^9.0.0"
    }
    }
```

---

## Git e convenções rápidas
- `.gitignore` na raiz cobre:
  ```js
  **/node_modules/
  **/dist/
  **/.env
  **/.env.*
  private/
  ```
- Mensagens de commit sugeridas (Conventional Commits):
  ```bash
  feat(frontend): add Axios base client with auth interceptors
  chore(api): configure CORS and health route
  fix(api): adjust prisma schema for phone format
  docs(frontend): update UI guide
  ```

---

## Troubleshooting
- **Frontend não conecta à API**
  - Verifique se a **API está rodando**.
  - Confirme `VITE_API_BASE_URL` em `frontend/.env`.
  - Ajuste `CORS_ORIGIN` em `api/.env` (ex.: `http://localhost:5173`).

- **Falha no banco**
  - Confirme `DATABASE_URL` e se o MySQL está ativo.
  - Rode `npx prisma migrate dev` para alinhar o schema.
  - Confira credenciais/permissões do usuário de banco.

- **Variáveis do Vite não refletem**
  - Após editar `frontend/.env`, **reinicie** `npm run dev`.

---

## Documentação adicional
- **API:** `api/README.md` e `api/docs/` (ADRs, RUNBOOKS, migrações, segurança, troubleshooting).  
- **Frontend:** `frontend/README.md` e `frontend/docs/` (ADRs, RUNBOOKS, UI Guide, A11y).  
- **Docs transversais do sistema (se houver):** `docs/` na raiz (arquitetura geral, decisões que envolvam front + API, runbooks de stack completo).
