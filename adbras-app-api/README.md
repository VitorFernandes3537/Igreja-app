# adbras-app-api

API do projeto Adbrás (Node.js + Express + Prisma ORM + MySQL).

# Visão Geral
- **Stack:** Node 22, Express, Prisma ORM, MySQL
- **Arquitetura atual:** Rotas -> controllers -> Prisma Client direto
- **Idioma da modelagem do banco** PT-BR nos nomes de tabelas e campos (ex: `membro`, `igreja`...)
- **Ambientes:** development (nodemon), production (node)
- **Padrões Adotados:** Singleton Prisma, soft delete em `membro`campo `deletado_em`, auditoria básica em `logs_auditoria`

# Logs de Documentação do projeto 
- [Troubleshooting (erros comuns e correções)](./docs/TROUBLESHOOTING.md)
- [Guia de Migrações (Prisma)](./docs/MIGRATIONS.md)
- [Runbook — Reset do Prisma no Windows](./docs/RUNBOOKS/resetar-prisma-windows.md)
- [ADRs (Decisões de Arquitetura)](./docs/ADR)
- [Políticas de Segurança (dados sensíveis)](./docs/SECURITY.md)
- [Guia de Contribuição e Convenções](./docs/CONTRIBUTING.md)

# Requisitos
- Node 18+ (Recomendado 20+)
- MySQL 8+
- npm

# Variáveis de Ambiente
Crie `.env` a partir de `.env.example`

- **DATABASE_URL=mysql://USUARIO:SENHA@localhost:3306/seu_data_base**
- **PORT=3000**
- **NODE_ENV=development**


# Instalação
```bash
// instala o node.js e os ira criar os nodes_modules
npm install  

// Gera o cliente PrismaClient dentro da pasta (`node_modules/prisma/prisma-cliente`)
npx prisma generate  

 **Notas:**
- Use porta **3306** (X Protocol 33060 não serve).
- Se a senha tiver `@ # & :`, faça URL-encode.
- Não utilize output no gerenerate cliente do prisma, se usar reference se corretamente o provider
```
-- Banco de dados
> criar/aplicar migrações locais (dev)
- npm run migrate:dev

> reset total do banco (Cuidado)
- npm run db:reset

> GUI do Prisma para ver/editar dados
- npm run studio


-- Execução

> desenvenvolvimento (hot-reload) (Atualizar/salvar algo no código aplica as atualizações instantâneamente)
- npm run dev

> produção
- npm start

# Estrutura de pastas 
- Prisma/
    migrations/
        schema.prisma
- src/
    utils/
        server.js               -- bootstrap do Express (middlewares + montagem das rotas)
    lib/
        prisma.js               -- Singleton do Prisma (Singleton é um padrão criacional de designer)
    routes/
        membros.routes.js
    controllers/
        members.controller.js


# Endpoints 
-- Checagem de Saúde (Healthcheck) para ver se ta tudo ok, e o servidor já está respondendo
> GET /health  -> {`API rodando, estamos no ar baby!`, time`horas`}

-- Membros
> GET /membros 
    - Lista membros não deletados (deletado_em = null)
    - Ordenação: criado_em
    - Campos retornados: id, nome, email, status, igreja_id, criado_em
> POST /membros
    - Body mínimo:
        {
            "igreja_id": "string",
            "nome": "string",
            "email": "string|null",
            "cpf": "string|null",
            "aniver_data": "YYYY-MM-DD|null",
            "telefone": "string|null",
            "endereco": "string|null"
        }
    - Regras
        - Valida existência da igreja (igreja_id)
        - Define status = "ativo" no create (default)
        - Grava auditoria em logs_auditoria (acao: "membro.create")
    - Erros comuns:
        - 400 (BadRequester) -> campos obrigatórios ausentes (igreja_id ou nome)
        - 404 (NotFound) -> igreja não encontrada
        - 409 (Conflict) -> violação de único (email/cpf)
        - 500 (Internal Server Error) -> erro interno ou inesperado do servidor/falha na conexão com o banco de dados

# Modelagem do Banco

> membro 
    id (cuid), igreja_id (FK), nome, email?, cpf?, status (enum: ativo,inativo,suspenso), aniver_data?, telefone?, endereco?, deletado_em?, criado_em, atualizado_em

> igreja
    id (cuid), nome, status(boolean), timestamps

> usuario
    id (cuid), email (unique), nome, senha_bash, timestamps

> igreja_usuario (vínculo e papéis(role))
    usuario_id (FK), igreja_id (FK), role (enum: pastor, secretaria, dev, membro), pode_delete(boolean), timestamps
    unique(usuario_id, igreja_id)

> logs_auditoria
    -- id, usuario_id?, igreja_id?, acao, descricao, criado_em

# Conveções
-- Soft delete: utilizar `deletado_em` (nulo = ativo). Em listas, filtrar por `deletado_em: null`
-- Auditoria: registrar ações relevantes com `acao` e `descricao`
-- Respostas padrão: `{ data }` em sucesso; `{ error }` em erro com status HTTP correto.
-- Prisma Client: usar a instância única exportada por `src/lib/prisma.js`


