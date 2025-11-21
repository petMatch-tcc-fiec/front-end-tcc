import React from 'react';
import { Link } from "react-router-dom";
import { FaTrash, FaCalendarAlt, FaMapMarkerAlt, FaArrowRight, FaBuilding } from 'react-icons/fa';

const formatarData = (dataString) => {
  if (!dataString) return "Data indefinida";
  try {
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return "Data inválida";
  }
};

const CardEvento = ({ evento, onDeletar, showControls }) => {
  
  // Função para garantir que o clique na lixeira não abra o evento
  const handleDeleteClick = (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    onDeletar(evento.id);
  };

  // Proteção caso a ONG não venha preenchida
  const nomeOng = evento.ong ? evento.ong.nomeFantasiaOng : "Organizador não informado";

  return (
    <div className="relative h-full group">
      
      {/* --- ⚠️ BOTÃO DE LIXEIRA --- */}
      {showControls && (
        <button
          onClick={handleDeleteClick}
          className="absolute top-3 right-3 z-50 p-2.5 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 hover:scale-110 transition-all duration-200 border-2 border-white"
          title="Excluir este evento"
        >
          <FaTrash size={14} />
        </button>
      )}

      <Link to={`/eventos/${evento.id}`} className="block h-full no-underline">
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
          
          {/* Faixa decorativa no topo */}
          <div className="h-3 bg-gradient-to-r from-yellow-400 to-orange-400 w-full" />

          <div className="p-5 flex flex-col flex-1">
            {/* Título */}
            <h3 className="text-xl font-bold text-gray-800 mb-2 pr-8 group-hover:text-yellow-600 transition-colors line-clamp-2">
              {evento.nome}
            </h3>

            {/* Informações */}
            <div className="space-y-2 flex-1">
              
              {/* --- NOVA LINHA: ONG --- */}
              <div className="flex items-start text-gray-600 text-sm">
                <FaBuilding className="mt-1 mr-3 text-yellow-500 shrink-0" />
                <span className="capitalize font-medium">{nomeOng}</span>
              </div>

              <div className="flex items-start text-gray-600 text-sm">
                <FaCalendarAlt className="mt-1 mr-3 text-yellow-500 shrink-0" />
                <span className="capitalize font-medium">{formatarData(evento.dataHora)}</span>
              </div>

              <div className="flex items-start text-gray-600 text-sm">
                <FaMapMarkerAlt className="mt-1 mr-3 text-yellow-500 shrink-0" />
                <span className="capitalize font-medium">{evento.endereco}</span>
              </div>
            </div>

            {/* Rodapé "Ver detalhes" */}
            <div className="mt-6 pt-4 border-t border-gray-50 flex justify-end">
               <span className="text-xs font-bold text-yellow-600 uppercase tracking-wider flex items-center gap-1">
                 Ver detalhes <FaArrowRight size={10} />
               </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CardEvento;