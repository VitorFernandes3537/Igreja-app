import { useEffect, useMemo, useState, type ReactNode} from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { setTokenGetter, onUnauthorized } from "@/services/api";
import { LoginCredenciais, User, AuthContextValue } from "@/types/auth.types";

/* const LS é um objeto que guarda todas as chaves usadas no LocalStorage.
“LS” significa “LocalStorage”.
É usado para padronizar, evitar typos e facilitar manutenção.
as const garante que as chaves nunca mudem e sejam tipadas como literais. */ 

const LS = {
    user: "auth.user",
    token: "auth.token",
} as const;

export function AuthProvider({children}: {children: ReactNode}) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Boot inicial: carrega user/token do localStorage 
    useEffect(() => {
        try{
            const rawUser = localStorage.getItem(LS.user);
            const rawToken = localStorage.getItem(LS.token);
            
            if (rawUser && rawToken) {
                setUser(JSON.parse(rawUser));
                setToken(rawToken);   
            }

        }finally{
            setLoading(false);
        }
    }, []);
    
    // sync de logout entre abas
    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if(e.key === LS.token && e.newValue === null) {
                setUser(null);
                setToken(null);
            }
        };

        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    // integra com a camada HTTP: Axios lê sempre o token atual do contexto
    useEffect(() => {
        setTokenGetter(() => token);
    }, [token]);

    // integra com 401 globais: se o interceptor avisar "não autorizado", faz logout

    useEffect(() => {
        const unsubscribe = onUnauthorized(() => {
            setUser(null);
            setToken(null);
            localStorage.removeItem(LS.user);
            localStorage.removeItem(LS.token);
        });

        return unsubscribe;
    }, [])


    async function login({ email, senha }: LoginCredenciais) {
        // TODO: trocar pelo httpPost real da API
        await new Promise((resolve) => setTimeout(resolve, 300));

        const fakeToken = "FAKE_JWT_TOKEN_123";
        const fakeUser: User = {
            id: "1",
            nome: "Usuário de Teste",
            email,
        };

        localStorage.setItem(LS.user, JSON.stringify(fakeUser));
        localStorage.setItem(LS.token, fakeToken);

        setUser(fakeUser);
        setToken(fakeToken);

        console.debug("login simulado", email, senha)

    }


    function logout() {
        localStorage.removeItem(LS.user);
        localStorage.removeItem(LS.token);
        setUser(null);
        setToken(null);
    }

    const value: AuthContextValue = useMemo(
        () => ({
            user, 
            token, 
            loading, 
            estaLogado: !!token, 
            login, 
            logout
        }), [user, token, loading])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )


}

