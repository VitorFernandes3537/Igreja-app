# README — Adbrás App (Monorepo)

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
```bash
adbras-app/
  api/                     # API (Express + Prisma + MySQL)
    prisma/
    src/
    docs/
    README.md
  frontend/                # Frontend (Vite + React + Tailwind + TS)
    src/
    public/
    docs/
    README.md
  .gitignore
  README.md                # este arquivo
```

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
DATABASE_URL="mysql://USUARIO:SENHA@localhost:3306/adbras_db"
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
