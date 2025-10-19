import { useState } from 'react'
// Exemplo de import absoluto via alias:
import { ButtonPrimary } from '@/components/ButtonPrimary'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-bold">App Igreja — Base</h1>
        <p className="text-sm opacity-80">Estrutura inicial com alias, Tailwind e componentes.</p>
      </header>

      <main className="mx-auto max-w-3xl p-6">
        <div className="flex items-center gap-4">
          <ButtonPrimary onClick={() => setCount((c) => c + 1)}>Incrementar</ButtonPrimary>
          <span className="text-lg">Contagem: {count}</span>
        </div>
      </main>
    </div>
  )
}
