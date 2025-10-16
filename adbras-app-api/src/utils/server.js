require('dotenv').config();    // Carrega variáveis necessárias do arquivo .env para process.env

const express = require('express');   // importa o Express

// 3º cria o meu server(app) através do framework express que 
// serve para definir rotas, middlewares e comportamentos do servidor
const app = express();  

// Variável local que carrega o middleware de segurança para liberar 
// acesso entre domínios, resumindo é uma camada de segurança que diz quem pode acessar minha API a partir de um outro domínio.
const cors = require('cors'); 

// No padrão o navegador BLOQUEIA requisições de origins diferentes, 
// então essa linha habilita/permite que acessem a API por atráves de outras origins dominios
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: false, 
}));

// sem essa linha se alguém mandar uma requisições utilizando o formato JSON o servidor não entenderia
app.use(express.json()); 

// Roda GET / que responde mostrando o valor de NODE_ENV (ou 'undefined' se não existir)

app.get('/health', (_req, res) => {
    res.json({ok: "API rodando, estamos no ar baby!", time: new Date().toISOString() });
})

// Define a const porta a partir da variável de ambiente .env (PORT) = 3000 
const PORT = process.env.PORT;  

// indica que todas as rotas que partirem de /membros será tratada em outro arquivo .js no caso, na pasta de rotas.js(*.routes.)
app.use('/membros', require('../routes/members.routes'))
// basicamente isso diz "Ligue o servidor pra ouvir(listen) requisições http"
app.listen(PORT, () => {
    console.log(`Server ligado no endereço http:localhost:${PORT} (NODE_ENV=${process.env.NODE_ENV})`)
})
