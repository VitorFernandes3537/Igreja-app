import 'dotenv/config'  
import express, { Request, Response } from 'express';   
import cors from 'cors'; 
import membersRouter from '@/routes/members.routes'

const app = express();  
const PORT = process.env.PORT;


app.use(express.json());  


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: false, 
}));


app.get('/health', (_req: Request, res: Response) => {
    res.json({
        ok: "API rodando, estamos no ar baby!", 
        time: new Date().toISOString() 
    });
})


app.use('/membros', membersRouter)

// basicamente isso diz "Ligue o servidor pra ouvir(listen) requisições http"
app.listen(PORT, () => {
    console.log(`Server ligado no endereço http://localhost:${PORT}/health (NODE_ENV=${process.env.NODE_ENV})`)
})


