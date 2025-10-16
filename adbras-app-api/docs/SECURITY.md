# Segurança — Dados sensíveis e logs

## Princípios
- **Menos é mais**: só coletar/armazenar o necessário.
- **Separação de ambientes**: dev vs prod com credenciais distintas.
- **Sem segredos no Git**: `.env` nunca deve ser commitado.

## Boas práticas
- `.env` no `.gitignore`.
- Rotacionar credenciais periodicamente.
- Sanitizar logs (nunca logar CPF/email bruto em erros).
- Exportar apenas o necessário nas respostas (usar `select` no Prisma).
- Em bugs de validação, retornar mensagens genéricas para clientes externos.

## Incidentes
- Manter um **incident log** privado com detalhes técnicos, mas sem dados reais.
