// faz uma importação do componente react chamado "Navigate" de react-router-dom
// esse componente nada mais é que um redirecionador por rota, resumindo ele atua como um porteiro
// e (re)direciona o usuário para a rota/page certa, com base em uma validação se ele tem token salvo e esse
// token tem as permissões para acessar essos componentes filhos privados (será implementado)
import type { JSX } from 'react'
import { Navigate } from 'react-router-dom'

/*
    exportamos o component react (essa função como um todo é um component react) e com o {children} informamos 
    que ela deve receber parâmetros e o parâmetro tem uma tipagem clara, apenas um único JSX.Element
*/ 
export function RouteGuard({children}: { children: JSX.Element}){
    const token = localStorage.getItem('token')
    /**
    no return temos um if ternário, basicamente validando se há token, usuário logado, retorna children a 
    pagina privada
    se não tem token, utiliza o <Navigate ... /> para redirecionar, e to="/login" redireciona para o login
    e o replace é muito importante aqui, ele substitui o histórico de entrada para o usuário não clicar em 
    "voltar" e cair em uma página privada que ele não deveria ver. 
    */
    return token ? children : < Navigate to="/login" replace />
}
