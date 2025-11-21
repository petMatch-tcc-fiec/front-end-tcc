import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PetService from '../services/PetService';
import { useAuth } from '../../../shared/context/AuthContext';
// ✨ IMPORTAÇÃO GARANTIDA
import {
  FaArrowLeft,
  FaPaw,
  FaRulerVertical,
  FaBirthdayCake,
  FaHeart,
  FaBuilding,
  FaCheckCircle
} from 'react-icons/fa';

const PetPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pet, setPet] = useState(null);

  const [matchStatus, setMatchStatus] = useState({
    loading: false,
    error: null,
    success: false,
    alreadyMatched: false 
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
        setMatchStatus({ 
            loading: false, 
            error: null, 
            success: true, 
            alreadyMatched: true
        });
      } else {
        setMatchStatus({ loading: false, error: errorMsg, success: false, alreadyMatched: false });
      }
    }
  };

  if (!pet) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-600">Carregando Pet...</h2>
      </div>
    );
  }

  const isAdotante = user && user.tipo !== 'ONG';
  const imagemCapa = (pet.fotosAnimais && pet.fotosAnimais.length > 0)
    ? pet.fotosAnimais[0].url
    : pet.imagemUrl || 'https://via.placeholder.com/800x600?text=Sem+Foto';

  const getButtonText = () => {
    if (matchStatus.loading) return "Enviando...";
    if (matchStatus.alreadyMatched) return "Interesse Já Registrado";
    if (matchStatus.success) return "Interesse Enviado!";
    return "Quero Adotar";
  };

  // ✨ PROTEÇÃO DO ÍCONE
  // Se FaCheckCircle estiver undefined por algum motivo bizarro, usa null
  const SuccessIcon = FaCheckCircle || (() => <span>(OK)</span>);

  return (
    <div className="p-6 max-w-5xl mx-auto mt-8">
      <button
        onClick={() => navigate('/adotar')}
        className="mb-6 px-5 py-2.5 bg-white text-gray-700 font-medium rounded-full shadow-sm hover:shadow-md hover:bg-gray-50 transition-all flex items-center gap-2 border border-gray-200"
      >
        <FaArrowLeft className="text-sm" />
        Voltar para lista
      </button>

      <div className="bg-white shadow-xl rounded-3xl overflow-hidden">
        
        <div className="w-full h-96 bg-gray-100 relative">
           <img src={imagemCapa} alt={pet.nome} className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
           <h1 className="absolute bottom-6 left-8 text-5xl font-bold text-white drop-shadow-md capitalize">
             {pet.nome}
           </h1>
        </div>

        <div className="p-8 md:p-10">
          
          <div className="mb-8">
             <h2 className="text-2xl font-bold text-gray-800 mb-3">Sobre mim</h2>
             <p className="text-lg text-gray-600 leading-relaxed">
               {pet.observacoesAnimal || "Este pet ainda não tem uma descrição detalhada, mas tem muito amor para dar!"}
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             
             <div className="md:col-span-2 space-y-4">
                <div className="flex items-center p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <div className="p-3 bg-blue-100 rounded-full mr-4">
                    <FaBuilding className="text-xl text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 font-semibold uppercase tracking-wide">ONG Responsável</p>
                    <p className="text-xl font-bold text-blue-900">
                      {pet.ong ? pet.ong.nomeFantasiaOng : "Não informada"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl flex flex-col items-center text-center border border-gray-100">
                    <FaPaw className="text-3xl text-indigo-500 mb-2" />
                    <span className="text-sm text-gray-500">Espécie</span>
                    <span className="font-bold text-gray-800 text-lg">{pet.especie}</span>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl flex flex-col items-center text-center border border-gray-100">
                    <FaRulerVertical className="text-3xl text-purple-500 mb-2" />
                    <span className="text-sm text-gray-500">Porte</span>
                    <span className="font-bold text-gray-800 text-lg">{pet.porte}</span>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl flex flex-col items-center text-center border border-gray-100">
                    <FaBirthdayCake className="text-3xl text-pink-500 mb-2" />
                    <span className="text-sm text-gray-500">Idade</span>
                    <span className="font-bold text-gray-800 text-lg">{pet.idade} {pet.idade === 1 ? 'ano' : 'anos'}</span>
                  </div>
                </div>
             </div>

             <div className="md:col-span-1">
               {isAdotante ? (
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 sticky top-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Gostou do {pet.nome}?</h3>
                    
                    <button
                      onClick={handleMatch}
                      disabled={matchStatus.loading || matchStatus.success} 
                      className={`w-full flex items-center justify-center gap-2 py-4 text-lg font-bold rounded-xl shadow-lg transition-all transform disabled:opacity-80 disabled:cursor-not-allowed disabled:translate-y-0 ${
                        matchStatus.success 
                          ? "bg-green-500 text-white hover:bg-green-600" 
                          : "bg-gradient-to-r from-pink-500 to-red-500 text-white hover:from-pink-600 hover:to-red-600 hover:-translate-y-1"
                      }`}
                    >
                      {/* Aqui é onde estava quebrando se o ícone não existisse */}
                      {matchStatus.success ? <SuccessIcon /> : <FaHeart className={matchStatus.loading ? "animate-pulse" : ""} />}
                      {getButtonText()}
                    </button>
                    
                    {matchStatus.error && (
                      <p className="text-red-500 text-sm text-center mt-3 bg-red-50 p-2 rounded-lg border border-red-100">
                        {matchStatus.error}
                      </p>
                    )}
                    
                    {matchStatus.alreadyMatched && (
                       <p className="text-green-700 text-sm text-center mt-3 bg-green-100 p-2 rounded-lg border border-green-200">
                         Você já está na fila de espera deste pet! A ONG entrará em contato.
                       </p>
                    )}
                    {matchStatus.success && !matchStatus.alreadyMatched && (
                      <p className="text-green-600 text-sm text-center mt-3 bg-green-50 p-2 rounded-lg border border-green-100">
                        Interesse enviado com sucesso!
                      </p>
                    )}
                  </div>
               ) : (
                 <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-center">
                   <p className="text-gray-500 text-sm">Faça login como adotante para registrar interesse.</p>
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