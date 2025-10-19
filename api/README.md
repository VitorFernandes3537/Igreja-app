# API (Express + Prisma + MySQL)

**Objetivo: Documentação essencial da API (execução, configuração, migrações, rotas e ferramentas).**

> **About this document (read first)**
>
> Este README é a **fonte única de verdade (SSOT)** da **API** do App Igreja.
> Contém **setup**, **scripts**, **variáveis de ambiente**, **estrutura**, **padrões de rotas**,
> **erros e logs**, **boas práticas de segurança** e **procedimentos de execução/testes**.
>
> ### Como este README está organizado
> 1. **Stack & Pré-requisitos** — linguagem/runtime, banco, ferramentas.
> 2. **Configuração (.env)** — variáveis obrigatórias e exemplos.
> 3. **Scripts NPM** — dev, build, test, lint, seed, migrate.
> 4. **Como rodar em desenvolvimento** — passo a passo.
> 5. **Estrutura de pastas** — camadas da aplicação (ex.: `src/`).
> 6. **Padrões de rotas & convenções** — naming, versionamento (`/v1`), status codes.
> 7. **Banco de dados** — migrations, seeds, conexão e reset local.
> 8. **Erros, logs e observabilidade** — formato de erro e logging.
> 9. **Segurança** — CORS, Auth, tokens/secrets.
> 10. **Testes** — como rodar e onde ficam.
> 11. **Problemas comuns** — checklist de falhas e correções.
> 12. **Anexos/Links úteis** — docs complementares do módulo.
> 13. **Changelog (curto)** — alterações relevantes do README.
>
> ### Convenções deste módulo
> - **Idioma**: pastas/arquivos em **inglês**; conteúdo do README em **português**.
> - **Segurança**: nunca versionar segredos; `.env` via exemplo.
> - **Regra de manutenção**: se alterar **rotas/DB/ambiente/scripts/erros**, **atualize este README no mesmo PR**.

---

## Sumário

