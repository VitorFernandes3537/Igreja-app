
# Runbook - Reset/Conserto do Prisma no Windows (EPERM/Engine travada)

## Quando usar 
- `npx prisma generate` falha com **EPERM** (rename de .dll).
- client não inicializa mesmo após editar o schema.

## passo a passo

- 1. **Pare o servidor Node**
    `Ctrl + C`
- 2. **Feche clientes** (Thunder Client/Postman) e qualquer processo Node:
```ps1
    taskkill | find "node"  "Procura todos os processos do Node no windows"
    taskkill /F /IM node.exe
```
- 3. Apague artefatos do Prisma
    rd /s /q node_modules\.prisma
    rd /s /q node_modules\@prisma

- 4. Abra o terminal como Adriministrador e reinstale/gere:

    npm i
    npx prisma generate

- 5. Suba o servidor
    npm run dev

**Dicas**
- Adicione exceção no antivírus para a pasta do projeto.
- Evite `generate` com o server rodando.

