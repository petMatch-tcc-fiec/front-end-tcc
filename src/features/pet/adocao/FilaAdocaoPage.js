import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../shared/context/AuthContext';
import PetService from '../services/PetService';
import AdocaoService from './service/AdocaoService';
import { 
  FaPaw, FaUser, FaCheck, FaTimes, FaSpinner, FaChevronDown, FaChevronUp, 
  FaEnvelope, FaCalendarAlt 
} from 'react-icons/fa';

const AnimalInteresses = ({ pet }) => {
  const [interessados, setInteressados] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const carregarInteressados = async () => {
    if (!pet.id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await AdocaoService.getInteressados(pet.id);
      setInteressados(data);
    } catch (err) {
      console.error("Erro ao carregar fila:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleExpand = () => {
    const expand = !isExpanded;
    setIsExpanded(expand);
    if (expand) {
      carregarInteressados();
    }
  };

  const handleAvaliar = async (interesseId, novoStatus) => {
    const acao = novoStatus === 'APROVADO' ? 'aprovar' : 'rejeitar';
    if (!window.confirm(`Tem certeza que deseja ${acao} este candidato?`)) {
      return;
    }
    try {
      await AdocaoService.avaliarInteresse(interesseId, novoStatus);
      setInteressados(prev => prev.filter(i => i.interesseId !== interesseId));
    } catch (err) {
      alert(`Erro ao ${acao} candidato. Tente novamente.`);
    }
  };

  const filaVazia = interessados.length === 0 && !isLoading;
  const temFila = interessados.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 border border-gray-100">
      {/* Header do Card */}
      <div 
        className="flex justify-between items-center p-5 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={handleToggleExpand}
      >
        <div className="flex items-center gap-4">
          <img 
            src={pet.fotosAnimais && pet.fotosAnimais.length > 0 
              ? pet.fotosAnimais[0].url 
              : (pet.imagemUrl || 'https://via.placeholder.com/100')} 
            alt={pet.nome} 
            className="w-16 h-16 object-cover rounded-full border-2 border-gray-200"
          />
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{pet.nome}</h3>
            <p className="text-gray-600 text-sm">{pet.especie} • {pet.porte}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <span className={`text-sm font-medium px-3 py-1 rounded-full ${isExpanded ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
             {isExpanded ? "Ocultar Fila" : "Ver Fila"}
           </span>
           {isLoading ? <FaSpinner className="animate-spin text-indigo-500" /> : (isExpanded ? <FaChevronUp /> : <FaChevronDown />)}
        </div>
      </div>

      {/* Lista de Interessados */}
      {isExpanded && (
        <div className="p-5 border-t border-gray-200 bg-gray-50">
          {isLoading && <p className="text-center text-gray-500 py-4">Buscando candidatos...</p>}
          
          {filaVazia && !error && (
            <div className="text-center py-4 text-gray-500 italic">Nenhum interessado na fila deste animal ainda.</div>
          )}
          
          {temFila && (
            <ul className="space-y-3">
              {interessados.map(interesse => (
                <li 
                  key={interesse.interesseId} 
                  className="flex flex-col lg:flex-row lg:items-center justify-between p-5 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  {/* Dados do Adotante */}
                  <div className="flex items-center gap-4 w-full">
                    
                    {/* Avatar com Inicial */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl border border-indigo-200">
                       {interesse.nomeUsuario ? interesse.nomeUsuario.charAt(0).toUpperCase() : <FaUser />}
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                        <p className="font-bold text-gray-900 text-lg leading-tight truncate">
                          {interesse.nomeUsuario || "Usuário Desconhecido"}
                        </p>
                        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide whitespace-nowrap">
                           {interesse.dataDeInteresse ? new Date(interesse.dataDeInteresse).toLocaleDateString('pt-BR') : '-'}
                        </span>
                      </div>

                      {/* Email */}
                      <div className="flex items-center gap-2 mt-1 text-gray-600 text-sm truncate">
                        <FaEnvelope className="text-gray-400 flex-shrink-0" />
                        <a href={`mailto:${interesse.emailUsuario}`} className="hover:text-indigo-600 hover:underline transition-colors truncate">
                          {interesse.emailUsuario || "Email não disponível"}
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  {/* Botões de Ação */}
                  <div className="flex gap-3 justify-end w-full lg:w-auto mt-4 lg:mt-0 lg:ml-6 flex-shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAvaliar(interesse.interesseId, 'REJEITADO'); }}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 text-sm font-bold rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <FaTimes /> Rejeitar
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAvaliar(interesse.interesseId, 'APROVADO'); }}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-green-700 transition-colors"
                    >
                      <FaCheck /> Aprovar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

const FilaAdocaoPage = () => {
  const { user } = useAuth();
  const [meusPets, setMeusPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user.id) {
      setLoading(false);
      return;
    }
    const carregarMeusPets = async () => {
      try {
        const todosPets = await PetService.getPets();
        if (Array.isArray(todosPets)) {
            setMeusPets(todosPets);
        } else {
            setMeusPets([]);
        }
      } catch (err) {
        console.error("Erro ao buscar pets:", err);
        setError("Falha ao carregar seus animais.");
      } finally {
        setLoading(false);
      }
    };
    carregarMeusPets();
  }, [user]);

  if (loading) return <div className="flex justify-center items-center h-64"><FaSpinner className="animate-spin text-3xl text-indigo-600" /></div>;
  
  return (
    <div className="container mx-auto mt-8 p-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Gestão de Adoções</h1>
        <p className="text-gray-600 mb-8">
          Visualize os interessados e entre em contato via E-mail.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">
            {error}
          </div>
        )}

        {!loading && meusPets.length === 0 && (
          <div className="text-center bg-white p-12 rounded-xl shadow-sm border border-gray-200">
            <FaPaw className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Nenhum animal encontrado</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Parece que você ainda não cadastrou animais.
            </p>
            <button onClick={() => window.location.reload()} className="text-indigo-600 font-semibold hover:underline">
               Atualizar Página
            </button>
          </div>
        )}

        <div className="space-y-4">
          {meusPets.map(pet => (
            <AnimalInteresses key={pet.id} pet={pet} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilaAdocaoPage;