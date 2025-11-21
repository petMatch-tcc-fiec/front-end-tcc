import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import EventoService from './services/EventoService';
import CardEvento from './components/CardEvento';
import { FaPlus, FaSearch, FaCalendarAlt } from 'react-icons/fa';
import useAuthStore from '../../shared/store/AuthStore';
import useUserStore from '../../shared/store/UserStore';

const EventosPage = () => {
  const navigate = useNavigate();
  
  // --- LÓGICA DE AUTH E STORE ---
  const isAuthenticated = useAuthStore((state) => !!state.token);
  const userTipo = useUserStore((state) => state.tipo);

  // --- ESTADOS ---
  const [masterEventos, setMasterEventos] = useState([]);
  const [filtroBusca, setFiltroBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregarEventos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await EventoService.getEventos();
      setMasterEventos(data);
    } catch (err) {
      setError("Falha ao carregar eventos. Tente novamente mais tarde.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarEventos();
  }, []);

  // --- FILTRO INTELIGENTE ---
  const eventosFiltrados = useMemo(() => {
    const busca = filtroBusca.toLowerCase();
    if (busca === "") return masterEventos;

    return masterEventos.filter(evento => {
      const nome = evento.nome?.toLowerCase() || "";
      const endereco = evento.endereco?.toLowerCase() || "";
      const descricao = evento.descricao?.toLowerCase() || "";
      return nome.includes(busca) || endereco.includes(busca) || descricao.includes(busca);
    });
  }, [masterEventos, filtroBusca]);

  // --- FUNÇÃO DE DELETAR (ESSENCIAL) ---
  const handleDeletar = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este evento permanentemente?")) {
      try {
        await EventoService.deletarEvento(id);
        // Atualiza a lista localmente para remover o item sem recarregar a tela
        setMasterEventos(prevEventos => prevEventos.filter(evento => evento.id !== id));
      } catch (err) {
        console.error("Erro ao excluir evento:", err);
        alert("Erro ao excluir evento. Tente novamente.");
      }
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-10"> 
      
      <div className="max-w-7xl mx-auto">
        {/* --- CABEÇALHO --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black text-gray-800 drop-shadow-sm flex items-center gap-3 justify-center md:justify-start">
              <FaCalendarAlt className="text-yellow-600" />
              Eventos
            </h1>
            <p className="text-gray-600 mt-2 text-lg font-medium">
              Confira as feiras de adoção e encontros
            </p>
          </div>

          {/* Botão de Novo Evento (Apenas para ONG) */}
          {isAuthenticated && userTipo === 'ONG' && (
            <button
              onClick={() => navigate('/eventos/novo')}
              className="group relative flex items-center gap-3 px-8 py-4 bg-gray-900 text-white font-bold rounded-full shadow-xl hover:bg-gray-800 hover:scale-105 transition-all duration-300"
            >
              <div className="bg-yellow-500 rounded-full p-1 group-hover:rotate-90 transition-transform">
                <FaPlus className="text-black text-sm" />
              </div>
              <span>Novo Evento</span>
            </button>
          )}
        </div>

        {/* --- BARRA DE BUSCA (Versão Compacta) --- */}
        <div className="relative max-w-lg mx-auto mb-10 transform -translate-y-2">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400 text-lg" />
          </div>
          <input
            type="text"
            value={filtroBusca}
            onChange={(e) => setFiltroBusca(e.target.value)}
            placeholder="Buscar por nome ou local..."
            className="block w-full pl-12 pr-4 py-3 text-base text-gray-900 bg-white rounded-full shadow-md border border-gray-100 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200/50 transition-all duration-300 placeholder-gray-400"
          />
        </div>

        {/* --- CONTEÚDO PRINCIPAL --- */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-yellow-600"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md mx-auto max-w-2xl text-center">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {eventosFiltrados.length === 0 ? (
              <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm max-w-2xl mx-auto">
                <div className="text-6xl mb-4">🐶</div>
                <p className="text-2xl font-bold text-gray-700 mb-2">Ops!</p>
                <p className="text-lg text-gray-500">
                  {masterEventos.length === 0 
                    ? "Ainda não temos eventos cadastrados." 
                    : "Nenhum evento encontrado com esse filtro."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {eventosFiltrados.map(evento => (
                  <CardEvento
                    key={evento.id}
                    evento={evento}
                    // AQUI ESTÁ A MÁGICA: Passando a função e a permissão
                    onDeletar={handleDeletar}
                    showControls={isAuthenticated && userTipo === 'ONG'}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EventosPage;