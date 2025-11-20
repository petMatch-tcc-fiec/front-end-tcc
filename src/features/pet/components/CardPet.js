import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { FaTrash, FaPaw, FaRulerVertical, FaBirthdayCake, FaHeart, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../../../shared/context/AuthContext';
import PetService from '../services/PetService'; // <-- Importa PetService]

const IMAGEM_PADRAO = "https://i.imgur.com/7b71Ymw.png"; 

const CardPet = ({ pet, onDeletar, showControls }) => {
  const { user } = useAuth();
  const isAdotante = user && user.tipo !== 'ONG';
  const [isMatched, setIsMatched] = useState(false);

  const fotos = pet.fotosAnimais;
  const imageUrl = (fotos && fotos.length > 0 && fotos[0].url) 
    ? fotos[0].url 
    : pet.imagemUrl || IMAGEM_PADRAO;

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation(); 
    onDeletar(pet.id);
  };

  const handleMatchClick = async (e) => {
    e.preventDefault();
    e.stopPropagation(); 

    if (isMatched) return;

    try {
      await PetService.registrarInteresse(pet.id);
      setIsMatched(true);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Erro ao registrar.";
      if (errorMsg.includes("Usuário já está na fila") || errorMsg.includes("já demonstrou interesse")) {
        setIsMatched(true); 
      } else {
        console.error(errorMsg);
      }
    }
  };

  return (
    <Link 
      to={`/adotar/${pet.id}`} 
      // 📏 TAMANHO MANTIDO: Card compacto (380x420)
      className="group w-full max-w-[380px] h-[420px] bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col mx-auto relative border border-gray-100"
    >
      
      {/* 🖼️ IMAGEM AUMENTADA: Voltei para h-64 (256px) para dar destaque total à foto */}
      <div className="relative h-64 w-full overflow-hidden bg-gray-100">
        <img 
          src={imageUrl} 
          alt={pet.nome} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* BOTÕES DE AÇÃO */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {showControls && (
            <button
              onClick={handleDeleteClick}
              className="p-2 bg-white/90 text-red-600 rounded-full hover:bg-red-600 hover:text-white shadow-md transition-all transform hover:scale-110 backdrop-blur-sm"
              title="Excluir Pet"
            >
              <FaTrash size={14} />
            </button>
          )}

          {isAdotante && (
            <button
              onClick={handleMatchClick}
              disabled={isMatched}
              className={`p-2 rounded-full shadow-md transition-all transform hover:scale-110 backdrop-blur-sm ${
                isMatched 
                  ? "bg-red-500 text-white cursor-not-allowed" 
                  : "bg-white/90 text-red-500 hover:bg-red-500 hover:text-white"
              }`}
              title={isMatched ? "Interesse Registrado" : "Dar Match"}
            >
              <FaHeart size={16} />
            </button>
          )}
        </div>
      </div>

      {/* 📝 CONTEÚDO COMPACTO: Ajustei padding e margens para caber no espaço restante */}
      <div className="p-3 flex flex-col flex-grow">
        
        <div className="mb-1.5">
          <h3 className="text-xl font-bold text-gray-800 truncate capitalize leading-tight mb-0.5">
            {pet.nome}
          </h3>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
            {pet.especie}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
             <FaPaw className="mr-1" /> {pet.raca || 'SRD'}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-purple-50 text-purple-700 border border-purple-100">
             <FaRulerVertical className="mr-1" /> {pet.porte}
          </span>
           <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-pink-50 text-pink-700 border border-pink-100">
             <FaBirthdayCake className="mr-1" /> {pet.idade} anos
          </span>
        </div>

        <div className="flex-grow"></div>

        <div className="mt-auto w-full py-2 bg-gray-50 rounded-lg text-indigo-600 font-bold text-sm text-center group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 flex items-center justify-center gap-2">
           Ver Detalhes <FaArrowRight size={12} />
        </div>

      </div>
    </Link>
  );
};

export default CardPet;