import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from './shared/context/AuthContext';
import FilaAdocaoPage from './features/pet/adocao/FilaAdocaoPage';
import MainLayout from './shared/components/MainLayout';
import SplashScreen from './features/splash/SplashScreen';
import Home from './features/home/Home';
import OngHome from './features/home/OngHome';
import AdotanteHome from './features/home/AdotanteHome';
import LoginScreen from './features/splash/components/LoginScreen';
import TipoCadastro from './features/splash/components/TipoCadastro'; 
import AdotanteForm from './features/splash/components/AdotanteForm';
import OngForm from './features/splash/components/OngForm';
import NovidadesScreen from './features/home/NovidadesScreen';
import StatusModal from './shared/components/StatusModal';
import { Toaster } from 'react-hot-toast';
import { requestForToken, onMessageListener } from './firebase';
import useAuthStore from './shared/store/AuthStore';
import PublicRoute from './shared/components/PublicRoute';
import PrivateRoute from './shared/components/PrivateRoute';
import EventosPage from './features/eventos/EventosPage'; // A nova lista (Passo 3)
import EventoPage from './features/eventos/[id]/EventoPage'; // A nova pág. de detalhes (Passo 4)
import EventoForm from './features/eventos/components/EventoForm';
import AdminUploadScreen from './features/splash/components/AdminUploadScreen';
import PetsPage from './features/pet/PetsPage';
import PetForm from './features/pet/components/PetForm';
import PetPage from './features/pet/[id]/PetPage';
import EditarPerfilPage from './features/splash/components/EditarPerfilPage.js';
// ou: import EventoForm from './features/eventos/components/EventoForm';

import './index.css';
import AdminRoute from './shared/components/AdminRoute';
import MeusInteressesPage from './features/pet/adocao/MeusInteressesPage.js';

function App() {
  const [token, setToken] = React.useState(null);
  const { setFcmToken } = useAuthStore();

  React.useEffect(() => {
    requestForToken()
      .then((currentToken) => {
        setToken(currentToken);
        setFcmToken(currentToken);
      })
      .catch((err) => console.error("Erro ao solicitar token:", err));
  }, []);

  React.useEffect(() => {
    const unsubscribe = onMessageListener().then(() => { });
    return () => { };
  }, []);

  return (
    <div className="bg-[#FFF3C4] min-h-screen">
      <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com">
        <Router>
          <AuthProvider>
            <Routes>
              {/* GRUPO 1: ROTAS PÚBLICAS GERAIS */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/novidades" element={<SplashScreen><NovidadesScreen /></SplashScreen>} />
              </Route>

              {/* GRUPO 2: ROTAS DE "CONVIDADO" (Apenas para deslogados) */}
              <Route element={<PublicRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/login" element={<SplashScreen><LoginScreen /></SplashScreen>} />
                  <Route path="/tipo-cadastro" element={<SplashScreen><TipoCadastro /></SplashScreen>} />
                  <Route path="/adotante-form" element={<SplashScreen><AdotanteForm /></SplashScreen>} />
                  <Route path="/ong-form" element={<SplashScreen><OngForm /></SplashScreen>} />
                </Route>
              </Route>

              {/* GRUPO 3: ROTAS PRIVADAS (Apenas para logados) */}
              <Route element={<PrivateRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/ong-home" element={<SplashScreen><OngHome /></SplashScreen>} />
                  <Route path="/ong/fila-adocao" element={<SplashScreen><FilaAdocaoPage /></SplashScreen>} />                  
                                    
                  <Route path="/adotante-home" element={<SplashScreen><AdotanteHome /></SplashScreen>} />
                  <Route path="/editar-perfil" element={<EditarPerfilPage />} />
                  {/* ✨ 2. Nova Rota para Meus Interesses */}
                  <Route path="/meus-interesses" element={<SplashScreen><MeusInteressesPage /></SplashScreen>} />

                  {/* === 👇 ROTAS DE EVENTOS ATUALIZADAS 👇 === */}

                  {/* 1. A Lista (Substitui EventoList por EventosPage) */}
                  <Route path="/eventos" element={<SplashScreen><EventosPage /></SplashScreen>} />

                  {/* 2. O Formulário (Já estava correto) */}
                  <Route path="/eventos/novo" element={<SplashScreen><EventoForm /></SplashScreen>} />

                  {/* 3. A Página de Detalhes (A nova rota que faltava) */}
                  <Route path="/eventos/:id" element={<SplashScreen><EventoPage /></SplashScreen>} />
                  


                  {/* === 🐾 NOVA ROTA DE LISTA DE PETS 🐾 === */}
                  {/* Adicionada aqui para usar o MainLayout (Header/Footer) */}
                  <Route path="/adotar" element={<SplashScreen><PetsPage /></SplashScreen>} />

                  <Route path="/adotar/novo" element={<SplashScreen><PetForm /></SplashScreen>} />

                  <Route path="/adotar/:id" element={<SplashScreen><PetPage /></SplashScreen>} />

                  <Route path="/ong/fila-adocao" element={<FilaAdocaoPage />} />
                  
              </Route>
              </Route>
              
                  {/* --- (2) NOVO GRUPO DE ROTAS DE ADMIN --- */}
                  {/* Estas rotas SÓ funcionam se o usuário estiver logado
                      E o <AdminRoute> verificar que ele é 'ADMIN' */}
                    <Route element={<AdminRoute />}>
                    <Route path="/admin/upload" element={<AdminUploadScreen />} />
                    {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
                  </Route>
            </Routes>
          </AuthProvider>
        </Router>
        <Toaster />
        <StatusModal />
      </GoogleOAuthProvider>
    </div>
  );
}

export default App;