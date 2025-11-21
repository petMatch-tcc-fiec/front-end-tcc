import api from "../../../shared/utils/api";

// (Comentários JSDoc da sua versão original omitidos por brevidade)
/**
 * Payload para criar um Pet.
 * (Ajuste os campos conforme seu backend)
 * @typedef {object} CriarPetPayload
 * @property {string} nome
 * @property {string} especie (ex: "Cachorro", "Gato")
 * @property {string} porte (ex: "Pequeno", "Medio", "Grande")
 * @property {number} idade
 * @property {string} descricao
 * @property {string} imagemUrl
 * @property {string} idOng - (UUID) O ID da ONG.
 */
// Define as rotas base corretas
const ROTA_API = "/v1/api/animais";
const ROTA_ADOCAO = "/v1/api/adocao"; // <-- Rota para o módulo de adoção

const PetService = {

  /**
   * Busca a lista de todos os pets.
   */
  async getPets() {
    // (PRESERVADO - Nenhuma mudança aqui)
    try {
      const response = await api.get(ROTA_API);

      // Verifica se a resposta é um objeto de página do Spring (tem a chave 'content')
      if (response.data && Array.isArray(response.data.content)) {
        return response.data.content; // Retorna SÓ O ARRAY de pets
      }
      
      // Se não for um objeto de página, mas for um array (fallback)
      if (Array.isArray(response.data)) {
        return response.data; // Retorna o array
      }

      // Se for qualquer outra coisa (inesperado), retorna um array vazio
      console.warn("A resposta da API de pets não era um array nem um objeto de página.");
      return [];

    } catch (error) {
      console.error("Erro ao listar pets:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Busca os detalhes de um único pet pelo ID.
   */
  async getPetById(id) {
    // (PRESERVADO - Nenhuma mudança aqui)
    try {
      // Rota corrigida (mapeia para @GetMapping("/{id}"))
      const response = await api.get(`${ROTA_API}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar pet por ID:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Cria um novo pet.
   * --- INÍCIO DAS MUDANÇAS ---
   * @param {FormData} formData O formulário com 'dto' e 'file'.
   */
  async criarPet(formData) { // <-- MUDANÇA 1: Recebe 'formData'
    try {
      // MUDANÇA 2: Envia 'formData'
      // O Axios detecta o FormData e define o Content-Type automaticamente
      const response = await api.post(ROTA_API, formData); 
      return response.data;
    } catch (error) {
      console.error("Erro ao criar pet:", error.response?.data || error.message);
      throw error;
    }
  },
  // --- FIM DAS MUDANÇAS ---

  /**
   * Deleta um pet pelo ID.
   */
  async deletarPet(id) {
    // (PRESERVADO - Nenhuma mudança aqui)
    try {
      // Rota corrigida (mapeia para @DeleteMapping("/{id}"))
      await api.delete(`${ROTA_API}/${id}`);
    } catch (error) {
      console.error("Erro ao deletar pet:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * ✨ NOVA FUNÇÃO ADICIONADA
   * Atualiza o status do animal (ex: "ADOTADO", "DISPONIVEL").
   * Chama o endpoint: PATCH /v1/api/animais/{id}/status
   * @param {string} id O UUID do animal
   * @param {string} novoStatus O novo status
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
   * Registra o interesse (match) de um usuário em um animal.
   * Chama o endpoint: POST /v1/api/adocao/animal/{animalId}/match
   * @param {string} animalId O UUID do animal
   */
  async registrarInteresse(animalId) {
    // (PRESERVADO - Nenhuma mudança aqui)
    try {
      const response = await api.post(`${ROTA_ADOCAO}/animal/${animalId}/match`);
      return response.data;
    } catch (error) {
      console.error("Erro ao registrar interesse:", error.response?.data || error.message);
      // Lança o erro para que o componente possa tratá-lo
      throw error;
    }
  }
};

export default PetService;