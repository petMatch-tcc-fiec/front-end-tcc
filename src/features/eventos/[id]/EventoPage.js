import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EventoService from '../services/EventoService'; // Ajuste o caminho de volta (../)
import { FaCalendarAlt, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa';

// Peguei a função 'formatarData' do seu EventoList.js
const formatarData = (dataString) => {
  if (!dataString) return "Data indefinida";
  try {
    const data = new Date(dataString);
    // Formato mais completo para a página de detalhes
    return data.toLocaleString('pt-BR', {
      dateStyle: 'full',
      timeStyle: 'short'
    });
  } catch (error) {
    return "Data inválida";
  }
};


const EventoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evento, setEvento] = React.useState(null);

  React.useEffect(() => {
    // Busca o evento específico
    EventoService.getEventoById(id).then(data => {
      setEvento(data);
    }).catch(err => {
      console.error(err);
      // Se não encontrar, volta para a lista
      navigate('/eventos');
    });
  }, [id, navigate]);

  if (!evento) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-600">Carregando...</h2>
      </div>
    );
  }

  const dataFormatada = formatarData(evento.dataHora);

  return (
    // Estilo da página de detalhes do professor
    <div className="p-10 max-w-4xl mx-auto bg-white shadow-xl rounded-xl mt-10">
      <button 
        onClick={() => navigate('/eventos')} // Volta para a lista
        className="mb-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
      >
        <FaArrowLeft />
        Voltar para os Eventos
      </button>

      <div className="flex flex-col">
        {/* <img 
            src={evento.imagemUrl || 'https://via.placeholder.com/800x400'} 
            alt={evento.nome} 
            className="w-full h-64 object-cover rounded-lg shadow-md mb-6"
          /> */}
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {evento.nome}
        </h1>
        
        {/* --- MUDANÇA REALIZADA AQUI --- */}
        {/* Exibe a descrição dinamicamente, mas só se ela existir */}
        {evento.descricao && (
          <p className="text-xl text-gray-600 mb-6">
            {evento.descricao}
          </p>
        )}
        {/* --- FIM DA MUDANÇA --- */}

        <div className="flex items-center text-gray-900 mb-4 p-4 bg-gray-100 rounded-lg">
          <FaCalendarAlt className="mr-3 text-2xl text-indigo-600" />
          <span className="text-2xl font-bold">
            {dataFormatada}
          </span>
        </div>
        
        <div className="flex items-center text-gray-900 p-4 bg-gray-100 rounded-lg">
          <FaMapMarkerAlt className="mr-3 text-2xl text-indigo-600" />
          <span className="text-xl font-medium">
            {evento.endereco}
          </span>
        </div>
        
      </div>
    </div>
  );
};

export default EventoPage;