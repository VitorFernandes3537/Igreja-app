// from 'Axios' traz a biblioteca/função principal do Axios
/* 
    {AxiosError, Internal AxiosRequesterConfig, AxiosResponse} 
    Tipos do TypeScript que descrevem os objetos do Axios:
    AxiosError: a "forma" do erro quando alguma chamada da errado/falha. útil pra tipar interceptores e catch
    InternalAxiosRequestConfig: descreve o objeto de configuração de uma requisição dentro do 
    interceptor de request - v1
*/

import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import type { HttpError } from '../types/http.types'
/* 
    1. Crio uma instância com base na URL base, ao mesmo tempo exporto ela para utilizá-la em qualquer lugar do app
    2. "axios.create" ao invés de axios.get{} direto, criamos uma instância com 
    configurações padrão (URLB base, timemout, interceptores)
    3. baseURL: define a URL base para todas as chamadas que vem do .env
    4. import.meta.env é do VITE então apenas variáveis de ambiente que começarem com VITE_ aparecem no Frontend
    5. Timeout: tempo limite em ms. Se servidor não responder em 15s, o Axios cancela e lança um erro de timeout.

Nota: 
    Sem o BASE_URL temos que passar URLs completas em cada chamadas.
    Se remover TIMEOUT, requisições podem ficar penduradas por muito tempo.

*/
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000, // evita request travado
})

/*
1. api.interceptors.request.use(...) cria uma função que vai rodar antes de toda a requisição sair do browser,
    é tipo um "Filtro" que prepara a requisição antes de enviá-la.

2. (config: InternalAxiosRequestConfig) => {...} 
    config é o pacote da requisição: URL final do destino, método, headers, body
3. Tipei com InternalAxiosRequestConfig para o TypeScript saber o que existe ali.
    no caso, são as InternalAxiosRequestConfig: "As configurações internas de requisições do Axios"

4. if(token) {...} só anexa headers SE houver token

5. "config.headers = config.headers ?? {}"
    Garante que headers seja um objeto as vezes vem "undefined"
    com ?? {} semelhante a função coalesce(), significa se for null ou undefined, use {}.

6. "config.headers.Authorization = `bearer ${token}`" 
    Adciona header.Authorization no padrão bearer que o backend espera.
    Depois disso. autentica todas as requisições e envia.
    
    Nota: 
    bearer (esquema de autenticação padrão: RFC6750, usando OAuth2/JWT)

7. rerturn config
    Devolve a configuração alterada para o Axios prosseguir

    Nota: Se não retornar as "config" a requisição trava.
    Se trocar o nome do header, o backend pode rejeitar (ele espera Authorization)
*/

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// função de normalização de erros
function toHttpError(e: unknown): HttpError {
  const erro = e as AxiosError<{ message?: string }>
  const status = erro.response?.status ?? 0
  const message = erro.response?.data?.message ?? erro.message ?? 'Erro inesperado'
  return { status, message, cause: e }
}

/*
1. api.interceptors.response.use(onFulfilled, onRejected)
Registra dois callbacks:
    - onFulfilled: roda quando a reposta vem com sucesso (status 2xx).
    - onRejected: roda quando houve erro (status 4xx/5xx, timeout, sem reposta...).

2. (response: AxiosResponse) => response
    - o parmetro da arrowfunction é tipada com o AxiosResponse, No sucesso, apenas devolvemos a própria resposta.
    Nota: poderiamos transformar dados nesse momento, mas manter a "transparencia" é o mais simples.

3. (error: AxiosError) => { return Promise.reject(error) }
    outra arrowfuction com parâmetro "error" tipado com AxiosError (a "forma" do erro do Axios), quando acontece 
    um erro, propagamos o erro para quem o chamou (o try/catch do componente, por exemplo.)
    Promise.reject(error) mantém o fluxo padrão de erro do Axios

    Nota: Se não tratar o erro nem rejeitar, a chamada "parece" ficar silenciosa - o chamador não recebe o erro 
    corretamente.
    Se transformar a resposta aqui, todo o app passa a receber essa "nova forma"; é poderoso, mas exige muito cuidado.
*/
api.interceptors.response.use(
  (res: AxiosResponse) => {
    return res.data
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) return Promise.reject(toHttpError(error))
  },
)
