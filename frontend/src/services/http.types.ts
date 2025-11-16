
// Tipos genéricos para padronizar respostas HTTP na aplicação.

export type ApiResponse<T> = {
    ok: boolean;               // sucesso lógico
    status: number;            // HTTP status (200, 201, 400, 401, etc.)
    data: T;                   // payload já tipado
    message?: string;          // mensagem vinda do backend (opcional)
    meta?: unknown;            // paginação/infos extras (opcional)
};

export type ApiError = {
    ok: false;
    status: number;
    message: string;        // mensagem para a interface do usuário
    code?: string;          // código de erro do backend (quando houver)
    details?: unknown;      // payload de erro bruto (para debug)
}

export type HttpError = {
  status: number // código http(404, 500, 401)
  message: string // descrição do é o erro
  cause?: unknown // campo opcional para guardar algo extra, ex o erro original da api (error)
};

export type BackendErrorData = {
  message?: string,
  error?: string,
  code?: string,
  [key: string]: unknown;  // permite campos extras sem reclamar
}
