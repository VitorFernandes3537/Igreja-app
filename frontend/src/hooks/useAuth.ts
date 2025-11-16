// Hook de alto nível para consumir o contexto de autenticação
import { useContext, useEffect } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { onUnauthorized, setTokenGetter } from "@/services/api";
import { AuthContextValue } from "@/types/auth.types";


export function useAuth(): AuthContextValue {
    // Lê o valor atual do AuthContext
    const ctx = useContext(AuthContext);

    // Garante que o hook só é usado dentro de <AuthProvider>
    if(!ctx) {
        throw new Error("UseAuth deve ser usado dentro de <AuthProvider>. ");
    }

    const {token, logout} = ctx;

    // Mantém a camada HTTP (Axios) sempre com o token mais recente
    useEffect(() => {
        setTokenGetter(() => token ?? null)
    }, [token])
    
    // Registra um handler global: qualquer 401 da API dispara logout()
    useEffect(() => {
        const unsubscribe = onUnauthorized(() => {
            logout();
        });
        
        // Remove o handler ao desmontar para evitar vazamentos
        return unsubscribe;

    }, [logout])

    // Expõe todo o objeto de autenticação para os componentes
    return ctx;
}