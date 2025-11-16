/* 
    Import dos hooks do React
    useState -> Guarda o estado atual de auth.
    useEffect -> roda uma vez ao montar o component/hook para restaurar sessão do localStorage - só faz um reset de sessão
    useCallback memoriza as funções login e logout (mesma referência entre renders), útil para evitar re-renderizações desnecessárias em componentes filhos.
*/

import { useCallback, useEffect, useState } from 'react'

// definição do molde que define a forma/tipos dos dados de User(usuário) e do AuthState(estado de autenticação)
type User = { id: string; nome: string; email: string }
type AuthState = { user: User | null; token: string | null }

export function useAuth() {
  /* 
        crie um array que guarda os dois valores que useState retorna quando usado...
        o AuthState é o molde que eu define que o use state tem que ter, 
        o que eu digo aqui é: esse molde afeta o "auth" variável que guarda o estado atual da autenticação que nesse caso estamos definindo como
        user e token = null, e o setAuth é uma função que o useState retorna para atualizar a UI (interface) automaticamente para refletir 
        o estado Atual de autenticação, também criado por useState e guardado em "auth"

    */
  const [auth, setAuth] = useState<AuthState>({ user: null, token: null })

  /*
        useEffect ele é um hook do react utilizado para executar efeitos colaterais, no caso aqui, após o usuário atualizar a página
        ele verifica o que tem dentro do localStorage trazendo para a variável "u" o user do localStorage (que está logado)
        semelhantemente traz para a variavel "t" o token que estava logado antes da reinicialização da página, após uma verificação de existência
        if (t && u) <- isso diz: "se o t(token) e u(user) existem, ou seja o usuário já estava logado antes" então: utilize a função de 
        atualização de UI do useState (setAuth) 
        e atualizeo estado de autenticação para o token: t e o user: "u" convertido em objeto JSON, JSON.parse(u), isso porque o localStorage 
        guarda os dados do login anterior mesmo que feche o navegador em formato string então o json que ele guarda 
        parece com isso: "{\"id\":\"1\",\"nome\":\"João\",\"email\":\"joao@email.com\"}" e então precisa converter em objeto novamente.
        o último argumento pois a arrow function ", []" é chamado de array de dependência, que diz que essa função vai rodar apenas na 
        inicialização, na mesma sessão ele não roda novamente, se atualizar a página reinicializasse a sessão então ele toda novamente e ponto.
    */

  useEffect(() => {
    const t = localStorage.getItem('token')
    const u = localStorage.getItem('user')
    if (t && u) setAuth({ token: t, user: JSON.parse(u) })
  }, [])

  /*
        useCallback é um hook do react usado para memorizar uma função
        ele evita que a função seja recriada toda vez que o component renderiza
        aqui também temos o array de dependências vazio ", []" fazendo ela ser criada apenas uma vez, sem o useCallback o react
        recriaria essa função todo hora e isso poderia causar re-renderizações desnecessárias em componentes filhos que usam esse hook. 
        em seguida temos a arrow function dentro do useCallback ela é está recebendo apenas 2 parâmetros "token: string" que é uma string
        e o "user: User" que traz o molde type que criamos no começo, dizendo que tem que seguir aqueles modes e chave/"tipo_do_"valor
        em seguida o "set" salva o token e o user no localStorage, ele guarda esses valores de forma persistente, em formato string.
        quando vamos guardar o user fazemos JSON.stringfy(user) é o método JSON que converte um objeto JSON em string, isso deve-se porquê
        o localStorage só guarda string então temos que empacotar o JSON em um string primeiro...
        ref: anteriormente no momento de verificação de user e token para autenticar na utilização do useEffect fazemos JSON.parse, desempacotando
        para o formato objeto JSON (chave e valor)
        na próxima linha temos o setAuth({token, user}) atualizando o estado global de autenticação com os novos valores...
        resumindo fazendo atualizações de UI com base na role do user liberando rotas privadas, mudando o nome do botão "entrar" para "sair"
        e guardando-o na memória atual do app 

    */

  const login = useCallback((token: string, user: User) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setAuth({ token, user })
  }, [])

  /*
        useCallback novamente memoriza a função para evitar que seja recriada toda vez que o componente renderiza, com o array de dependencia vazio
        criando ela apenas na inicialização (no mount).
        não recebe parâmetros, e remove a persistência do localStorage quando remove do localStorage o item token e user atual da sessão, 
        em seguida utiliza o setAuth(nome da função que atualiza o estado, variável do estado auth nesse caso) para null no caso, 
        deslogado assim como se inicia.

        com o try e finally ele tenta remover do localStorage o token e o user e se por algum erro raro ele não remover...
        o finally que roda com erro ou sem erro, ativa o setauth 
    */

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    } finally {
      setAuth({ token: null, user: null })
    }
  }, [])

  // retorna e exporta as funções de autenticação do estado e o estado completo criado aqui dentro, no caso,
  // auth = {user: 'user' e token: 'token'} nos tipos descritos no começo quando fora declarado o auth e setAuth
  return { ...auth, login, logout }
}
