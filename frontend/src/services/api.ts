import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { ApiResponse, ApiError, BackendErrorData } from "@/services/http.types";

const BASE_URL = import.meta.env.VITE_API_URL?.toString() || "http://localhost:3001";

// retorna uma função sem parâmetros que retorna (string ou null) e 
// serve para você injetar a forma de buscar o token

type TokenGetter = () => string | null;


let tokenGetter: TokenGetter = () => {

  try{
    return localStorage.getItem("auth.token")
  }catch{
    return null;
  }

};


export const setTokenGetter = (getter: TokenGetter) => {
  
  tokenGetter = getter

};

type UnauthorizedHandler = () => void;
const UnauthorizedHandlers = new Set<UnauthorizedHandler>();

export const onUnauthorized = (fn: UnauthorizedHandler) => {

  UnauthorizedHandlers.add(fn);

  return () => {UnauthorizedHandlers.delete(fn)};

};

const notifyUnauthorized = () => {

  UnauthorizedHandlers.forEach((fn) => fn());

}

// Acima temos um mini sistema de eventos globais para "sessão expirada/401", 
// para que o app inteiro consiga reagir (logout, redirecionar, limpar estado) sem espelhar lógica nos componentes


// Toda a comunicação com o backend do App igreja passa por aqui
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});


// ↓ Antes de QUALQUER requisição sair do front, esse interceptor injeta o Authorization: Bearer <token>.
// Você não precisa lembrar disso em cada chamada. 

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenGetter();
  if(token) {
    config.headers = config.headers ?? {};

    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}` 
    }
  }

  return config;
});


function normalizeSuccess<T = unknown>(
  status: number,
  payload: unknown
): ApiResponse<T> {
  if (payload !== null && typeof payload === "object" && "data" in (payload as Record<string, unknown>)) {
    const obj = payload as {
      data: T;
      message?: string;
      meta?: unknown;
    };

    return {
      ok: status >= 200 && status < 300,
      status,
      data: obj.data,
      message: obj.message,
      meta: obj.meta,
    };
  }

  return {
    ok: status >= 200 && status < 300,
    status,
    data: payload as T,
  };
}

//qualquer erro do Axios é convertido em ApiError com mensagem amigável, 
// código semântico, detalhes brutos e gatilho de 401 global.

function normalizeError(err: unknown): ApiError {
  const axErr = err as AxiosError<BackendErrorData>;
  const status = axErr.response?.status ?? 0;

  const data = axErr.response?.data;

  const backendMessage = axErr.response?.data?.message || axErr.response?.data?.error || 
  axErr.message || "Erro inesperado. tente novamente.";

  const apiError: ApiError = {
    ok: false,
    status,
    message: backendMessage,
    code: data?.code,
    details: data ?? axErr.toJSON?.() ?? null,
  }

  if (status === 401) {
    notifyUnauthorized();
  }

  return apiError;
}

// ---------- Interceptor de RESPONSE ----------
// Mantém o AxiosResponse na resolução e transforma QUALQUER erro em ApiError

api.interceptors.response.use(

  (response) => response,
  (error) => {
    const apiError = normalizeError(error)
    return Promise.reject(apiError)
  }

)

// ---------- Helpers HTTP com tipagem ----------
// Todos os helpers:
// - recebem AxiosResponse da instância `api`
// - convertem para ApiResponse<T> com normalizeSuccess
// - em caso de erro, o Promise.reject já vem com ApiError do interceptor acima


export const httpGet = async <T> (
  url: string,
  params?: unknown
): Promise<ApiResponse<T>> => {
  const response = await api.get<T>(url,{params});
  return normalizeSuccess<T>(response.status, response.data);
};


export const httpPost = async <T>(
  url: string,
  body?: unknown
): Promise<ApiResponse<T>> => {
  const response = await api.post<T>(url, body);
  return normalizeSuccess<T>(response.status, response.data);
};

export const httpPut = async <T>(
  url: string,
  body?: unknown
): Promise<ApiResponse<T>> => {
  const response = await api.put<T>(url, body);
  return normalizeSuccess<T>(response.status, response.data);
};

export const httpPatch = async <T>(
  url: string,
  body?: unknown
): Promise<ApiResponse<T>> => {
  const response = await api.patch<T>(url, body);
  return normalizeSuccess<T>(response.status, response.data);
};

export const httpDelete = async <T> (url: string): Promise<ApiResponse<T>> => {
  const response = await api.delete<T>(url);
  return normalizeSuccess<T>(response.status, response.data);
};
