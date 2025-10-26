import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from './shared/context/AuthContext';

import MainLayout from './shared/components/MainLayout';
import SplashScreen from './features/splash/SplashScreen';
import Home from './features/home/Home';
import OngHome from './features/home/OngHome';
import AdotanteHome from './features/home/AdotanteHome';
import LoginScreen from './features/splash/components/LoginScreen';
import TipoCadastro from './features/splash/components/TipoCadastro';
import AdotanteForm from './features/splash/components/AdotanteForm';
import OngForm from './features/splash/components/OngForm';
import AdotarScreen from './features/home/AdotarScreen';
import NovidadesScreen from './features/home/NovidadesScreen';
import StatusModal from './shared/components/StatusModal';
import { Toaster } from 'react-hot-toast';
import { requestForToken, onMessageListener } from './firebase';
import useAuthStore from './shared/store/AuthStore';

import PublicRoute from './shared/components/PublicRoute';
import PrivateRoute from './shared/components/PrivateRoute';

import './index.css';

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
    const unsubscribe = onMessageListener().then(() => {});
    return () => {};
  }, []);

  return (
    <div className="bg-[#FFF3C4] min-h-screen">
      <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com">
        <Router>
          <AuthProvider>
            <Routes>
              {/* Rota pública */}
              <Route element={<PublicRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/adotar" element={<AdotarScreen />} />
                  <Route path="/novidades" element={<NovidadesScreen />} />

                <Route path="/login" element={<SplashScreen><LoginScreen /></SplashScreen>} />
                <Route path="/tipo-cadastro" element={<SplashScreen><TipoCadastro /></SplashScreen>} />
                <Route path="/adotante-form" element={<SplashScreen><AdotanteForm /></SplashScreen>} />
                <Route path="/ong-form" element={<SplashScreen><OngForm /></SplashScreen>} />
              </Route>
                </Route>
              {/* Rotas privadas */}
              <Route element={<PrivateRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/ong-home" element={<OngHome />} />
                  <Route path="/adotante-home" element={<AdotanteHome />} />
                </Route>
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