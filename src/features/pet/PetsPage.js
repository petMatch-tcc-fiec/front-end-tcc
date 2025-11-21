import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PetService from './services/PetService'; 
import CardPet from './components/CardPet'; 
import { FaPlus, FaSearch, FaTimes, FaPaw, FaFilter } from 'react-icons/fa';
import useAuthStore from '../../shared/store/AuthStore';
import useUserStore from '../../shared/store/UserStore';

// Objeto de estado inicial para os filtros
const filtrosIniciais = {
  buscaTexto: "",
  especie: "TODOS",
  porte: "TODOS",
  sexo: "TODOS",
  idade: "TODOS"
  // Removido filtro específico de ONG
};

const PetsPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => !!state.token);
  const userTipo = useUserStore((state) => state.tipo);

  const [masterPets, setMasterPets] = useState([]); 
  const [filtros, setFiltros] = useState(filtrosIniciais);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregarPets = async () => { 
    try {
      setLoading(true);
      setError(null);
      const data = await PetService.getPets(); 
      
      if (Array.isArray(data)) {
        const validos = data.filter(pet => pet && pet.id && pet.nome);
        setMasterPets(validos); 
      } else {
        setMasterPets([]);
      }

    } catch (err) {
      setError("Falha ao carregar pets. Tente novamente mais tarde."); 
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPets(); 
  }, []);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const limparFiltros = () => {
    setFiltros(filtrosIniciais);
  };

  const petsFiltrados = useMemo(() => {
    return masterPets.filter(pet => {
      if (!pet || !pet.nome) return false; 

      const checarString = (petField, filterValue) => {
        if (filterValue === "TODOS") return true; 
        const petValue = pet[petField]?.toUpperCase() || "";
        return petValue === filterValue;
      };

      const checarBuscaTexto = () => {
        const busca = filtros.buscaTexto.toLowerCase();
        if (busca === "") return true; 
        
        const nome = pet.nome?.toLowerCase() || "";
        const raca = pet.raca?.toLowerCase() || "";
        // ✨ Nova Lógica: Busca também pelo nome da ONG
        const nomeOng = pet.ong?.nomeFantasiaOng?.toLowerCase() || "";
        
        // Retirada a busca por localização, mantendo Nome, Raça ou ONG
        return nome.includes(busca) || raca.includes(busca) || nomeOng.includes(busca);
      };

      const checarIdade = () => {
        const filtroIdade = filtros.idade;
        if (filtroIdade === "TODOS") return true;
        const anos = pet.idade; 
        if (anos === null || anos === undefined) return false; 

        switch (filtroIdade) {
          case "FILHOTE": return anos >= 0 && anos <= 2;
          case "ADULTO":  return anos >= 3 && anos <= 7;
          case "IDOSO":   return anos >= 8;
          default:        return true; 
        }
      };

      return (
        checarBuscaTexto() &&
        checarString('especie', filtros.especie) &&
        checarString('porte', filtros.porte) &&
        checarString('sexo', filtros.sexo) &&
        checarIdade()
      );
    });
  }, [masterPets, filtros]);

  const handleDeletar = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este pet permanentemente?")) { 
      try {
        await PetService.deletarPet(id); 
        setMasterPets(prev => prev.filter(pet => pet.id !== id)); 
      } catch (err) {
        console.error("Erro ao excluir pet:", err); 
        alert("Erro ao excluir pet. Tente novamente.");
      }
    }
  };

  const renderSelect = (name, label, options) => (
    <div className="flex-1 min-w-[140px]">
      <label htmlFor={name} className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">{label}</label>
      <div className="relative">
        <select
          id={name}
          name={name}
          value={filtros[name]}
          onChange={handleFiltroChange}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-200 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer appearance-none"
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-6 md:p-10">
       <div className="max-w-7xl mx-auto">
        
        {/* --- CABEÇALHO --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black text-gray-800 drop-shadow-sm flex items-center gap-3 justify-center md:justify-start">
              <FaPaw className="text-yellow-500" />
              Adote um Amigo
            </h1>
            <p className="text-gray-600 mt-2 text-lg font-medium">
              Encontre seu companheiro perfeito ou ajude um pet a achar um lar.
            </p>
          </div>

          {isAuthenticated && userTipo === 'ONG' && (
            <button
              onClick={() => navigate('/adotar/novo')}
              className="group relative flex items-center gap-3 px-8 py-4 bg-gray-900 text-white font-bold rounded-full shadow-xl hover:bg-gray-800 hover:scale-105 transition-all duration-300"
            >
              <div className="bg-yellow-500 rounded-full p-1 group-hover:rotate-90 transition-transform">
                <FaPlus className="text-black text-sm" />
              </div>
              <span>Novo Pet</span>
            </button>
          )}
        </div>

        {/* --- PAINEL DE FILTROS --- */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-12">
          <div className="flex items-center gap-2 mb-4 text-gray-400 font-bold text-sm uppercase tracking-wider">
             <FaFilter /> Filtros de Busca
          </div>
          
          {/* Voltei para lg:grid-cols-5 já que tiramos um filtro */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              
              {renderSelect("especie", "Espécie", [
                { value: "TODOS", label: "Todas" },
                { value: "CACHORRO", label: "Cachorro" },
                { value: "GATO", label: "Gato" }
              ])}
              {renderSelect("porte", "Porte", [
                { value: "TODOS", label: "Todos" },
                { value: "PEQUENO", label: "Pequeno" },
                { value: "MÉDIO", label: "Médio" },
                { value: "GRANDE", label: "Grande" }
              ])}
              {renderSelect("sexo", "Sexo", [
                { value: "TODOS", label: "Todos" },
                { value: "M", label: "Macho" },
                { value: "F", label: "Fêmea" }
              ])}
              {renderSelect("idade", "Idade", [
                { value: "TODOS",   label: "Todas" },
                { value: "FILHOTE", label: "Filhote" },
                { value: "ADULTO",  label: "Adulto" },
                { value: "IDOSO",   label: "Idoso" }
              ])}
              
              <div className="flex items-end">
                <button
                  onClick={limparFiltros}
                  className="w-full py-2 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 h-[42px]"
                >
                  <FaTimes size={12} /> Limpar
                </button>
              </div>
          </div>

          {/* Barra de Busca Texto */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              name="buscaTexto"
              value={filtros.buscaTexto}
              onChange={handleFiltroChange}
              placeholder="Buscar por nome, raça ou ONG..." // ✨ Placeholder atualizado
              className="block w-full pl-11 pr-4 py-3 bg-gray-50 border-transparent text-gray-900 placeholder-gray-400 rounded-xl focus:bg-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
            />
          </div>
        </div>

        {/* --- CONTEÚDO (GRID) --- */}
        {loading && (
           <div className="flex justify-center items-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-yellow-500"></div>
           </div>
        )}

        {error && <p className="text-center text-red-500 font-bold bg-red-50 p-4 rounded-lg">{error}</p>}

        {!loading && !error && (
          <>
            {petsFiltrados.length === 0 ? (
               <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl shadow-sm max-w-2xl mx-auto border border-white">
                <div className="text-6xl mb-4">🐱</div>
                <p className="text-2xl font-bold text-gray-700 mb-2">Nenhum pet encontrado</p>
                <p className="text-gray-500">
                  {masterPets.length === 0 ? "Ainda não temos pets cadastrados." : "Tente ajustar os filtros de busca."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {petsFiltrados.map(pet => {
                   if (!pet || !pet.id || !pet.nome) return null;
                   return (
                      <CardPet
                        key={pet.id}
                        pet={pet} 
                        onDeletar={handleDeletar}
                        showControls={isAuthenticated && userTipo === 'ONG'}
                      />
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

export default PetsPage;