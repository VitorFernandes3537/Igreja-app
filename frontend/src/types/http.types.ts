export type HttpError = {
  status: number // código http(404, 500, 401)
  message: string // descrição do é o erro
  cause?: unknown // campo opcional para guardar algo extra, ex o erro original da api (error)
}
