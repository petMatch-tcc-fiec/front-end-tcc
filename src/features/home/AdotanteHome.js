import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaSearch, FaCalendarAlt } from 'react-icons/fa';

const AdotanteHome = () => {
  return (
    <div
      className="w-full flex flex-col items-center min-h-screen p-5 sm:p-10 text-[#333]"
      style={{
        background: "linear-gradient(to bottom, #FFEFA8, #FFF7D1)",
        backgroundImage:
          "url('https://cdn.pixabay.com/photo/2017/01/31/20/26/paw-print-2027703_1280.png')",
        backgroundSize: "200px",
        backgroundRepeat: "repeat",
      }}
    >
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-8 sm:p-10 w-full max-w-[900px] text-center my-10">

        <h1 className="text-4xl sm:text-5xl font-extrabold text-black mb-4 drop-shadow-md">
          Área do Adotante PetMatch
        </h1>

        <p className="text-lg text-gray-700 mb-10 max-w-2xl mx-auto">
          Bem-vindo(a)! Encontre seu novo melhor amigo e gerencie suas adoções.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* 1. Buscar Pets */}
          <Link
            to="/adotar"
            className="block p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 border border-gray-100 flex flex-col items-center text-center group"
          >
            <FaSearch className="text-5xl text-indigo-500 mb-3 group-hover:text-indigo-700" />
            <h2 className="text-xl font-bold text-gray-800 group-hover:text-black mb-1">
              Encontrar Pets
            </h2>
            <p className="text-gray-600 text-sm">Navegue por todos os animais disponíveis para adoção.</p>
          </Link>

          {/* 2. Meus Interesses (Editado conforme solicitado) */}
          <Link
            to="/meus-interesses"
            className="block p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 border border-gray-100 flex flex-col items-center text-center group"
          >
            <FaHeart className="text-5xl text-red-500 mb-3 group-hover:text-red-700" />
            <h2 className="text-xl font-bold text-gray-800 group-hover:text-black mb-1">
              Meus Interesses
            </h2>
            <p className="text-gray-600 text-sm">Visualize seus pedidos e acompanhe o status (Aprovado/Pendente).</p>
          </Link>

          {/* 3. Eventos (Antigo botão Meu Perfil) */}
          <Link
            to="/eventos"
            className="block p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 border border-gray-100 flex flex-col items-center text-center group"
          >
            <FaCalendarAlt className="text-5xl text-green-500 mb-3 group-hover:text-green-700" />
            <h2 className="text-xl font-bold text-gray-800 group-hover:text-black mb-1">
              Eventos
            </h2>
            <p className="text-gray-600 text-sm">Confira feiras de adoção, campanhas e encontros.</p>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default AdotanteHome;