- [Stack](#stack)
- [Pré-requisitos](#pré-requisitos)
- [Configuração (.env)](#configuração-env)
- [Scripts NPM](#scripts-npm)
- [Como rodar em desenvolvimento](#como-rodar-em-desenvolvimento)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Prisma (ORM)](#prisma-orm)
  - [Migrations](#migrations)
  - [Prisma Studio](#prisma-studio)
- [Padrões de rotas & convenções](#padrões-de-rotasconvenções)
- [Erros, logs e observabilidade](#erros-logs-e-observabilidade)
- [Segurança](#segurança)
- [Testes](#testes)
- [Problemas comuns](#problemas-comuns)
- [Anexos/Links úteis](#anexoslinks-úteis)
- [Comentários do autor](#comentários-do-autor)

---

## Stack

- Runtime: Node.js
- Servidor HTTP: Express
- ORM: Prisma
- Banco de dados: MySQL
- Configuração: dotenv
- Dev helper: nodemon

---

## Pré-requisitos

- Node.js LTS instalado.
- MySQL em execução (porta padrão 3306) com um schema acessível pela DATABASE_URL.

---

## Configuração (.env)
- Crie um arquivo .env na pasta api/ (baseie-se no .env.example):
```bash
    PORT=3000
    DATABASE_URL="mysql://USUARIO:SENHA@localhost:3306/nome_do_banco"
    CORS_ORIGIN=http://localhost:5173
    NODE_ENV=development

```
> Importante: .env não deve ser versionado.

---

## Scripts NPM
**No diretório api/:**

### desenvolvimento (com reload via nodemon)
`npm run dev`

### produção (sem nodemon)
`npm start`

### migrations (desenvolvimento)
`npx prisma migrate dev -n "mensagem_da_migracao"`

### aplicar migrations já existentes (deploy/CI)
`npx prisma migrate deploy`

### abrir GUI para dados
`npx prisma studio`

> Se preferir, adicione scripts equivalentes no package.json.

--- 

## Como rodar em desenvolvimento

1. Configure o `.env` (vide seção anterior).

2. Garanta que o MySQL está rodando e a `DATABASE_URL` é válida.

3. Execute:
```bash
    npm install
    npx prisma migrate dev
    npm run dev
```
4. A API subirá (por padrão) em http://localhost:3000.

---

## Estrutura de pastas
```bash
api/
  docs/
    ADR/
    RUNBOOKS/
    CONTRIBUTING.md
    MIGRATIONS.md
    SECURITY.md
    TROUBLESHOOTING.md
  prisma/
    migrations/            # histórico de migrações (SQL)
    schema.prisma          # fonte da verdade do modelo
  src/
    lib/
      prisma.js            # PrismaClient (singleton)
    controllers/
      members.controller.js
    routes/
      members.routes.js
    utils/
      server.js            # bootstrap do Express (CORS, JSON, /health, rotas)
  .env.example
  package.json
  README.md                # este arquivo

```

## Guia de pastas (o que vai em cada uma)

### docs/
Documentação **específica da API**.
- **ADR/**: decisões de arquitetura (um arquivo numerado por decisão).
- **RUNBOOKS/**: passo a passo operacional (reset, restore, checks).
- **MIGRATIONS.md / SECURITY.md / TROUBLESHOOTING.md / CONTRIBUTING.md**: políticas e guias.

### src/
Código-fonte da API.

- **server.js**  
  Bootstrap do servidor: carrega dotenv, cria o app Express, aplica middlewares globais (JSON, CORS), expõe `/health` e registra `routes/`.

- **routes/**  
  Define os endpoints e mapeia para controllers.  
  _Regra_: apenas roteamento, sem regra de negócio.

- **controllers/**  
  Recebem `req/res`, fazem validação leve, chamam `services/`, definem status e JSON de resposta.  
  _Regra_: controller fino.

- **services/**  
  Regras de negócio da aplicação (políticas, validações de domínio, decisões).  
  Não conhecem Express. Retornam dados/erros de domínio.  
  _Regra_: service “inteligente”.

- **repositories/**  
  Acesso a dados (Prisma/SQL). Funções como `findById`, `list`, `create`.  
  Isola o ORM para facilitar troca/manutenção.  
  _Regra_: repository específico.

- **middlewares/**  
  Interceptam a requisição antes dos controllers: auth, validação de schema, rate-limit, logs.

- **lib/**  
  Utilitários de infraestrutura (singleton do Prisma, logger, e-mail, cache).  
  Sem regra de negócio.

- **utils/**  
  Helpers puros e genéricos (formatadores, normalizadores, mapeadores).  
  Sem dependência de Express/Prisma.

### Arquivos na raiz da API
- **.env.example**: modelo de variáveis obrigatórias (sem segredos).
- **.env**: variáveis locais (não versionar).
- **package.json / package-lock.json**: scripts e dependências.

---

### Fluxo recomendado

routes → (middlewares) → controllers → services → repositories


**Boas práticas**
- Controller fino; Service com regra de negócio; Repository com acesso a dados.
- Services não recebem `req/res`. Controller traduz erro de domínio para HTTP.
- `lib/` para infraestrutura; `utils/` para funções puras.

---

## Prisma (ORM)

### Migrations
- Edite o prisma/schema.prisma para alterar modelos/campos/relacionamentos.
- Gere/aplique uma nova migração:
```bash
    npx prisma migrate dev -n "descricao_da_mudanca"
```
- Em ambientes de deploy:
```bash
    npx prisma migrate deploy
```

### Prisma Studio

- Interface visual para inspecionar e editar dados:
```bash
  npx prisma studio
```

---
## Padrões de rotas/convenções

### CORS
- A API expõe CORS para permitir chamadas do front:

- `.env`
```bash
  CORS_ORIGIN=http://localhost:5173
```

- `src/utils/server.js` (exemplo)
```js
    import cors from 'cors'
    app.use(cors({
        origin: process.env.CORS_ORIGIN,
        methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
        allowedHeaders: ['Content-Type','Authorization'],
        credentials: false
    }))
```

> CORS apenas libera a origem do front; não é autenticação.
> Autenticação (ex.: Authorization: Bearer <token>) é tratada por middleware/rotas.

---

### Rotas disponíveis (atual)

`GET /health`
- Status da API.
- Resposta: `{ ok: true }`

- `GET /membros`

- Lista membros ativos (ex.: ordenação por criado_em DESC, select de campos).
- **Query params** (se aplicável): paginação/ordenação.

- `POST /membros`

- Cria membro.
- Body: JSON com os campos do modelo.
- Validações: conforme controller.

> Atualize esta seção à medida que as rotas evoluírem (inclua códigos de status, exemplos de request/response e regras de validação).

---

### Problemas comuns

- CORS bloqueando: confira CORS_ORIGIN e se o front está em http://localhost:5173.
- Falha de conexão ao DB: verifique DATABASE_URL, credenciais e se o MySQL está rodando.
- Migrações inconsistentes: rode npx prisma migrate dev e verifique conflitos no diretório prisma/migrations/.
- Porta em uso: altere PORT no .env ou libere a porta.

## Comentários do Autor