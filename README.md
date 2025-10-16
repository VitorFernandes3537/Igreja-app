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

Abaixo está a **árvore recomendada** da raiz do repositório e, em seguida, um **guia explicando cada pasta/arquivo** do topo do projeto.

```bash
adbras-app/
  api/
    ...                  # código e docs específicos da API
  frontend/
    ...                  # código e docs específicos do Frontend
  docs/
    ADR/
    RUNBOOKS/
    ARCHITECTURE.md
    DEPLOY.md
  .gitignore
  README.md
  package.json
```

> Observações:
> - `node_modules/` e `dist/` ficam **dentro** de `api/` e `frontend/` e são **ignorados** no Git (via `.gitignore`).
> - `private/` é **pessoal** (não versionado).  
> - `docs/` na raiz é para documentação **transversal** (envolve front + API ou arquitetura do sistema).

---

## Guia de pastas (o que vai em cada uma)

### `api/`
Projeto da **API** (Node.js + Express + Prisma + MySQL).
- Código-fonte (`src/`), schema e migrações (`prisma/`), documentação local (`api/docs/`) e `api/README.md` (instruções específicas da API).
- Tudo que é **servidor**, endpoints, acesso a banco e decisões de back-end vive aqui.

### `frontend/`
Projeto do **Frontend** (Vite + React + TypeScript + Tailwind).
- Código-fonte (`src/`), assets públicos (`public/`), documentação local (`frontend/docs/`) e `frontend/README.md` (instruções específicas do front).
- Tudo que é **interface**, estilos e integrações do cliente vive aqui.

### `docs/` (raiz)
Documentação **geral do sistema** (não específica de um lado só).
- `ADR/`: **Architecture Decision Records** que impactam o sistema como um todo (ex.: autenticação, monorepo, padrão de versionamento).  
- `RUNBOOKS/`: procedimentos **operacionais de stack completo** (subir todo o ambiente local, pipeline de deploy, backups).  
- `ARCHITECTURE.md`: visão macro (diagrama de componentes, fluxos de dados, limites de contexto).  
- `DEPLOY.md`: estratégia e checklist de deploy (ambientes, variáveis, passos).

> Regra prática: se o documento **vale para o sistema inteiro**, ele fica aqui; se é específico de **API** ou **Frontend**, fica nos `docs/` da respectiva pasta.

---

## Arquivos na raiz

### `.gitignore`
Ignora artefatos gerados e segredos em **todo o repo**. Exemplo recomendado:
```js
**/node_modules/
**/dist/
**/.env
**/.env.*
.vscode/
.DS_Store
```

### `README.md`
Documento **principal** do repositório:
- Visão geral do projeto e da arquitetura.
- Como rodar **API** e **Frontend** em dev (com links para READMEs locais).
- Variáveis de ambiente e troubleshooting gerais.
- Links para `api/README.md`, `frontend/README.md` e `docs/`.

### `package.json` (raiz)
Scripts de **orquestração** (opcional) para facilitar rodar tudo junto:
```js
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
> Dica: manter scripts **somente** de orquestração aqui; scripts específicos ficam nos `package.json` de `api/` e `frontend/`.

### `package-lock.json`
Lockfile da raiz (se você instalar dependências na raiz, ex.: `concurrently`).  
Os lockfiles de `api/` e `frontend/` pertencem a cada projeto.

---

## Fluxo recomendado na raiz
1. Manter **documentação geral** em `docs/` (ADRs e Runbooks de stack).
2. **Orquestrar** dev com scripts da raiz (`npm run dev`) quando útil.
3. Deixar **detalhes específicos** nos READMEs e docs de cada subprojeto.
4. Garantir que `.env` **não** seja versionado em nenhum subprojeto.

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
