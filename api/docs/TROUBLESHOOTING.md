# Troubleshooting -- Soluções de Problemas (sanitizado)
Este documento lista **erros recorrentes** e **como corrigir**. Não contém dados sensíveis.

-- P1013 (DATABASE_URL inválida): ver rota 3306(MySQL), senha com URL-encode
-- P3014 (shadow db): dar permissão `CREATE/DROP` global ou usar `shadowDatabaseUrl`
-- Minha solução para isso foi dar permissão administrativas BDA para o user que se conecta no banco
-- MODULE_NOT_FOUND: conferir caminhos relativos (../routes/...) conforme pasta do arquivo.
-- Studio "trava" o terminal: ele roda em foreground. Abra outro terminal(recomendado) ou `Ctrl + C`

# 1. @prisma/client did not initialize yet
**Sintoma**  
Ao subir a API: “@prisma/client did not initialize yet. Please run `prisma generate`…”.

**Causa**  
Cliente do Prisma não gerado, ou gerado em pasta custom (ex.: `./generated/prisma`) enquanto o código importa `@prisma/client`.
Ou tentar gerar Cliente com o servidor rodando, ideal dar um `Ctrl + C` para desligar o nodemon e então verificar erro específico se (Cliente não gerado)

**Correção (recomendada)**  
- `schema.prisma` → usar o padrão:
  ```prisma
  generator client { provider = "prisma-client-js" }

**O que fazer?**
- parar o server (nodemon)
- npx prisma generate

**Notas**
- Se insistir em output custom, ajuste *todos* imports para o novo caminho
- Prefira o padrão do Prisma para evitar divergências.

# 2. EPERM ao gerar Prisma no Windows

**Sintoma**
- `EPERM: operation not permitted, rename ...query_engine-windows.dll.node.tmp...`
    - É como se ele pedisse para alterar o nome de um arquivo (.dll) e tirar a "extensão final do arquivo" .`tmp-xxxx`

**Causa**
- Arquivo do engine em uso (nodemon/Node) ou Antivírus bloqueando. 
    - Esse arquivo engine é o seu `server.js`


**Correção**
- 1. Parar o servidor (Ctrl+C) e fechar clientes
- 2. (Opcional + recomendado) Matar todo os processos Node:
    Comandos(cmd/powershell):
        `taskkill | find "node"`  encontrar os serviços node rodando.
        `taskkill /F /IM node.exe` força matar todos os processos encontrados.
- 3. Terminal vscode ou bash
    Comandos:
        `rd/ s/ q/ node_modules\.prisma`
        `rd/ s/ q/ node_modules\@prisma`
- 4. Abrir terminal como **Adminitrador** no vscode ou bash
    Comandos:
        `npm i` Reinstala o node
        `npx prisma generate` Gera o cliente

**Prevenção**
- Não rodar `generate` com servidor ativo; adicione exceção no antívirus para a pasta do projeto
    - (Opcional) só se estiver dando muito problema mesmo.

# 3. Import de rotas com caminho errado
**Sintoma**
- 404/MODULE_NOT_FOUND; usou `.../routes/...` ou `./routes/...` (três pontos ou 1 pontos)

**Correção**
- Use caminhos ralativos válidos:
    `app.use('membros', require('../routes/membros.routes'));`

# 4. 404/CSP quando abre a porta no navegador

**Sintona**
- Erros do DevTools (.well-know/...) e 404(NotFound)

**Causa**
- Sem frontend; o navegador "espera" assets.

**Correção**
- Ignorar. Testar com Thunder Client/Postman/curl(No CMD).

# 5. TypeError: Cannot read properties of undefined (reading 'json')
**Causas comuns**
- Assinatura invertida (res, req). Correto **(req, res)**,
- Sombrou res (ex: const res = ...),
- console.error(500).json(...) (inválido),
- import incorreto de prisma.

**Correção-base**
- Verificar trecho .js em controllers.js
- Comando:
``` 
    async function listar`(req, res)` {
        try { /* ... */ }
        catch (err) {
    `return` `res.status(500).json({ error: '...' });`
        }
    }

    `const prisma = require('../lib/prisma');`
```
# 6. argument handler must be a function (Express)

**Causa**
- Controller exportado errado (ou require circular),

**Exemplo errado (evitar):**
- Comando (errado):  
    `module.exports = { listar, criar: require('./members.controller').criar };`

- Comando (certo):
    `module.exports = { listar, criar };`

- Comando na rota:
    `const members = require('../controllers/members.controller');`
    `router.post('/', members.criar);`

# 7. Identifier 'prisma' has already been declared
**Causa**
- Declarou `const prisma` duas vezes, ou importou o Prisma em rotas.

**Correção**
- Apenas src/lib/prisma.js cria a instância e exporta.
- Controllers fazem `cont prisma = require('.../lib/prisma')`
- Rotas não importam Prisma.

# 8. PrismaClientValidationError no POST (nomes de campos)
**Casos Vistos**
- campo `Telefone` no schema vs `telefone` no bod/controller. (case-sensitive)
- `OrderBy` escrito como `Orderby` ('B' minúsculo),
-  `criado_em` vs `creado_em`.

 **Correção**
 - Prima é case-sensitive. Alinhar campos.
 - Padrões recomendados: snake_case minúsculo no schema

# 9. Falha ao conectar (Curl: Failed to connect to localhost:3000)
**Causa**
- Servidor não rodando ou porta diferente.

**Correção**
- Confirmar log nodemon.
- Testar `GET /health`.

# 10. Permissões MySQL / migrações
**Problemas**
- `migrate dev` sem privilégios como CREATE/DROP/ALTER
- Alterar coluna com dados existentes (falha)

**Correções**
- Conceder privilégios ao usuário dev.
- **Em dev**, use o script `db:reset` para resetar o banco.
- Rodar `npx prisma migrate dev --nome <nome_da_migracao>`.

# 11. PowerShell bloqueia `npm` (execução de scripts)
**Erro**
- `PSSecurityException` 

**Correção**
- Para resolver o problema para **sessão atual*:
- rode esse comando: 
    `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`

- Para resolver o erro para **usuário atual**:
    `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` (Bypass -> RemoteSigned)

