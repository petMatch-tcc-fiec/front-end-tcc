import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EventoService from '../services/EventoService'; 
import { FaCalendarAlt, FaMapMarkerAlt, FaArrowLeft, FaBuilding } from 'react-icons/fa';

const formatarData = (dataString) => {
  if (!dataString) return "Data indefinida";
  try {
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return "Data inválida";
  }
};

const EventoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evento, setEvento] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    EventoService.getEventoById(id).then(data => {
      setEvento(data);
    }).catch(err => {
      console.error(err);
      navigate('/eventos');
    }).finally(() => {
        setLoading(false);
    });
  }, [id, navigate]);

  if (loading || !evento) {
    return (
      <div className="min-h-[50vh] flex justify-center items-center">
         <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-yellow-500"></div>
      </div>
    );
  }

  const dataFormatada = formatarData(evento.dataHora);
  const nomeOng = evento.ong ? evento.ong.nomeFantasiaOng : "Organização não informada";

  return (
    // Wrapper externo com margem para não colar no topo/fundo
    <div className="p-4 md:p-8 max-w-5xl mx-auto mt-6 mb-12">
      
      {/* --- Botão Voltar --- */}
      <button 
        onClick={() => navigate('/eventos')} 
        className="group mb-6 flex items-center text-gray-600 hover:text-yellow-600 transition-colors font-medium"
      >
        <div className="p-2 rounded-full bg-white shadow-sm mr-3 group-hover:shadow-md transition-all group-hover:-translate-x-1">
            <FaArrowLeft size={14} />
        </div>
        Voltar para lista
      </button>

      {/* --- Card Principal --- */}
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden relative animate-fade-in-up">
        
        {/* Faixa decorativa no topo */}
        <div className="h-4 bg-gradient-to-r from-yellow-400 to-orange-500 w-full" />

        <div className="p-8 md:p-12">
          
          {/* Título */}
          <h1 className="text-4xl md:text-5xl font-black text-gray-800 mb-6 leading-tight">
            {evento.nome}
          </h1>
          
          {/* Descrição */}
          {evento.descricao && (
            <div className="prose prose-lg max-w-none text-gray-600 mb-10 leading-relaxed">
              {evento.descricao}
            </div>
          )}

          {/* --- GRID DE INFORMAÇÕES --- */}
          {/* Alterei para lg:grid-cols-3 para caber a ONG, Data e Local lado a lado em telas grandes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. Card ONG Responsável (Novo) */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 flex items-start transition-transform hover:scale-[1.01]">
              <div className="bg-white p-3 rounded-full shadow-sm text-blue-600 mr-4 shrink-0">
                <FaBuilding size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">Organizado por</p>
                <p className="text-lg font-bold text-gray-800 leading-tight">
                  {nomeOng}
                </p>
              </div>
            </div>

            {/* 2. Card Data */}
            <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-100 flex items-start transition-transform hover:scale-[1.01]">
              <div className="bg-white p-3 rounded-full shadow-sm text-yellow-600 mr-4 shrink-0">
                <FaCalendarAlt size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-yellow-600 uppercase tracking-wider mb-1">Data e Horário</p>
                <p className="text-lg font-bold text-gray-800 capitalize leading-tight">
                  {dataFormatada}
                </p>
              </div>
            </div>

            {/* 3. Card Localização */}
            <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100 flex items-start transition-transform hover:scale-[1.01] md:col-span-2 lg:col-span-1">
              <div className="bg-white p-3 rounded-full shadow-sm text-orange-500 mr-4 shrink-0">
                <FaMapMarkerAlt size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-1">Localização</p>
                <p className="text-lg font-bold text-gray-800 leading-tight">
                  {evento.endereco}
                </p>
                <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(evento.endereco)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-orange-600 hover:text-orange-800 underline mt-1 block"
                >
                    Ver no mapa
                </a>
              </div>
            </div>

          </div>
          
        </div>
      </div>
    </div>
  );
};

export default EventoPage;