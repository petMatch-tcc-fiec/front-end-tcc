import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Importei o Link aqui
import AdocaoService from './service/AdocaoService';
import PetService from '../services/PetService';

import { 
  FaPaw, FaClock, FaCheckCircle, FaTimesCircle, 
  FaArrowLeft, FaHeart, FaDog, FaCalendarAlt, FaSearch, FaArrowRight
} from 'react-icons/fa';

const IMAGEM_PADRAO = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=500";

const MeusInteressesPage = () => {
  const navigate = useNavigate();
  const [interesses, setInteresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const carregarMeusInteresses = async () => {
      try {
        const listaInicial = await AdocaoService.getMeusInteresses();

        const listaCompleta = await Promise.all(listaInicial.map(async (interesse) => {
          try {
            const animalId = interesse.animal?.id;
            if (!animalId) return interesse;
            const animalCompleto = await PetService.getById(animalId); 
            return { ...interesse, animal: animalCompleto };
          } catch (err) {
            return interesse; 
          }
        }));

        setInteresses(listaCompleta);
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar seus pedidos de adoção.");
      } finally {
        setLoading(false);
      }
    };

    carregarMeusInteresses();
  }, []);

  const handleImageError = (e) => {
    e.target.src = IMAGEM_PADRAO;
    e.target.onerror = null;
  };

  const formatarDataHora = (dataIso) => {
    if (!dataIso) return '-';
    const dataObj = new Date(dataIso);
    const dia = dataObj.toLocaleDateString('pt-BR');
    const hora = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return `${dia} às ${hora}`;
  };

  const renderStatus = (status) => {
    switch (status) {
      case 'APROVADO':
        return (
          <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-3 flex gap-3 items-center">
            <div className="bg-green-100 p-2 rounded-full text-green-600"><FaCheckCircle /></div>
            <div>
            <p className="text-sm text-green-700 leading-snug mt-1">
              <span className="font-bold block mb-1">🎉 Parabéns! Perfil Aprovado.</span>
                <span className="text-green-600">Fique atento, a ONG entrará em contato em breve.</span>
            </p>            
            </div>
          </div>
        );
      case 'REJEITADO':
        return (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-3 flex gap-3 items-center">
            <div className="bg-red-100 p-2 rounded-full text-red-600"><FaTimesCircle /></div>
            <div>
              <p className="text-sm font-bold text-red-800">Não Aprovado</p>
              <p className="text-xs text-red-700 leading-tight">Pedido encerrado.</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex gap-3 items-center">
            <div className="bg-yellow-100 p-2 rounded-full text-yellow-600"><FaClock /></div>
            <div>
              <p className="text-sm font-bold text-yellow-800">Em Análise</p>
              <p className="text-xs text-yellow-700 leading-tight">Aguarde o retorno.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-10 font-sans">
       <div className="max-w-5xl mx-auto">
        
        {/* --- CABEÇALHO --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div className="text-center md:text-left w-full md:w-auto">
            <button
                onClick={() => navigate('/home')}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-2 text-sm font-bold uppercase tracking-wide cursor-pointer"
            >
                <FaArrowLeft /> Voltar ao Início
            </button>

            <h1 className="text-4xl md:text-5xl font-black text-gray-800 drop-shadow-sm flex items-center gap-3">
              <FaHeart className="text-red-500" />
              Meus Pedidos
            </h1>
            <p className="text-gray-600 mt-2 text-lg font-medium">
              Acompanhe o status das suas solicitações.
            </p>
          </div>

          {/* --- CONTADOR (Glassmorphism) --- */}
          {!loading && interesses.length > 0 && (
            <div className="bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl px-6 py-3 shadow-sm flex flex-col items-center md:items-end min-w-[140px]">
                <span className="text-4xl font-black text-yellow-500 drop-shadow-sm">{interesses.length}</span>
                <span className="text-gray-600 font-bold text-xs uppercase tracking-wider">Solicitações Ativas</span>
            </div>
          )}
        </div>

        {/* --- CONTEÚDO --- */}
        {loading && (
           <div className="flex justify-center items-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-yellow-500"></div>
           </div>
        )}

        {error && <p className="text-center text-red-500 font-bold bg-red-50 p-4 rounded-lg">{error}</p>}

        {!loading && !error && (
          <>
            {interesses.length === 0 ? (
                // --- ESTADO VAZIO ---
                <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl shadow-sm max-w-2xl mx-auto border border-white flex flex-col items-center">
                    <div className="text-6xl mb-4 text-yellow-400"><FaDog /></div>
                    <p className="text-2xl font-bold text-gray-700 mb-2">Nenhum pedido encontrado</p>
                    <p className="text-gray-500 mb-8">
                        Você ainda não demonstrou interesse em nenhum pet.
                    </p>
                    
                    <button
                        onClick={() => navigate('/adotar')}
                        className="group relative flex items-center gap-3 px-8 py-4 bg-gray-900 text-white font-bold rounded-full shadow-xl hover:bg-gray-800 hover:scale-105 transition-all duration-300 cursor-pointer"
                    >
                        <div className="bg-yellow-500 rounded-full p-1 group-hover:rotate-12 transition-transform">
                            <FaSearch className="text-black text-sm" />
                        </div>
                        <span>Encontrar um Pet</span>
                    </button>
                </div>
            ) : (
                // --- LISTA VERTICAL (CLICÁVEL) ---
                <div className="flex flex-col gap-6">
                    {interesses.map((interesse) => {
                        const animal = interesse.animal;
                        const fotos = animal?.fotosAnimais;
                        
                        // Lógica de Imagem do CardPet
                        let imageUrl = IMAGEM_PADRAO;
                        if (fotos && fotos.length > 0 && fotos[0].url) {
                            imageUrl = fotos[0].url;
                        } else if (animal?.imagemUrl) {
                            imageUrl = animal.imagemUrl;
                        }

                        return (
                            // MUDANÇA PRINCIPAL: Trocamos <div> por <Link> e adicionamos a rota
                            <Link 
                                to={`/adotar/${animal?.id}`} // <-- Rota de detalhes do CardPet
                                key={interesse.interesseId} 
                                className="group bg-white rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row overflow-hidden border border-gray-100 cursor-pointer text-left no-underline"
                            >
                                {/* Imagem (Lado Esquerdo no Desktop) */}
                                <div className="md:w-1/3 lg:w-1/4 h-56 md:h-auto relative overflow-hidden bg-gray-100">
                                    <img 
                                        src={imageUrl} 
                                        alt={animal?.nome}
                                        onError={handleImageError}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    {/* Overlay apenas no mobile */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:hidden"></div>
                                    <h2 className="absolute bottom-3 left-4 text-white font-bold text-xl md:hidden drop-shadow-md">
                                        {animal?.nome}
                                    </h2>
                                </div>

                                {/* Conteúdo (Lado Direito) */}
                                <div className="p-6 flex flex-col justify-between md:w-2/3 lg:w-3/4">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="hidden md:block text-2xl font-black text-gray-800 group-hover:text-yellow-500 transition-colors mb-1">
                                                    {animal?.nome || "Pet"}
                                                </h3>
                                                <div className="text-xs text-gray-400 font-bold uppercase flex items-center gap-2 mb-3">
                                                    <FaCalendarAlt /> 
                                                    Solicitado em: {formatarDataHora(interesse.dataDeInteresse)}
                                                </div>
                                            </div>
                                            
                                            {/* Ícone de "Ir" que aparece no Hover (Feedback visual) */}
                                            <div className="hidden md:flex items-center gap-2 text-gray-300 group-hover:text-yellow-500 transition-colors">
                                                <span className="text-xs font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity">Ver Ficha</span>
                                                <FaArrowRight className="text-2xl transform group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold uppercase border border-gray-200 group-hover:bg-yellow-50 group-hover:text-yellow-700 transition-colors">
                                                {animal?.raca || "Raça N/A"}
                                            </span>
                                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold uppercase border border-gray-200 group-hover:bg-yellow-50 group-hover:text-yellow-700 transition-colors">
                                                {animal?.idade} anos
                                            </span>
                                           
                                        </div>
                                    </div>

                                    {/* Status Section */}
                                    <div className="mt-2 border-t border-gray-100 pt-2">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status da Solicitação</span>
                                        {renderStatus(interesse.status)}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MeusInteressesPage;