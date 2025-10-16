# Frontend (Vite + React + TypeScript + Tailwind)
**Objetivo: Documentação exclusiva do frontend — setup, scripts, variáveis, estrutura, estilo, cliente HTTP e práticas locais.**

## Sumário
- [Stack](#stack)
- [Pré-requisitos](#pré-requisitos)
- [Configuração (.env)](#configuração-env)
- [Scripts NPM](#scripts-npm)
- [Como rodar em desenvolvimento](#como-rodar-em-desenvolvimento)
- [Build de produção](#build-de-produção)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Guia de pastas](#guia-de-pastas-o-que-vai-em-cada-uma-de-pastas)
- [Estilo (Tailwind + PostCSS)](#estilo-tailwind--postcss)
- [Cliente HTTP (Axios)](#cliente-http-Axios)
- [Alias de importação (@)](#alias-de-importação-)
- [Problemas comuns](#problemas-comuns)
- [Comentários do autor](#comentários-do-autor)

---

## Stack

- Vite (dev server e build)
- React + TypeScript
- Tailwind CSS (via PostCSS + Autoprefixer)
- Axios (cliente HTTP)

---

## Pré-requisitos
- Node.js LTS instalado.

---

## Configuração (.env)

Crie o arquivo `.env` nesta pasta do frontend (baseie-se no `.env.example`):

```bash
VITE_API_BASE_URL=http://localhost:3000
```
> Observação: variáveis acessíveis no código do Vite **devem** começar com `VITE_`.

---

## Scripts NPM

No diretório do frontend:

```bash
  npm install
  npm run dev      # inicia o Vite (desenvolvimento)
  npm run build    # build de produção (gera /dist)
  npm run preview  # serve o build localmente para checar
```

---

## Como rodar em desenvolvimento

1. Configure o `.env` (seção acima).
2. Instale dependências:

```bash
  npm install
```
3. Suba o servidor de dev:

```bash
  npm run dev
```

4. Acesse a URL mostrada (geralmente `http://localhost:5173`).

---

## Build de produção
Gera artefatos estáticos em `dist/`:

```bash
  npm run build
```

Para validar localmente:
```bash
  npm run preview
```

---

## Estrutura de pastas
Exemplo:
```bash
frontend/
  docs/
    ADR/
    RUNBOOKS/
    ACCESSIBILITY.md
    UI-GUIDE.md
  public/
    vite.svg
  src/
    assets/
      react.svg
    lib/
      api.ts                  # instância base do Axios
    App.css
    App.tsx
    index.css                 # entrada de estilos (Tailwind)
    main.tsx
  .env.example
  eslint.config.js
  index.html
  package-lock.json
  package.json
  postcss.config.js
  README.md                   # Esse arquivo
  tailwind.config.ts
  tsconfig.app.json
  tsconfig.json
  tsconfig.node.json
  vite.config.ts
```

---

## Guia de pastas (o que vai em cada uma)

### `docs/`
Documentação **específica do frontend**.

- `ADR/`: decisões de arquitetura do front (padrão de componentes, estado, navegação); um arquivo numerado por decisão.
- `RUNBOOKS/`: procedimentos operacionais do front (limpar cache do Vite, corrigir tipos, verificar build).
- `ACCESSIBILITY.md`: diretrizes de acessibilidade (atalhos, contraste, navegação por teclado).
- `UI-GUIDE.md`: guia de UI (padrões de layout, espaçamentos, tokens Tailwind, convenções de nome).

---

### `public/`
Arquivos **estáticos** servidos como estão (sem passar pelo bundler).

- `vite.svg`: ícone padrão do template; qualquer outro asset estático global também fica aqui.
- Observação: tudo dentro de `public/` é copiado para a raiz do build final.

---

### `src/`
Código-fonte do frontend.

- `assets/`  
  Imagens/ícones referenciados no código (quando não fizer sentido ficar em `public/`).  
  Exemplos: `react.svg`, logos internas, ilustrações.

- `lib/`  
  Utilitários **compartilháveis** e “infra” do front.  
  - `api.ts`: **instância base do Axios** (URL da API via `import.meta.env.VITE_API_BASE_URL`, `timeout`, interceptors de `Authorization`).

- `App.tsx` / `App.css`  
  Componente raiz da aplicação e seus estilos globais relacionados (separados do `index.css` do Tailwind).

- `index.css`  
  Entrada de estilos do projeto com as diretivas do Tailwind:
  ```js
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```

- `main.tsx`  
  Ponto de **bootstrap** do React: cria a árvore de componentes e monta o `<App />` no DOM.

> Se/Quando existirem:
> - `components/`: componentes reutilizáveis (Button, Table, Modal…).
> - `features/`: pastas por funcionalidade (ex.: `features/membros/` com `ui/`, `api/`, hooks específicos).

---

## Arquivos na raiz do frontend

- `.env.example`  
  Modelo das variáveis do Vite (sem segredos). Ex.:
  ```bash
  VITE_API_BASE_URL=http://localhost:3000
  ```
  Observação: o arquivo real `.env` **não** é versionado.

- `index.html`  
  Template HTML base onde o Vite injeta o bundle e monta o React (possui o `<div id="root">`).

- `eslint.config.js`  
  Regras de linting do projeto (qualidade de código).

- `postcss.config.js`  
  Pipeline de processamento de CSS: inclui **Tailwind** e **Autoprefixer**.

- `tailwind.config.ts`  
  Configuração do Tailwind (paths para “purge”, tokens, temas, presets).

- `vite.config.ts`  
  Configuração do Vite (plugins, alias `@`, otimizações).

- `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json`  
  Configuração do TypeScript (alvos, paths, regras).
  - `tsconfig.json`: base compartilhada.
  - `tsconfig.app.json`: ajustes para o app web.
  - `tsconfig.node.json`: ajustes para scripts Node (ex.: config do Vite).

- `package.json` / `package-lock.json`  
  Dependências e **scripts** do frontend:
  ```bash
  npm run dev      # servidor de desenvolvimento (Vite)
  npm run build    # build de produção (gera dist/)
  npm run preview  # serve o build local para checar
  ```

- `README.md`  
  Documentação **exclusiva do frontend** (setup, scripts, alias, Axios, Tailwind, problemas comuns). Mantenha links para `frontend/docs/`.

---

## Fluxo recomendado (front)

```bash
  lib/api.ts → (hooks/serviços) → componentes (ui) → páginas
```

- `lib/` concentra integração (Axios, utils).
- Componentes ficam “puros” (recebem dados por props).
- Páginas orquestram dados e navegação.



---

## Estilo (Tailwind + PostCSS)

**Configuração**

- `tailwind.config.ts`: informa ao Tailwind onde procurar classes e suas personalizações (tema, cores, etc.).
- `postcss.config.js`: pipeline de CSS (inclui Tailwind e Autoprefixer).

**Entrada de estilos**
No arquivo de estilos global (ex.: `src/index.css`) devem estar as diretivas:

```bash
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Uso**
Aplique classes utilitárias diretamente no JSX:
```html
<div className="p-4 rounded-xl shadow">
  ...
</div>
```
---

## Cliente HTTP (Axios)
A instância fica em `src/lib/api.ts` (centralizada), com `baseURL` vinda do `.env` do Vite e interceptor para anexar `Authorization: Bearer <token>` quando existir no `localStorage`.

**Exemplo de uso**
```js
import { api } from '@/lib/api'
async function carregarMembros() {
  const { data } = await api.get('/membros')
  return data
}
```
> Dica: após login, salve o token em localStorage.setItem('token', ...). O interceptor já o enviará nas próximas requisições.

---

## Alias de importação (@)
Se configurado (recomendado), você pode importar com `@/`:

- `vite.config.ts` (exemplo):
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
```

- `tsconfig.json` / `tsconfig.app.json` (paths):
```js
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```
Uso:
```js
import { api } from '@/lib/api'
```

---

## Problemas comuns

- Env não refletiu: reinicie `npm run dev` após editar `.env`.
- CORS: se o navegador bloquear, ajuste `CORS_ORIGIN` no backend para permitir `http://localhost:5173`.
- Axios não encontrado: instale no frontend (`npm i axios`) e confira se importou `import axios from 'axios'`.
- Tipos TS do Axios com `verbatimModuleSyntax`: use `import type { ... } from 'axios'`.
- Token não vai: confirme que o `localStorage` tem a chave `'token'` e que o interceptor do `api.ts` está ativo.

--- 

## Comentários do autor