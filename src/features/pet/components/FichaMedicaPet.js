import React, { useState, useEffect } from 'react';
import PetService from '../services/PetService';
import { FaStethoscope, FaSyringe, FaFileMedical, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const FichaMedicaPet = ({ animalId, canEdit }) => {
  const [ficha, setFicha] = useState({
    vacinas: '',
    historicoSaude: ''
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    loadFicha();
  }, [animalId]);

  const loadFicha = async () => {
    try {
      setLoading(true);
      const data = await PetService.getFichaMedica(animalId);
      if (data) {
        setFicha({
            vacinas: data.vacinas || '',
            historicoSaude: data.historicoSaude || ''
        });
        // Se tiver algum texto preenchido, consideramos que tem dados
        if (data.vacinas || data.historicoSaude) {
            setHasData(true);
        }
      }
    } catch (error) {
      console.log("Ficha ainda não criada ou erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFicha(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await PetService.saveFichaMedica(animalId, ficha);
      setIsEditing(false);
      setHasData(true);
      alert('Ficha médica atualizada com sucesso!');
    } catch (error) {
      alert('Erro ao salvar. Verifique se o Backend (AnimaisController) tem o endpoint /ficha');
    }
  };

  // Lógica de exibição:
  // Se não tem dados, não é dono e não está carregando -> Não mostra nada (para não poluir a tela do adotante)
  //if (!hasData && !canEdit && !loading) return null;

  return (
    <div className="mt-6 bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100">
      <div className="bg-blue-50/50 p-4 border-b border-blue-100/50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <FaStethoscope className="text-blue-500" /> 
          Ficha Médica
        </h3>
        
        {canEdit && !isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 text-xs font-bold bg-white border border-blue-200 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <FaEdit /> Editar
          </button>
        )}
      </div>

      <div className="p-5">
        {loading ? (
           <div className="flex justify-center p-2"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div></div>
        ) : (
          <div className="space-y-5">
            
            {/* Campo Vacinas */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                <FaSyringe className="text-green-500" /> Vacinas
              </label>
              {isEditing ? (
                <textarea
                  name="vacinas"
                  value={ficha.vacinas}
                  onChange={handleChange}
                  placeholder="Ex: V10 (12/05/2024), Antirrábica..."
                  className="w-full p-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all min-h-[80px]"
                />
              ) : (
                <div className="bg-gray-50 p-3 rounded-xl text-gray-700 text-sm border border-gray-100 whitespace-pre-line">
                  {ficha.vacinas || "Nenhuma vacina registrada."}
                </div>
              )}
            </div>

            {/* Campo Histórico */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                <FaFileMedical className="text-red-400" /> Histórico de Saúde
              </label>
              {isEditing ? (
                <textarea
                  name="historicoSaude"
                  value={ficha.historicoSaude}
                  onChange={handleChange}
                  placeholder="Ex: Castrado, Vermifugado, Cirurgias anteriores..."
                  className="w-full p-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all min-h-[80px]"
                />
              ) : (
                <div className="bg-gray-50 p-3 rounded-xl text-gray-700 text-sm border border-gray-100 whitespace-pre-line">
                  {ficha.historicoSaude || "Nenhum histórico registrado."}
                </div>
              )}
            </div>

            {/* Botões de Salvar/Cancelar */}
            {isEditing && (
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSave}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 shadow-md shadow-blue-200"
                >
                  Salvar Alterações
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FichaMedicaPet;