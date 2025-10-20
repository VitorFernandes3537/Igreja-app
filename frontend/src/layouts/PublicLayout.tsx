import { Outlet } from "react-router-dom";

/**
 * Layout público: ideal para páginas como /login, /forgot-password etc.
 * O <Outlet /> renderiza as "rotas-filhas" aqui dentro.
 */
export default function PublicLayout() {
  return <Outlet />
}

