import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PetService from './services/PetService'; 
import CardPet from './components/CardPet'; 
import { FaPlus, FaSearch, FaTimes } from 'react-icons/fa';
import useAuthStore from '../../shared/store/AuthStore';
import useUserStore from '../../shared/store/UserStore';

// Objeto de estado inicial para os filtros
const filtrosIniciais = {
  buscaTexto: "",
  especie: "TODOS",
  porte: "TODOS",
  sexo: "TODOS",
  idade: "TODOS"
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
      
      // ✨ CORREÇÃO 1: Limpeza preventiva dos dados
      // Só aceita pets que tenham ID e Nome válidos. Remove lixo/nulos.
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
      // Proteção extra caso algum item inválido tenha passado
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
        const localizacao = pet.localizacao?.toLowerCase() || "";
        
        return nome.includes(busca) || 
               raca.includes(busca) || 
               localizacao.includes(busca);
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
    if (window.confirm("Tem certeza que deseja excluir este pet?")) { 
      try {
        await PetService.deletarPet(id); 
        setMasterPets(masterPets.filter(pet => pet.id !== id)); 
      } catch (err) {
        console.error("Erro ao excluir pet:", err); 
      }
    }
  };

  const renderSelect = (name, label, options) => (
    <div className="flex-1 min-w-[150px]">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        id={name}
        name={name}
        value={filtros[name]}
        onChange={handleFiltroChange}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Pets para Adoção 
        </h1>
        {isAuthenticated && userTipo === 'ONG' && (
          <button
            onClick={() => navigate('/adotar/novo')} 
            className="flex items-center gap-2 px-5 py-3 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 transition-colors"
          >
            <FaPlus />
            Novo Pet 
          </button>
        )}
      </div>

      <div className="mb-10 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex flex-wrap items-end gap-4">
          
          {renderSelect("especie", "Espécie", [
            { value: "TODOS", label: "Todas as Espécies" },
            { value: "CACHORRO", label: "Cachorro" },
            { value: "GATO", label: "Gato" }
          ])}

          {renderSelect("porte", "Porte", [
            { value: "TODOS", label: "Todos os Portes" },
            { value: "PEQUENO", label: "Pequeno" },
            { value: "MÉDIO", label: "Médio" },
            { value: "GRANDE", label: "Grande" }
          ])}

          {renderSelect("sexo", "Sexo", [
            { value: "TODOS", label: "Todos os Sexos" },
            { value: "M", label: "Macho" },
            { value: "F", label: "Fêmea" }
          ])}

          {renderSelect("idade", "Idade", [
            { value: "TODOS",   label: "Todas as Idades" },
            { value: "FILHOTE", label: "Filhote (0-2 anos)" },
            { value: "ADULTO",  label: "Adulto (3-7 anos)" },
            { value: "IDOSO",   label: "Idoso (8+ anos)" }
          ])}
          
          <button
            onClick={limparFiltros}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            <FaTimes /> Limpar
          </button>
        </div>

        <div className="mt-4 relative">
          <input
            type="text"
            name="buscaTexto"
            value={filtros.buscaTexto}
            onChange={handleFiltroChange}
            placeholder="    Buscar por nome, raça ou localização..."
            className="w-full text-lg p-3 pl-10 rounded-lg border-2 border-gray-300 focus:border-yellow-500 focus:outline-none"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {loading && <p className="text-center text-lg">Carregando pets...</p>}
      {error && <p className="text-center text-lg text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          {petsFiltrados.length === 0 ? (
            <p className="text-center text-lg text-gray-600">
              {masterPets.length === 0 ? 
                "Nenhum pet cadastrado ainda." : 
                "Nenhum pet encontrado com esse filtro."}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
              {petsFiltrados.map(pet => {
                 // ✨ CORREÇÃO 2: Última barreira de defesa
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
  );
};

export default PetsPage;