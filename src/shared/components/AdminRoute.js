import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// --- AQUI ESTÁ A CORREÇÃO ---
// Importamos o UserStore, que é onde o 'tipo' (ADMIN, ONG) está salvo.
import useUserStore from '../store/UserStore';

/**
 * Este componente "porteiro" protege rotas de Admin.
 * Ele já assume que o usuário está logado (pois deve ser usado dentro de uma Rota Privada).
 *
 * Ele apenas verifica se o 'tipo' do usuário no useUserStore é 'ADMIN'.
 */
const AdminRoute = () => {
  // Pegamos o 'tipo' diretamente do UserStore.
  const tipo = useUserStore((state) => state.tipo);

  // Verificamos se é Admin
  const isAdmin = tipo === 'ADMIN';

  // Se for admin, mostre a página de admin (o <Outlet />)
  if (isAdmin) {
    return <Outlet />; // Renderiza o <AdminUploadScreen />
  }

  // Se NÃO for admin, mande-o para a "home" dele.
  // (Não mandamos para /login, pois ele JÁ está logado)
  const homePath = tipo === 'ONG' ? '/ong-home' : '/adotante-home';

  // O 'replace' impede que ele use o botão "voltar" do navegador
  // Se o 'tipo' for null por algum motivo, redireciona para a home pública
  return <Navigate to={homePath || '/'} replace />;
};

export default AdminRoute;