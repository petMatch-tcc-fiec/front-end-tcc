import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PetService from '../services/PetService';
import { useAuth } from '../../../shared/context/AuthContext';
import {
  FaArrowLeft, FaPaw, FaRulerVertical, FaBirthdayCake,
  FaHeart, FaBuilding, FaCheckCircle, FaMapMarkerAlt, FaVenusMars
} from 'react-icons/fa';

const PetPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pet, setPet] = useState(null);
  const [matchStatus, setMatchStatus] = useState({
    loading: false, error: null, success: false, alreadyMatched: false
  });

  useEffect(() => {
    PetService.getPetById(id).then(data => {
      setPet(data);
    }).catch(err => {
      console.error(err);
      navigate('/adotar');
    });
  }, [id, navigate]);

  const handleMatch = async () => {
    if (!pet) return;
    setMatchStatus({ loading: true, error: null, success: false, alreadyMatched: false });
    try {
      await PetService.registrarInteresse(pet.id);
      setMatchStatus({ loading: false, error: null, success: true, alreadyMatched: false });
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Erro ao registrar.";
      if (errorMsg.includes("Usuário já está na fila") || errorMsg.includes("já demonstrou interesse")) {
        setMatchStatus({ loading: false, error: null, success: true, alreadyMatched: true });
      } else {
        setMatchStatus({ loading: false, error: errorMsg, success: false, alreadyMatched: false });
      }
    }
  };

  if (!pet) {
    return (
       <div className="min-h-[50vh] flex justify-center items-center">
         <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-yellow-500"></div>
      </div>
    );
  }

  const isAdotante = user && user.tipo !== 'ONG';
  const imagemCapa = (pet.fotosAnimais && pet.fotosAnimais.length > 0)
    ? pet.fotosAnimais[0].url
    : pet.imagemUrl || 'https://via.placeholder.com/800x600?text=Sem+Foto';

  const SuccessIcon = FaCheckCircle;

  const getSexoLabel = (sexo) => {
    if (sexo === 'M') return 'Macho';
    if (sexo === 'F') return 'Fêmea';
    return sexo || 'Não inf.';
  };

  return (
    // Container principal reduzido para max-w-5xl e padding otimizado
    <div className="p-4 md:p-6 max-w-5xl mx-auto mt-4 mb-10">

      <button
        onClick={() => navigate('/adotar')}
        className="group mb-4 flex items-center text-gray-600 hover:text-yellow-600 transition-colors text-sm font-bold"
      >
        <div className="p-1.5 rounded-full bg-white shadow-sm mr-2 group-hover:shadow-md transition-all group-hover:-translate-x-1">
            <FaArrowLeft size={12} />
        </div>
        Voltar para a lista
      </button>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden relative">

        <div className="h-3 bg-gradient-to-r from-yellow-400 to-orange-500 w-full" />

        {/* CAPA MAIS COMPACTA (h-52 mobile / h-72 desktop) */}
        <div className="relative h-52 md:h-72 bg-gray-100">
           <img src={imagemCapa} alt={pet.nome} className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
           <div className="absolute bottom-0 left-0 p-6 w-full">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
                <div>
                    {/* Título reduzido para caber melhor */}
                    <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-md capitalize leading-none mb-1">
                        {pet.nome}
                    </h1>
                    {pet.localizacao && (
                        <div className="flex items-center text-white/90 gap-2 font-medium text-sm md:text-base mt-1">
                            <FaMapMarkerAlt className="text-yellow-400" /> {pet.localizacao}
                        </div>
                    )}
                </div>
              </div>
           </div>
        </div>

        <div className="p-6 md:p-8">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

             {/* LADO ESQUERDO (Informações) */}
             <div className="lg:col-span-2">
                <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <FaPaw className="text-yellow-500" /> Sobre mim
                </h2>
                {/* Texto menor e com menos espaçamento */}
                <p className="text-base text-gray-600 leading-relaxed mb-6 text-justify">
                  {pet.observacoesAnimal || "Este pet ainda não tem uma descrição detalhada, mas tem muito amor para dar! Entre em contato com a ONG para saber mais."}
                </p>

                {/* GRIDS COMPACTOS (gap-3 e padding menor) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">

                   <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex flex-col items-center text-center">
                      <FaPaw className="text-2xl text-blue-500 mb-1" />
                      <span className="text-[10px] font-bold text-blue-400 uppercase">Espécie</span>
                      <span className="font-bold text-gray-800 text-sm capitalize">{pet.especie?.toLowerCase()}</span>
                   </div>

                   <div className="bg-teal-50 p-3 rounded-xl border border-teal-100 flex flex-col items-center text-center">
                      <FaVenusMars className="text-2xl text-teal-500 mb-1" />
                      <span className="text-[10px] font-bold text-teal-400 uppercase">Sexo</span>
                      <span className="font-bold text-gray-800 text-sm capitalize">{getSexoLabel(pet.sexo)}</span>
                   </div>

                   <div className="bg-purple-50 p-3 rounded-xl border border-purple-100 flex flex-col items-center text-center">
                      <FaRulerVertical className="text-2xl text-purple-500 mb-1" />
                      <span className="text-[10px] font-bold text-purple-400 uppercase">Porte</span>
                      <span className="font-bold text-gray-800 text-sm capitalize">{pet.porte?.toLowerCase()}</span>
                   </div>

                   <div className="bg-pink-50 p-3 rounded-xl border border-pink-100 flex flex-col items-center text-center">
                      <FaBirthdayCake className="text-2xl text-pink-500 mb-1" />
                      <span className="text-[10px] font-bold text-pink-400 uppercase">Idade</span>
                      <span className="font-bold text-gray-800 text-sm">{pet.idade} anos</span>
                   </div>

                </div>

                {/* ONG mais compacta */}
                <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                   <div className="p-2 bg-white rounded-full shadow-sm mr-3 text-gray-700">
                      <FaBuilding size={18} />
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">ONG Responsável</p>
                      <p className="text-base font-bold text-gray-800 leading-tight">
                        {pet.ong ? pet.ong.nomeFantasiaOng : "Não informada"}
                      </p>
                   </div>
                </div>
             </div>

             {/* LADO DIREITO (Ação Sticky) */}
             <div className="lg:col-span-1">
                {isAdotante ? (
                   // Sticky para acompanhar o scroll se necessário
                   <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-lg sticky top-4">
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Gostou do/a {pet.nome}?</h3>
                        <p className="text-gray-500 text-xs mt-1">Demonstre interesse para a ONG entrar em contato!</p>
                      </div>

                      {/* --- INÍCIO DAS MUDANÇAS NO BOTÃO --- */}
                      <button
                        onClick={handleMatch}
                        disabled={matchStatus.loading || matchStatus.success}
                        className={`w-full py-3 rounded-xl font-bold text-base shadow-md transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 ${
                          matchStatus.success
                            ? "bg-green-500 text-white hover:bg-green-600" // Sucesso mantém verde
                            // MUDANÇA: Gradiente amarelo/laranja e texto escuro
                            : "bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-500 hover:to-orange-600"
                        }`}
                      >
                          {/* MUDANÇA: Adicionado 'text-red-500' para forçar o coração vermelho */}
                          {matchStatus.success ? <SuccessIcon /> : <FaHeart className={`text-red-500 ${matchStatus.loading ? "animate-pulse" : ""}`} />}
                          {matchStatus.loading ? "Enviando..." : matchStatus.success ? "Interesse Enviado!" : "Quero Adotar"}
                      </button>
                      {/* --- FIM DAS MUDANÇAS NO BOTÃO --- */}

                      {matchStatus.error && (
                        <div className="mt-3 p-2 bg-red-50 text-red-600 text-xs rounded text-center border border-red-100">
                           {matchStatus.error}
                        </div>
                      )}

                      {matchStatus.alreadyMatched && (
                        <div className="mt-3 p-2 bg-green-50 text-green-700 text-xs rounded text-center border border-green-100 font-medium">
                           Você já está na fila!
                        </div>
                      )}
                   </div>
                ) : (
                   <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center text-gray-500 text-sm">
                      <p>Faça login como Adotante para demonstrar interesse.</p>
                   </div>
                )}
             </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PetPage;