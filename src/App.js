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
import useUserStore from './shared/store/UserStore'; // Adicionado para ler o tipo
import PublicRoute from './shared/components/PublicRoute';
import PrivateRoute from './shared/components/PrivateRoute';
import EventosPage from './features/eventos/EventosPage';
import EventoPage from './features/eventos/[id]/EventoPage';
import EventoForm from './features/eventos/components/EventoForm';
import AdminUploadScreen from './features/splash/components/AdminUploadScreen';
import PetsPage from './features/pet/PetsPage';
import PetForm from './features/pet/components/PetForm';
import PetPage from './features/pet/[id]/PetPage';
import AdminRoute from './shared/components/AdminRoute';
import MeusInteressesPage from './features/pet/adocao/MeusInteressesPage.js';

import './index.css';
import TermosLegais from './shared/components/TermosLegais.js';

// --- COMPONENTE CONTROLADOR DE ROTA INTELIGENTE ---
const RotaNovidades = () => {
  const userTipo = useUserStore((state) => state.tipo);

  // 1. Se for ONG -> Vai para a Gestão de Adoções (Fila)
  if (userTipo === 'ONG') {
    return <SplashScreen><FilaAdocaoPage /></SplashScreen>;
  }
  
  // 2. Se for Usuário Logado (Adotante) -> Vai para Meus Interesses
  if (userTipo && userTipo !== 'ONG') {
    return <SplashScreen><MeusInteressesPage /></SplashScreen>;
  }

  // 3. Se não estiver logado ou não tiver tipo definido -> Vai para a tela genérica de Novidades
  return <SplashScreen><LoginScreen /></SplashScreen>;
};

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
                
                {/* ✨ ROTA NOVIDADES INTELIGENTE ✨ */}
                <Route path="/novidades" element={<RotaNovidades />} />
              </Route>

              {/* GRUPO 2: ROTAS DE "CONVIDADO" (Apenas para deslogados) */}
              <Route element={<PublicRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/login" element={<SplashScreen><LoginScreen /></SplashScreen>} />
                  <Route path="/tipo-cadastro" element={<SplashScreen><TipoCadastro /></SplashScreen>} />
                  <Route path="/adotante-form" element={<SplashScreen><AdotanteForm /></SplashScreen>} />
                  <Route path="/ong-form" element={<SplashScreen><OngForm /></SplashScreen>} />
                  <Route path="/termos" element={<SplashScreen><TermosLegais /></SplashScreen>} />
                </Route>
              </Route>

              {/* GRUPO 3: ROTAS PRIVADAS (Apenas para logados) */}
              <Route element={<PrivateRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/ong-home" element={<SplashScreen><OngHome /></SplashScreen>} />
                  
                  {/* Rota explícita para ONG acessar a fila se quiser usar link direto */}
                  <Route path="/ong/fila-adocao" element={<SplashScreen><FilaAdocaoPage /></SplashScreen>} />                  
                                      
                  <Route path="/adotante-home" element={<SplashScreen><AdotanteHome /></SplashScreen>} />
                  
                  {/* Rota explícita para Adotante acessar interesses direto */}
                  <Route path="/meus-interesses" element={<SplashScreen><MeusInteressesPage /></SplashScreen>} />

                  {/* === EVENTOS === */}
                  <Route path="/eventos" element={<SplashScreen><EventosPage /></SplashScreen>} />
                  <Route path="/eventos/novo" element={<SplashScreen><EventoForm /></SplashScreen>} />
                  <Route path="/eventos/:id" element={<SplashScreen><EventoPage /></SplashScreen>} />
                  
                  {/* === PETS === */}
                  <Route path="/adotar" element={<SplashScreen><PetsPage /></SplashScreen>} />
                  <Route path="/adotar/novo" element={<SplashScreen><PetForm /></SplashScreen>} />
                  <Route path="/adotar/:id" element={<SplashScreen><PetPage /></SplashScreen>} />
                  
                </Route>
              </Route>
              
              {/* GRUPO 4: ADMIN */}
              <Route element={<AdminRoute />}>
                <Route path="/admin/upload" element={<AdminUploadScreen />} />
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