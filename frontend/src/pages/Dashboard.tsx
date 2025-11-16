import { useAuth } from "@/hooks/useAuth"


export default function Dashboard() {
  const {user, logout} = useAuth();


  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <header className="flex items-center justify-center">
        <h1 className="font-bold min-w-screen justify-between">Dashboard Teste</h1>
        <div className="flex items-center gap-3">
          <p> Bem vindo, {user?.nome ?? "Usuário"}!</p>
          <button
            className="bg-rose-500 text-white px-3 py-1 hover:bg-rose-600 transition-colors"
            onClick={logout}>Sair
          </button>
        </div>
      </header>
      <p className="mt-6 opacity-80">Bem-vindo ao App adbrás.</p>
    </div>
  )
}
