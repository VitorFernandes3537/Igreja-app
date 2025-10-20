import { createBrowserRouter, Navigate } from 'react-router-dom'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Membros from '@/pages/Membros'
import PublicLayout  from '@/layouts/PublicLayout'
import PrivateLayout from '@/layouts/PrivateLayout'

/**
 * Definição das rotas com createBrowserRouter:
 * - "/" redireciona para "/dashboard" (após auth virá uma lógica condicional)
 * - Bloco público (login)
 * - Bloco privado (dashboard, membros)
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    element: <PublicLayout />,
    children: [
      { path: '/login', element: <Login /> },
    ],
  },
  {
    element: <PrivateLayout />,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/membros', element: <Membros /> },
    ],
  },
  // Rota coringa 404, não encontrou a slug? manda pra o login
  { path: '*', element: <Navigate to="/login" replace /> },
])
