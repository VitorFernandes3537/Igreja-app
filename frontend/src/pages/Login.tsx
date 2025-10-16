// importando o tipo FormEvent, o tipo formulário de evento do React, para tipar o evento do formulário
import type { FormEvent } from "react";
// import { api } from '@/lib/api'

// declara um component react chamado Login() e exporta como padrão do arquivo, exportar como defaut permite
// importar com qualquer nome... ex: import login from './Login'
export default function Login() {
    // async marca que pode usar await onde esperará algo acontecer para continuar.
    // parâmetro e tipado = Um evento de formulário cujo alvo é um HTMLFormElement 
    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        // impede o padrão de comportamente do navegador que é recarregar a página ao enviar um form
        e.preventDefault()
        // cria um objeto do tipo FormData com base no formulário que disparou o evento. Uma "fotografia" dos campos
        // e.currentTarget: é uma referência ao elemento que está com o listener (a tag <form>)
        const form = new FormData(e.currentTarget)
        // isso faz a leitura dos campos pelo atributo name, e faz normalização pois se o .get trouxer null, 
        // ele converte para string vazia
        const email = String(form.get('email') || '')
        // DESCOMENTAR PARA USAR API const senha = String(form.get('senha') || '')
        // um mock para fluir sem backend, para validar rápida as rotas ja funcionando.
        const data = {token: 'dev-token', user: {id: '1', nome: 'usuarioteste', email}}
        // usa a persistência do localStorage para setar o login com os dados e token do user
        // guardando o estado global de sessão
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user) )
        // escolhido pela simplicidade do MVP redireciona para '/'
        window.location.href = '/'
    }
    //explicação abaixo
    return (
        <div className="min-h-screen grid place-items-center bg-slate-900 text-white p-6">
            <form onSubmit={onSubmit} className="w-full max-w-sm space-y-3">
                <h1 className="text-2xl font-bold">Entrar</h1>
                <input name="email" placeholder="Email" className="w-full px-3 py-2 rounded text-slate-900" />
                <input name="senha" type="password" placeholder="Senha" className="w-full px-3 py-2 rounded text-slate-900" />
                <button className="w-full bg-emerald-500 hover:bg-emerald-600 rounded px-4 py-2 font-medium">Acessar</button>
            </form>
        </div>
    )
}

/*
  Dentro do return temos um JSX com Tailwindcss
  Atributos utilizados: 
    - min-h-screen: ocupa a altura da tela inteira.
    - grid place-items-center: centraliza o form
    - bg-slate-900 text-white p-6: tema escuro + padding a classe p-6 define um padding de espaçamento interno 
em todas as direções do elemento. 1 unidade = 4px então seria 6 * 4 = 24px <- tamanho do espaçamento.
    - max-w-sm: limita ao tamanho da largura (estética e legibilidade)
    - space-y-3 cria um espaçamento vertical entre os elementos filho 
    - text-2x1: define um texto 2 vezes maior que o padrão definido no documento.
    - font-bold: aplica o peso 700 (negrito) aumentando a expessura da font
    - w-full: ocupe toda a largura 
    - px-3: tenha um preenchimento interno de 3 unidades na esquerda/direita (x = eixo x, horizontal esquerda/direita)
    - py-2: tenha um preenchimento interno de 2 unidade no topo/baixo (y = eixo y, vertical) topo/baixo
    - rounded: bordas arredondadas
    - text-slate-900: a cor do texto será um tom de azul-acinzentado 
    - bg-emerald-500: define a cor do fundo para um verde esmeralda
    - hover:bg-emerald-600: muda a cor para um verde mais escuro ao passar o mouse por cima (hover: )
    - font-medium: define o peso para médio 
*/
