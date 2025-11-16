import React, { useState, useEffect, useMemo } from 'react'; // <-- 1. Importei useMemo
import { useNavigate } from 'react-router-dom';
import EventoService from './services/EventoService';
import CardEvento from './components/CardEvento';
import { FaPlus, FaSearch } from 'react-icons/fa'; // <-- 2. Importei FaSearch
import { useAuth } from '../../shared/context/AuthContext';
// --- ⚠️ 1. IMPORTE O 'useAuth' ---
// (Seu arquivo já tinha, mas se o nome do arquivo for PetsPage.js, precisaria checar)
// Esta lógica de auth está correta e será mantida.
import useAuthStore from '../../shared/store/AuthStore';
import useUserStore from '../../shared/store/UserStore';


const EventosPage = () => {
  const navigate = useNavigate();
  // --- ⚠️ 2. PEGUE O USUÁRIO LOGADO (MUDANDO PARA ZUSTAND) ---
  const isAuthenticated = useAuthStore((state) => !!state.token);
  const userTipo = useUserStore((state) => state.tipo);

  // --- 3. ESTADOS PARA O FILTRO ---
  const [masterEventos, setMasterEventos] = useState([]); // Lista mestre
  const [filtroBusca, setFiltroBusca] = useState("");     // O texto da busca
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregarEventos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await EventoService.getEventos();
      setMasterEventos(data); // <-- 4. Salva na lista mestre
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

  // --- 5. A MÁGICA DO FILTRO (com useMemo) ---
  const eventosFiltrados = useMemo(() => {
    const busca = filtroBusca.toLowerCase();
    if (busca === "") {
      return masterEventos; // Retorna tudo se a busca for vazia
    }

    return masterEventos.filter(evento => {
      // Filtra por nome, endereço ou descrição
      const nome = evento.nome?.toLowerCase() || "";
      const endereco = evento.endereco?.toLowerCase() || "";
      const descricao = evento.descricao?.toLowerCase() || ""; // Graças à nossa correção anterior!

      return nome.includes(busca) || 
             endereco.includes(busca) || 
             descricao.includes(busca);
    });
  }, [masterEventos, filtroBusca]); // Recalcula se a lista mestre ou a busca mudarem

  const handleDeletar = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este evento?")) {
      try {
        await EventoService.deletarEvento(id);
        // --- 6. ATUALIZA A LISTA MESTRE ---
        setMasterEventos(masterEventos.filter(evento => evento.id !== id));
      } catch (err) {
        console.error("Erro ao excluir evento:", err);
      }
    }
  };

  return (
    <div className="p-8">
      {/* --- 7. CABEÇALHO E BOTÃO --- */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Eventos Cadastrados
        </h1>
        {isAuthenticated && userTipo === 'ONG' && (
          <button
            onClick={() => navigate('/eventos/novo')}
            className="flex items-center gap-2 px-5 py-3 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 transition-colors"
          >
            <FaPlus />
            Novo Evento
          </button>
        )}
      </div>

      {/* --- 8. BARRA DE BUSCA --- */}
      <div className="mb-10 relative">
        <input
          type="text"
          value={filtroBusca}
          onChange={(e) => setFiltroBusca(e.target.value)}
          placeholder="     Buscar por nome, endereço ou descrição..."
          className="w-full text-lg p-3 pl-10 rounded-lg border-2 border-gray-300 focus:border-yellow-500 focus:outline-none"
        />
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>

      {loading && <p className="text-center text-lg">Carregando eventos...</p>}
      {error && <p className="text-center text-lg text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          {/* --- 9. RENDERIZA A LISTA FILTRADA --- */}
          {eventosFiltrados.length === 0 ? (
            <p className="text-center text-lg text-gray-600">
              {/* Mensagem inteligente */}
              {masterEventos.length === 0 ? 
                "Nenhum evento cadastrado ainda." : 
                "Nenhum evento encontrado com esse filtro."}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {/* --- 10. USA A LISTA FILTRADA NO MAP --- */}
              {eventosFiltrados.map(evento => (
                <CardEvento
          _         key={evento.id}
                  evento={evento}
                  onDeletar={handleDeletar}
                  showControls={isAuthenticated && userTipo === 'ONG'}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EventosPage;