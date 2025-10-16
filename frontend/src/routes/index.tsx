// Essa função que está sendo importada é um contrutor do sistema de rotas baseado no histórico do navegador
import { createBrowserRouter } from "react-router-dom";
// Esse abaixo é o componente de proteção de rota, ele é uma camada que envolve páginas que só podem ser vistas
// se o usuário estiver logado (se no localStorage tiver token) se não tiver ele redireciona para o /login
import { RouteGuard } from "../components/RouteGuard";
// os três abaixo são os componentes de páginas (telas) do app.
// cada arquivo dentro de src/pages representa uma página visual.
// elas são as peças que o roteador vai mostrar dependendo da URL.
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Membros from "../pages/Membros";

// aqui criamos e expotamos o roteador para todo o app usar.
// O RouterProvider (em main.tsx) é quem receb esse (router) e faz a mágina acontecer
// basicamente o createBrowserRouter() recebe um array de objetos, com path(URL caminho) e 
// element: component que será renderizado nessa tela, e cada objeto descreve uma rota do sistema.
export const router = createBrowserRouter([
    {path: '/login', element: <Login />},
    // '/' é a porta principal, raiz do app, observe que está envolvo em <RouteGuard>...</RouteGuard> 
    // Esse routeguard manda para a função que recebe o Dashboard como parâmentro (children) e em seguida 
    // valida se tiver token → renderiza o filho, se não redireciona para o login
    {path: '/', element: <RouteGuard><Dashboard /></RouteGuard>},
    {path: '/membros', element: <RouteGuard><Membros /></RouteGuard>},
])
