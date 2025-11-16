import { createBrowserRouter, Navigate } from 'react-router-dom'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Membros from '@/pages/Membros'
import PublicLayout  from '@/layouts/PublicLayout'
import PrivateLayout from '@/layouts/PrivateLayout'
import { RouteGuard } from './RouteGuard'

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
    // bloco público: só layouts/páginas que não exigem login
    element: <PublicLayout />,
    children: [
      { path: '/login', element: <Login /> },
    ],
  },
  {
    // bloco protegido: tudo aqui dentro passa pelo RouteGuard
    element: <RouteGuard />,
    children: [
      { 
        // layout das rotas privadas (navbar, sidebar, etc.)
        element: <PrivateLayout />,
        children: [
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/membros', element: <Membros /> },
        ],
      },
    ]
  },
  
  // Rota coringa (código HTTP === 404), não encontrou a slug? manda pra o login
  { path: '*', element: <Navigate to="/login" replace /> },
])
