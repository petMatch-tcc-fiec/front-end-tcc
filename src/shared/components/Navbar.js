import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// --- Ícones Atualizados (Adicionado FaUserEdit) ---
import { 
  FaHome, FaPaw, FaStar, FaUserCircle, FaSignOutAlt, 
  FaCalendarAlt, // Ícone para Eventos
  FaBars,       // Ícone para Menu Hamburger
  FaTimes,      // Ícone para Fechar Menu
  FaUserEdit    // <--- ADICIONADO
} from "react-icons/fa";
import Logo from '../../features/splash/assets/Frame1.png';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // Dropdown do usuário
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // --- NOVO: Menu mobile ---
  const menuRef = useRef(null);
  
  const welcomeMessage = user?.nomeFantasiaOng || user?.nome || "Bem-vindo(a)";

  // --- Lógica para fechar o dropdown DO USUÁRIO ao clicar fora ---
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // --- ATUALIZADO: handleNavigate agora fecha os dois menus ---
  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false); // Fecha dropdown do usuário
    setIsMobileMenuOpen(false); // Fecha menu mobile
  };

  // --- ATUALIZADO: handleLogout agora fecha os dois menus ---
  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setIsMobileMenuOpen(false); // Fecha menu mobile
    navigate("/login"); 
  };

  // Função 'handleHomeClick' não precisa de alteração, pois já usa 'handleNavigate'
  const handleHomeClick = () => {
    if (isAuthenticated && user) {
      if (user.tipo === "ONG") {
        handleNavigate("/ong-home");
      } else {
        handleNavigate("/adotante-home");
      }
    } else {
      handleNavigate("/");
    }
  };

  // --- NOVO: Componente interno para evitar repetição de código dos links ---
  const NavLinks = () => (
    <>
      <li>
        <button 
          onClick={handleHomeClick} 
          className="flex items-center gap-2 text-gray-600 hover:text-yellow-500 transition"
        >
          <FaHome /> Início
        </button>
      </li>
      <li>
        <button 
          onClick={() => handleNavigate("/adotar")} 
          className="flex items-center gap-2 text-gray-600 hover:text-yellow-500 transition"
        >
          <FaPaw /> Adotar
        </button>
      </li>
      <li>
        <button 
          onClick={() => handleNavigate("/novidades")} 
          className="flex items-center gap-2 text-gray-600 hover:text-yellow-500 transition"
        >
          <FaStar /> Novidades
        </button>
      </li>

      {/* --- ✨✨ CORREÇÃO AQUI ✨✨ --- */}
      {/* Agora este botão só aparece se o usuário estiver autenticado,
        o objeto 'user' existir, E o 'user.tipo' for "ONG".
      */}
      {isAuthenticated && user && (
        <li>
          <button 
            onClick={() => handleNavigate("/eventos")} 
            className="flex items-center gap-2 text-gray-600 hover:text-yellow-500 transition"
          >
            <FaCalendarAlt /> Eventos
          </button>
        </li>
      )}
    </>
  );

  return (
    // --- ATUALIZADO: Altura ajustada para responsividade ---
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 md:h-20 flex items-center px-6">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-6 py-3 flex-wrap md:flex-nowrap">
        
        {/* Logo (sem alteração) */}
        <div onClick={() => handleNavigate("/")} className="cursor-pointer">
          <img src={Logo} alt="Logo PetMatch" className="h-14 max-w-[120px]" />
        </div>

        {/* === MENU DESKTOP ===
            (Escondido em mobile 'hidden', aparece em telas 'md' ou maiores) */}
        <div className="hidden md:flex items-center space-x-6">
          <ul className="flex items-center space-x-4">
            <NavLinks />
          </ul>
          
          {/* Dropdown do Usuário (Desktop) - (código original) */}
          <div className="relative" ref={menuRef}>
            <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center space-x-2 text-gray-700 hover:text-yellow-500">
              <FaUserCircle className="h-6 w-6" />
              <span>{welcomeMessage}</span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                {isAuthenticated ? (
                  <>
                    {/* --- ✨✨ BOTÃO DE PERFIL ADICIONADO (DESKTOP) ✨✨ --- */}
                    <button
                      onClick={() => handleNavigate("/editar-perfil")}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition"
                    >
                      <FaUserEdit className="text-yellow-500" /> Editar Perfil
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition"
                    >
                      <FaSignOutAlt className="text-red-500" /> Sair
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleNavigate("/login")} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Entrar</button>
                    <button onClick={() => handleNavigate("/tipo-cadastro")} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Cadastre-se</button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* === BOTÃO HAMBURGER (MOBILE) ===
            (Aparece em mobile, escondido 'md:hidden' em telas maiores) */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="text-gray-700 hover:text-yellow-500 focus:outline-none"
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* === MENU MOBILE DROPDOWN ===
            (Aparece abaixo se 'isMobileMenuOpen' for true, apenas em mobile) */}
        {isMobileMenuOpen && (
          <div className="md:hidden w-full mt-4 flex flex-col">
            {/* Links de Navegação Mobile */}
            <ul className="flex flex-col space-y-3">
              <NavLinks />
            </ul>
            
            <hr className="my-4" />
            
            {/* Links do Usuário Mobile */}
            <div className="flex flex-col space-y-3">
              {isAuthenticated ? (
                <>
                  <span className="flex items-center gap-2 text-gray-700 px-4 py-2">
                    <FaUserCircle className="h-6 w-6" /> {welcomeMessage}
                  </span>
                  {/* --- ✨✨ BOTÃO DE PERFIL ADICIONADO (MOBILE) ✨✨ --- */}
                  <button
                    onClick={() => handleNavigate("/editar-perfil")}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition"
                  >
                    <FaUserEdit className="text-yellow-500" /> Editar Perfil
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition"
                  >
                    <FaSignOutAlt className="text-red-500" /> Sair
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => handleNavigate("/login")} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Entrar</button>
                  <button onClick={() => handleNavigate("/tipo-cadastro")} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Cadastre-se</button>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;