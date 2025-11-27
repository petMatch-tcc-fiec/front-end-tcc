import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { FaTrash, FaPaw, FaRulerVertical, FaBirthdayCake, FaArrowRight, FaCheck } from 'react-icons/fa';
import { useAuth } from '../../../shared/context/AuthContext';
import PetService from '../services/PetService'; 

const IMAGEM_PADRAO = "https://i.imgur.com/7b71Ymw.png"; 

const CardPet = ({ pet, onDeletar, showControls }) => {
  const { user } = useAuth(); 
  const isAdotante = user && user.tipo !== 'ONG';

  // Removido estado isMatched pois o botão foi retirado
  const [statusAtual, setStatusAtual] = useState(pet.status || "DISPONIVEL");

  const fotos = pet.fotosAnimais;
  const imageUrl = (fotos && fotos.length > 0 && fotos[0].url) 
    ? fotos[0].url 
    : pet.imagemUrl || IMAGEM_PADRAO;

  // --- AÇÕES ---
  const handleMarcarAdotado = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (window.confirm(`Confirmar que ${pet.nome} foi adotado?`)) {
      try {
        await PetService.atualizarStatus(pet.id, "ADOTADO");
        setStatusAtual("ADOTADO");
      } catch (err) {
        console.error(err);
        alert("Erro ao atualizar status.");
      }
    }
  };

  const handleDeleteClick = (e) => {
    e.preventDefault(); e.stopPropagation(); 
    onDeletar(pet.id);
  };

  // Removida a função handleMatchClick pois o botão foi retirado

  if (isAdotante && statusAtual === 'ADOTADO') return null;

  return (
    <div className="relative h-full group">
      
      {/* --- BOTÃO DE LIXEIRA --- */}
      {showControls && (
        <button
          onClick={handleDeleteClick}
          className="absolute top-2 right-2 z-50 p-2 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 hover:scale-105 transition-all duration-200 border-2 border-white"
          title="Excluir Pet"
        >
          <FaTrash size={12} />
        </button>
      )}

      <Link 
        to={`/adotar/${pet.id}`} 
        className={`block h-full bg-white rounded-xl no-underline shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 transform hover:-translate-y-1 flex flex-col ${statusAtual === 'ADOTADO' ? 'opacity-80 grayscale-[0.5]' : ''}`}
      >
        
        {/* Faixa decorativa */}
        <div className="h-2 bg-gradient-to-r from-yellow-400 to-orange-400 w-full shrink-0" />

        {/* Imagem (Altura Reduzida para h-48) */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-100 shrink-0">
          <img 
            src={imageUrl} 
            alt={pet.nome} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

          {/* Tarja Adotado */}
          {statusAtual === 'ADOTADO' && (
             <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
               <span className="text-white font-bold text-lg border-2 border-white px-3 py-1 rounded -rotate-12 shadow-lg">
                 JÁ ADOTADO
               </span>
             </div>
          )}

          {/* Botões Internos */}
          <div className="absolute bottom-2 right-2 flex gap-2 z-20">
            {showControls && statusAtual !== 'ADOTADO' && (
               <button
                 onClick={handleMarcarAdotado}
                 className="p-1.5 bg-white text-green-600 rounded-full hover:bg-green-500 hover:text-white shadow-sm transition-all"
                 title="Marcar como Adotado"
               >
                 <FaCheck size={12} />
               </button>
            )}
            
            {/* O BOTÃO DE MATCH (CORAÇÃO) FOI REMOVIDO AQUI */}
          </div>
        </div>

        {/* Conteúdo (Padding Reduzido para p-4) */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg font-bold text-gray-800 truncate capitalize leading-tight pr-2">
              {pet.nome}
            </h3>
            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded uppercase tracking-wide shrink-0">
               {pet.especie}
            </span>
          </div>

          {/* Tags (Margin Reduzida para mb-3) */}
          <div className="flex flex-wrap gap-1.5 mb-3">
             <span className="flex items-center text-[11px] font-medium text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                <FaPaw className="mr-1 text-yellow-500" /> {pet.raca || 'SRD'}
             </span>
             <span className="flex items-center text-[11px] font-medium text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                <FaRulerVertical className="mr-1 text-yellow-500" /> {pet.porte}
             </span>
             <span className="flex items-center text-[11px] font-medium text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                <FaBirthdayCake className="mr-1 text-yellow-500" /> {pet.idade}a
             </span>
          </div>

          {/* Empurra o rodapé para baixo */}
          <div className="flex-grow"></div>

          {/* Rodapé Compacto */}
          <div className="mt-2 pt-2 border-t border-gray-50 flex justify-end">
             <span className="text-[11px] font-bold text-yellow-600 uppercase tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">
               {statusAtual === 'ADOTADO' ? "Ver ficha" : "Conhecer"} <FaArrowRight size={9} />
             </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CardPet;