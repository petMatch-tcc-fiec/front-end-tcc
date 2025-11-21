import api from "../../../../shared/utils/api"; // Ajuste o caminho conforme sua estrutura

// Rota base para as ações de adoção
const ROTA_ADOCAO = "/v1/api/adocao";

const AdocaoService = {
  
  /**
   * Busca a lista de interesses do USUÁRIO LOGADO (Adotante).
   * Chama: GET /v1/api/adocao/adotante
   */
  async getMeusInteresses() {
    try {
      // Vamos criar este endpoint no backend
      const response = await api.get(`${ROTA_ADOCAO}/adotante`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar meus interesses:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Busca a lista de interessados (fila de espera) para um animal (Visão da ONG).
   * Chama: GET /v1/api/adocao/animal/{animalId}/lista-espera
   */
  async getInteressados(animalId) {
    try {
      const response = await api.get(`${ROTA_ADOCAO}/animal/${animalId}/lista-espera`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar interessados para ${animalId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Avalia um interesse (Aprova ou Rejeita).
   */
  async avaliarInteresse(interesseId, status) {
    try {
      const payload = { status: status.toUpperCase() }; 
      const response = await api.put(`${ROTA_ADOCAO}/interesse/${interesseId}/avaliar`, payload);
      return response.data;
    } catch (error) {
        console.error(`Erro ao avaliar interesse ${interesseId}:`, error.response?.data || error.message);
        throw error;
      }
    }
};

export default AdocaoService;