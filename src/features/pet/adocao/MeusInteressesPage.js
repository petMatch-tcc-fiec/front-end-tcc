import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdocaoService from './service/AdocaoService';
// 👇 IMPORTANTE: Importe o serviço que busca os detalhes do Pet
// (Verifique se o caminho está certo no seu projeto)
import PetService from '../services/PetService';

import { 
  FaPaw, FaClock, FaCheckCircle, FaTimesCircle, FaSpinner, 
  FaArrowLeft, FaHeart 
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
        // 1. Busca a lista inicial (que vem com imagem null)
        const listaInicial = await AdocaoService.getMeusInteresses();

        // --- INÍCIO DA GAMBIARRA ---
        // Vamos varrer a lista e buscar os detalhes completos de cada animal um por um
        const listaCompleta = await Promise.all(listaInicial.map(async (interesse) => {
          try {
            const animalId = interesse.animal?.id;
            if (!animalId) return interesse;

            // Chama o serviço que pega o animal completo (com fotos!)
            // Obs: Verifique se o nome do método no seu PetService é 'getById' ou 'buscarPorId'
            const animalCompleto = await PetService.getById(animalId); 
            
            // Substitui o animal "pelado" pelo animal "completo"
            return { ...interesse, animal: animalCompleto };
          } catch (err) {
            console.warn(`Não foi possível buscar detalhes extras do animal ${interesse.animal?.id}`);
            return interesse; // Se der erro, mantém o original
          }
        }));
        // --- FIM DA GAMBIARRA ---

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

  const renderStatus = (status) => {
    switch (status) {
      case 'APROVADO':
        return (
          <div className="flex flex-col gap-2">
            <span className="inline-flex items-center gap-1 w-fit px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold border border-green-200">
              <FaCheckCircle /> Aprovado
            </span>
            <p className="text-sm text-green-800 bg-green-50 p-2 rounded border border-green-100 mt-1">
              🎉 Parabéns! A ONG aprovou seu perfil.
            </p>
          </div>
        );
      case 'REJEITADO':
        return (
          <div className="flex flex-col gap-2">
            <span className="inline-flex items-center gap-1 w-fit px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold border border-red-200">
              <FaTimesCircle /> Não Aprovado
            </span>
            <p className="text-sm text-gray-500 italic">
              Infelizmente não foi possível prosseguir.
            </p>
          </div>
        );
      default:
        return (
          <div className="flex flex-col gap-2">
            <span className="inline-flex items-center gap-1 w-fit px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold border border-yellow-200">
              <FaClock /> Em Análise
            </span>
            <p className="text-sm text-gray-500">
              A ONG está analisando seu perfil.
            </p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#FFF3C4]">
        <FaSpinner className="animate-spin text-4xl text-indigo-600 mb-4" />
        <p className="text-gray-600 font-medium">Buscando seus futuros amigos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-gradient-to-r from-yellow-300 to-yellow-500 pt-10 pb-16 px-6 shadow-sm">
        <div className="container mx-auto max-w-4xl">
          <button
            onClick={() => navigate('/adotante-home')}
            className="flex items-center gap-2 text-white/90 hover:text-white font-medium transition-colors mb-4"
          >
            <FaArrowLeft /> Voltar ao Início
          </button>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-md flex items-center gap-3">
            <FaHeart className="text-red-500 bg-white p-2 rounded-full w-12 h-12 shadow-sm" />
            Meus Pedidos de Adoção
          </h1>
          <p className="text-yellow-50 mt-2 text-lg">
            Acompanhe aqui o status de todas as suas solicitações.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-6 -mt-8">
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 shadow-sm border border-red-200">
            {error}
          </div>
        )}

        {interesses.length === 0 && !error ? (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center border border-gray-100">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaPaw className="text-5xl text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Você ainda não demonstrou interesse</h3>
            <button 
              onClick={() => navigate('/adotar')}
              className="mt-4 px-8 py-3 bg-indigo-600 text-white font-bold rounded-full shadow-lg hover:bg-indigo-700"
            >
              Encontrar um Pet
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {interesses.map((interesse) => {
              const animal = interesse.animal;
              const fotos = animal?.fotosAnimais;
              
              // Lógica atualizada para pegar a foto certa
              let imageUrl = IMAGEM_PADRAO;
              if (fotos && fotos.length > 0 && fotos[0].url) {
                 imageUrl = fotos[0].url;
              } else if (animal?.imagemUrl) {
                 imageUrl = animal.imagemUrl;
              }

              return (
                <div 
                  key={interesse.interesseId} 
                  className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row"
                >
                  <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden group bg-gray-100">
                    <img 
                      src={imageUrl} 
                      alt={animal?.nome || "Pet"}
                      onError={handleImageError}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:hidden"></div>
                    <h3 className="absolute bottom-3 left-4 text-white font-bold text-xl md:hidden drop-shadow-md">
                      {animal?.nome}
                    </h3>
                  </div>

                  <div className="p-6 md:w-2/3 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 hidden md:block mb-1">
                          {animal?.nome}
                        </h3>
                        <div className="flex items-center gap-3 text-gray-600 text-sm">
                          <span className="bg-gray-100 px-2 py-1 rounded-md font-medium">
                            {animal?.raca || "Raça indefinida"}
                          </span>
                          <span>•</span>
                          <span>{animal?.idade} anos</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 font-medium">
                        Solicitado em: {interesse.dataDeInteresse ? new Date(interesse.dataDeInteresse).toLocaleDateString('pt-BR') : '-'}
                      </span>
                    </div>

                    <div className="border-t border-gray-100 pt-4 mt-auto">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Status da Solicitação</p>
                      {renderStatus(interesse.status)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MeusInteressesPage;