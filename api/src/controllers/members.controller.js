



// Trás a instância única global do Prisma criada para falar com o banco
const {prisma} = require('../lib/prisma');


// LISTAR
// - 1º começar simples: só membros não deletados
// - 2º depois evoluímos para filtros (status, busca por nome) e paginação take, skip 

     // async faz uma função assíncrona (indica que a função fará coisas que demoram) 
     // e await espere o resultado para retorna os dados como resposta e então catch SE erro, 
     // escreve no console o erro 500 com notação genérica

async function listar(req, res) {
    try{                   
        const membro = await prisma.membro.findMany({  
            where: {deletado_em: null},
            orderBy: {criado_em: 'desc'},
            select:{
                id: true,
                nome: true,
                email: true,
                status: true,
                igreja_id: true,
                criado_em: true,
            },
        });

        return res.json({data: membro });

    } catch (erro){
        console.error("erro ao listar membros: ", erro);
        return res.status(500).json({error: 'erro as listar membros', erro});
    }
}



// CRIAR
// - 1º Faremos o mínimo: precisa de igreja_id e nome(usuario).
// - 2º mostra como registrar um log_auditoria simples.



async function criar(req, res) {
    try{
        // Lê o corpo da requisição para guardar em constante local os valores
        const {igreja_id, nome, email, cpf, aniver_data, telefone, endereco} = req.body; 
        // em seguida validação de campos obrigatórios como igreja_id e nome, sem eles retorna erro 400 (Bad Requester)
        if(!igreja_id || !nome){
            return res.status(400).json({ error: 'Igreja_id ou Nome são obrigatórios'});
        }
        // em seguida validação se essa igreja existe no banco se não existir returna erro 404 (Not found)
        const igreja = await prisma.igreja.findUnique({ where:{ id: igreja_id}});
        if(!igreja){
            return res.status(404).json({ error: 'Igreja não encontrada'})
        }
        // aguarda o dentra variável membro um payload com a criação de um novo membro dentro do banco
        // os "??" dentro dos valores do objeto "data:" são o equivalente a função coalesce() do MySQL 
        // leitura natural do "??": Use o valor da esquerda, se esse valor for null ou undefined, então use o da direita (null)
        // então o que ele está fazendo nesse caso é normalizando os campos e o "? :" em aniver_data é um if ternário 
        // uso muito parecido com o excel por exemplo. condição? valorverdadeiro : valorfalso,
        const membro = await prisma.membro.create({
            data: {
                igreja_id,
                nome,
                email: email ?? null,
                cpf: cpf ?? null,
                aniver_data: aniver_data ? new Date(aniver_data) : null,
                telefone: telefone,
                endereco: endereco ?? null,
                status: 'ativo',
            },
            select:{
                id: true,
                nome: true,
                email: true,
                status: true,
                igreja_id: true,
                criado_em: true,
            },
        });
        // utiliza await para fazer esperar o banco responder e ir para a proxima. 
        // Criando um log simples e enxuto de acao para auditoria com o mínimo necessário. 
        await prisma.logs_auditoria.create({
            data: {
                igreja_id,
                acao: 'membro.create',
                descricao: `Criou um membro ${membro.nome} (${membro.id})`,
            },
        });
        // esse código "201" é o código do https requester que indica que algo foi criado com sucesso no servidor
       return res.status(201).json({data:membro});

    }catch(erro){
        console.error("erro ao criar membro: ", erro);

        if(erro?.code === 'P2002'){
            return res.status(409).json({ error: 'Campo único já existente (email ou cpf)'});
        }
        return res.status(500).json({ error: 'Erro ao criar membro', erro});
    }
}
// Exporta para poder ser utilizado pela api como um todo, deixando as duas funções disponíveis para as rotas

module.exports = { listar, criar };