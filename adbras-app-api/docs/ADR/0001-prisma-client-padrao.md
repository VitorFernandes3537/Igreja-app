```md
# ADR 0001 - Usar Prisma Client no caminho padrão (@prisma/client)

**Status** Aceita
**Data:** 2025-10-12

## Contexto
Havia a possibilidade de gerar o client do Prisma em um caminho custom (ex: `./generate/prisma`)

## Decisão
- Manter o **caminho padrão**:
```prisma
    gerenerator client {
        provider = "prisma-client-js"
    }
```
- sem output custom

Consequências
- imports simples no código (@prisma/client na lib).
- Menos atrito em prisma generate e migrações.
- Menor chance de erro ao montar ambiente novos.

# Alternativas consideradas
- Output custom + imports relativos: rejeitada por aumentar complexidade e risco.

