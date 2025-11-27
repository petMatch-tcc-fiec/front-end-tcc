import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaHome, FaPaw, FaStar, FaUserCircle, FaSignOutAlt, 
  FaCalendarAlt, FaBars, FaTimes, FaUserEdit 
} from "react-icons/fa";
import Logo from '../../features/splash/assets/Frame1.png';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [menuOpen, setMenuOpen] = useState(false); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  
  const menuRef = useRef(null);         // Ref para dropdown Desktop
  const mobileMenuRef = useRef(null);   // Ref para o container do menu Mobile
  const hamburgerRef = useRef(null);    // Ref para o botão Hamburger
  
  const welcomeMessage = user?.nomeFantasiaOng || user?.nome || "Bem-vindo(a)";

  // --- Lógica Atualizada para fechar AMBOS os menus ao clicar fora ---
  useEffect(() => {
    function handleClickOutside(event) {
      // 1. Lógica para Desktop (já existia)
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }

      // 2. Lógica para Mobile
      if (isMobileMenuOpen && 
          mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target) &&
          hamburgerRef.current &&
          !hamburgerRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    }

    // Adiciona o listener se QUALQUER um dos menus estiver aberto
    if (menuOpen || isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen, isMobileMenuOpen]); 

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false); 
    setIsMobileMenuOpen(false); 
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setIsMobileMenuOpen(false); 
    navigate("/login"); 
  };

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
      {isAuthenticated && user && user.tipo === "ONG" && (
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
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 md:h-20 flex items-center px-6">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-6 py-3 flex-wrap md:flex-nowrap">
        
        {/* Logo */}
        <div onClick={() => handleNavigate("/")} className="cursor-pointer hover:scale-105">
          <img src={Logo} alt="Logo PetMatch" className="h-14 max-w-[120px]" />
        </div>

        {/* === MENU DESKTOP === */}
        <div className="hidden md:flex items-center space-x-6">
          <ul className="flex items-center space-x-4">
            <NavLinks />
          </ul>
          
          <div className="relative" ref={menuRef}>
            <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center space-x-2 text-gray-700 hover:text-yellow-500">
              <FaUserCircle className="h-6 w-6" />
              <span>{welcomeMessage}</span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                {isAuthenticated ? (
                  <>
                    
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

        {/* === BOTÃO HAMBURGER (MOBILE) === */}
        <div className="md:hidden flex items-center">
          <button 
            ref={hamburgerRef} 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="text-gray-700 hover:text-yellow-500 focus:outline-none"
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* === MENU MOBILE DROPDOWN (ANIMADO) === */}
        <div 
          ref={mobileMenuRef} 
          className={`md:hidden w-full flex flex-col bg-white rounded-b-lg overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen 
              ? "max-h-[500px] opacity-100 mt-4 p-4 shadow-inner"  // Aberto
              : "max-h-0 opacity-0 mt-0 p-0 shadow-none"           // Fechado
          }`}
        >
          <ul className="flex flex-col space-y-3">
            <NavLinks />
          </ul>
          
          <hr className="my-4" />
          
          <div className="flex flex-col space-y-3">
            {isAuthenticated ? (
              <>
                <span className="flex items-center gap-2 text-gray-700 px-4 py-2">
                  <FaUserCircle className="h-6 w-6" /> {welcomeMessage}
                </span>

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

      </div>
    </nav>
  );
};

export default Navbar;