# Contribuição e Convenções

## Estilo de código
- CommonJS (`require/module.exports`).
- Nomes de campos no Prisma: **snake_case minúsculo** (ex.: `criado_em`, `telefone`).
- Evitar require circular.

## Commits (sugestão)
- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` documentação
- `chore:` manutenção
- `refactor:` refatoração sem mudar comportamento

## Rotas/Controllers
- Rotas só “encaminham”; **nada** de Prisma nelas.
- Controllers lidam com:
  - validação (mínimo viável)
  - regras de negócio
  - interação com o Prisma
  - respostas padronizadas `{ data }` / `{ error }`

## Respostas
- Sucesso: `200`, `201` com `{ data: ... }`
- Erros:
  - `400` (BadRequester) faltando campos
  - `404` (NotFound) não encontrado
  - `409` (Conflict) conflito/P2002
  - `500` (Error internal servidor) erro interno (logar internamente o stack)

## Como rodar
1. `npx prisma generate`
2. `npx prisma migrate dev --name init_schema`
3. `npm run dev`
4. Testes via Thunder Client/Postman
