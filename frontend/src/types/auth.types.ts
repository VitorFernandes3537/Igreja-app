// Dados do usuário
export type User = {
    id: string;
    nome: string;
    email: string;
};

// credenciais que são usadas no login
export type LoginCredenciais = {
    email: string;
    senha: string;
};

// formato público que o formato expõe 

export type AuthContextValue = {
    user: User | null;
    token: string | null;
    loading: boolean;
    estaLogado: boolean;
    login: (crendenciais: LoginCredenciais) => Promise<void>;
    logout: () => void;
};