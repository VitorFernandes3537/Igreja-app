import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function RouteGuard() {
    // Lê o estado de autenticação (do hook de alto nível)
    const { estaLogado, loading } = useAuth();

    if (loading) {
        // TODO: trocar por um spinner bonito
        return <div>Carregando...</div>
    }

    // se não logado, manda para /login
    // `replace` evita ficar com a rota privada no histórico
    if (!estaLogado) {
        return <Navigate to= "/login" replace/>;
    }

    // Se está logado, libera as rotas filhas desse guard
    // <Outlet /> é o “buraco” onde entram as rotas aninhadas
    return <Outlet />;
}