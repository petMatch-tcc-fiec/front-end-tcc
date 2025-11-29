import api from "../../../shared/utils/api";

/**
 * Payload para criar um Pet.
 * (Ajuste os campos conforme seu backend)
 * @typedef {object} CriarPetPayload
 * @property {string} nome
 * @property {string} especie
 * @property {string} porte
 * @property {number} idade
 * @property {string} descricao
 * @property {string} imagemUrl
 * @property {string} idOng
 */

const ROTA_API = "/v1/api/animais";
const ROTA_ADOCAO = "/v1/api/adocao";

const PetService = {

  /**
   * Lista todos os pets
   */
  async getPets() {
    try {
      const response = await api.get(ROTA_API);

      if (response.data && Array.isArray(response.data.content)) {
        return response.data.content;
      }

      if (Array.isArray(response.data)) {
        return response.data;
      }

      console.warn("A resposta da API de pets não era um array nem Page.");
      return [];

    } catch (error) {
      console.error("Erro ao listar pets:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Busca pet pelo ID
   */
  async getPetById(id) {
    try {
      const response = await api.get(`${ROTA_API}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar pet por ID:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Criar pet (envia FormData)
   */
  async criarPet(formData) {
    try {
      const response = await api.post(ROTA_API, formData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar pet:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Deletar pet
   */
  async deletarPet(id) {
    try {
      await api.delete(`${ROTA_API}/${id}`);
    } catch (error) {
      console.error("Erro ao deletar pet:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Atualizar status (ex: "ADOTADO")
   */
  async atualizarStatus(id, novoStatus) {
    try {
      const response = await api.patch(`${ROTA_API}/${id}/status`, { status: novoStatus });
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar status:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Registrar interesse/match
   */
  async registrarInteresse(animalId) {
    try {
      const response = await api.post(`${ROTA_ADOCAO}/animal/${animalId}/match`);
      return response.data;
    } catch (error) {
      console.error("Erro ao registrar interesse:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Buscar ficha médica do animal
   * GET /v1/api/animais/{id}/ficha
   */
async getFichaMedica(animalId) {
    try {
      const response = await api.get(`${ROTA_API}/${animalId}/ficha`);
      
      // Se o status for 204 (No Content), significa que não tem ficha, mas deu certo.
      if (response.status === 204) {
        return null;
      }

      return response.data;
    } catch (error) {
      // Se der 404, também retornamos null (sem ficha)
      if (error.response && error.response.status === 404) {
        return null; 
      }
      console.error("Erro ao buscar ficha médica:", error);
      throw error;
    }
  },

  /**
   * Criar/Atualizar ficha médica
   * PUT /v1/api/animais/{id}/ficha
   */
async saveFichaMedica(animalId, fichaData) {
    try {
      const payload = {
        vacinas: fichaData.vacinas,
        historicoSaude: fichaData.historicoSaude
      };

      // CORREÇÃO AQUI: Mudado de api.put para api.post
      const response = await api.post(`${ROTA_API}/${animalId}/ficha`, payload);
      return response.data;
    } catch (error) {
      console.error("Erro ao salvar ficha médica:", error);
      throw error;
    }
  }
};

export default PetService;
