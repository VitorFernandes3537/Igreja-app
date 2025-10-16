# Guia de migrações - Prisma

## Fluxo Recomendado (dev)
- 1. Editar `prisma/schema.prisma`.
- 2. Validar e formatar:
    ```bash
    npx prisma validate
    npx prisma format
- 3. Gerar e aplicar migração:
    npx prisma migrate dev --name <nome_da_migracao>
    
- Exemplos de nomes:
    - init_schema
    - create_base_models_membro_igreja
    - standardize_membro_fields
    - rename_membro_telefone_fields

**Reset do banco** (Apenas dev)
- Quando o schema mudou de forma destrutiva (e não dados a preservar):
    npm run db:reset
    # ou   
    npx prisma migrate reset
- isso apaga o banco, replica todas as migrações e roda o seed

**Boas Práticas**
- Preferir mudanças incrementais (migrações pequenas e nomeadas).
- Nunca subir migração "quebrando tudo" em ambientes compartilhados
- em Windows, pare o servidor antes de prisma generate/migrate.

