import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../shared/context/AuthContext';
import PetService from '../services/PetService';
import AdocaoService from './service/AdocaoService';
import { 
  FaPaw, FaUser, FaCheck, FaTimes, FaSpinner, FaChevronDown, FaChevronUp, 
  FaEnvelope, FaClipboardList
} from 'react-icons/fa';

// --- SUB-COMPONENTE: CARD DE ANIMAL E SUA FILA ---
const AnimalInteresses = ({ pet }) => {
  const [interessados, setInteressados] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

const formatarDataHora = (dataIso) => {
    if (!dataIso) return 'Data N/A';
    const dataObj = new Date(dataIso);
    const dia = dataObj.toLocaleDateString('pt-BR');
    const hora = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return `${dia} às ${hora}`;
  };


  const carregarInteressados = async () => {
    if (!pet.id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await AdocaoService.getInteressados(pet.id);
      setInteressados(data);
    } catch (err) {
      console.error("Erro ao carregar fila:", err);
      setError("Erro ao buscar fila.");
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

  // Imagem de capa ou placeholder
  const imagemPet = (pet.fotosAnimais && pet.fotosAnimais.length > 0) 
      ? pet.fotosAnimais[0].url 
      : (pet.imagemUrl || 'https://via.placeholder.com/150?text=Sem+Foto');

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden transition-all duration-300 hover:shadow-xl">
      
      {/* Faixa Decorativa Superior */}
      <div className="h-2 bg-gradient-to-r from-yellow-400 to-orange-500" />

      {/* HEADER DO CARD (Sempre visível) */}
      <div 
        className="p-6 cursor-pointer hover:bg-gray-50/50 transition-colors flex flex-col md:flex-row justify-between items-center gap-4"
        onClick={handleToggleExpand}
      >
        <div className="flex items-center gap-5 w-full md:w-auto">
          {/* Foto do Pet */}
          <div className="relative w-20 h-20 flex-shrink-0">
             <img 
               src={imagemPet} 
               alt={pet.nome} 
               className="w-full h-full object-cover rounded-xl shadow-sm border-2 border-white"
             />
             <div className="absolute -bottom-2 -right-2 bg-yellow-100 text-yellow-700 p-1.5 rounded-full text-xs border-2 border-white shadow-sm">
               <FaPaw />
             </div>
          </div>

          {/* Informações do Pet */}
          <div>
            <h3 className="text-2xl font-black text-gray-800 capitalize leading-none mb-1">
                {pet.nome}
            </h3>
            <div className="flex gap-2 text-sm font-medium text-gray-500">
                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{pet.especie}</span>
                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{pet.porte}</span>
            </div>
          </div>
        </div>

        {/* Botão de Expandir */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
           <span className="text-sm font-bold text-gray-400 uppercase tracking-wider md:hidden">
             {isExpanded ? "Fechar Fila" : "Ver Candidatos"}
           </span>
           
           <div className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
               isExpanded 
                 ? "bg-gray-900 text-white shadow-md" 
                 : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
           }`}>
               {isLoading ? (
                   <FaSpinner className="animate-spin" />
               ) : (
                   <>
                     <span>{isExpanded ? "Ocultar" : "Gerenciar Fila"}</span>
                     {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                   </>
               )}
           </div>
        </div>
      </div>

      {/* ÁREA EXPANDIDA (Lista de Interessados) */}
      {isExpanded && (
        <div className="bg-gray-50 border-t border-gray-100 p-4 md:p-8 animation-fade-in">
          
          {isLoading && (
              <div className="flex justify-center py-8 text-gray-400">
                  <FaSpinner className="animate-spin text-2xl" />
              </div>
          )}
          
          {filaVazia && !error && (
            <div className="text-center py-8 bg-white rounded-xl border border-gray-200 border-dashed">
                <div className="text-4xl mb-2">🍃</div>
                <p className="text-gray-500 font-medium">Ainda não há interessados na fila.</p>
            </div>
          )}
          
          {temFila && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">
                  Candidatos Pendentes ({interessados.length})
              </h4>
              
              {interessados.map(interesse => (
                <div 
                  key={interesse.interesseId} 
                  className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  {/* Dados do Usuário */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xl shadow-inner">
                       {interesse.nomeUsuario ? interesse.nomeUsuario.charAt(0).toUpperCase() : <FaUser />}
                    </div>
                    <div>
                       <p className="font-bold text-gray-800 text-lg leading-tight">
                         {interesse.nomeUsuario || "Usuário Desconhecido"}
                       </p>
                       <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
                           <a href={`mailto:${interesse.emailUsuario}`} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-yellow-600 transition-colors">
                              <FaEnvelope className="text-gray-300" />
                              {interesse.emailUsuario || "Email não disponível"}
                           </a>
                           <span className="hidden sm:block text-gray-300">•</span>
<span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
   {formatarDataHora(interesse.dataDeInteresse)}
</span>
                       </div>
                    </div>
                  </div>

                  {/* Botões de Ação */}
                  <div className="flex gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-50">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAvaliar(interesse.interesseId, 'REJEITADO'); }}
                      className="flex-1 lg:flex-none px-4 py-2.5 rounded-lg font-bold text-sm border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all flex items-center justify-center gap-2"
                    >
                      <FaTimes /> Rejeitar
                    </button>
                    
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAvaliar(interesse.interesseId, 'APROVADO'); }}
                      className="flex-1 lg:flex-none px-6 py-2.5 rounded-lg font-bold text-sm bg-green-500 text-white shadow-md hover:bg-green-600 hover:shadow-lg transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                    >
                      <FaCheck /> Aprovar Adoção
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- PÁGINA PRINCIPAL ---
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
        setError("Falha ao carregar seus animais. Tente recarregar a página.");
      } finally {
        setLoading(false);
      }
    };
    carregarMeusPets();
  }, [user]);

  return (
    <div className="min-h-screen p-6 md:p-10 bg-transparent"> 
      
      <div className="max-w-5xl mx-auto">
        
        {/* --- CABEÇALHO ESTILIZADO --- */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black text-gray-800 drop-shadow-sm flex items-center gap-3 justify-center md:justify-start">
             <FaClipboardList className="text-yellow-600" />
             Gestão de Adoções
          </h1>
          <p className="text-gray-600 mt-3 text-lg font-medium max-w-2xl">
            Visualize as filas de interesse e aprove os candidatos ideais para seus animais.
          </p>
        </div>

        {/* --- CONTEÚDO PRINCIPAL --- */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-r-xl shadow-sm mb-8">
            <p className="font-bold">Ops, algo deu errado.</p>
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-yellow-500"></div>
          </div>
        ) : (
          <>
            {meusPets.length === 0 ? (
               // Estado Vazio Estilizado
               <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl shadow-sm max-w-2xl mx-auto border border-white">
                 <div className="text-7xl mb-6 opacity-80">🐶</div>
                 <h2 className="text-3xl font-bold text-gray-800 mb-3">Nenhum animal cadastrado</h2>
                 <p className="text-lg text-gray-500 mb-8">
                   Parece que você ainda não cadastrou nenhum pet para adoção.
                 </p>
               </div>
            ) : (
               // Lista de Cards
               <div className="space-y-6">
                 {meusPets.map(pet => (
                   <AnimalInteresses key={pet.id} pet={pet} />
                 ))}
               </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FilaAdocaoPage;