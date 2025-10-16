
/*
esse código implementa um singleton de Prisma (1 instância), 
com um cache em global no dev para sobreviver a hot-reload, 
e exporta essa instância para ser usada em toda a API.
*/ 

// 1º abaixo importamos o PrismaClient gerado a partir do seu schema.prisma (prisma-client-js)
const {PrismaClient } = require('@prisma/client');

// 2º Criamos uma variável local que irá apontar para uma única instância
let prisma;


// 3º evita múltiplas instâncias abertas em dev por hot-reload do nodemon 
// faz com que o nodemon não crie várias conexões com o servidor a cada vez que ocorra alteração
// o que evita o erro "too many connections" porém se estiver em produção abre a instância normalmente

if(process.env.NODE_ENV !== 'production'){

    if(!global.__prisma){
    global.__prisma = new PrismaClient();
}
    prisma = global.__prisma;

}else{
    prisma = new PrismaClient();
}


// utiliza o module do node para exportar a instancia em cache no modo dev para ser usada em toda a API
module.exports = {prisma}