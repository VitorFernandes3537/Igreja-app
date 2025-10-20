import { Outlet } from "react-router-dom";

/**
 * Layout privado: onde viverá o header/sidebar do app autenticado.
 * Por enquanto SEM checagem real de auth. Em 3.3 entra o RouteGuard.
 */
export default function PrivateLayout() {
  return (
    <div className="min-h-screen grid">
      {/* header/sidebar viriam aqui */}
      <main>
        <Outlet />
      </main>
    </div>
  )
}
