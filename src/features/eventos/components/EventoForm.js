// --- 1. IMPORTAÇÕES SIMPLIFICADAS ---
// Removemos DatePicker, format, ptBR e o CSS!
import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import EventoService from "../services/EventoService";
import Frame1 from "../../splash/assets/Frame1.png";
import { useAuth } from "../../../shared/context/AuthContext";

const EventoForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // --- O useEffect do ResizeObserver FOI REMOVIDO (não é mais necessário) ---

  // --- LÓGICA DE PERMISSÃO (continua igual) ---
  useEffect(() => {
    if (user && user.tipo !== "ONG") {
      console.warn("Acesso negado: Rota apenas para ONGs.");
      navigate("/eventos");
    }
  }, [user, navigate]);

  // --- 4. ESTADO SIMPLIFICADO ---
  // A data/hora agora é só uma string no formulário
  const [form, setForm] = useState({
    nome: "",
    endereco: "",
    dataHora: "", // <-- O input nativo usa uma string "yyyy-MM-ddTHH:mm"
  });
  const [errors, setErrors] = useState({});

  // --- 5. HANDLER ÚNICO (SIMPLIFICADO) ---
  // Este handler agora cuida de TODOS os campos, inclusive o de data/hora
  const handleForm = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBack = () => navigate(-1);

  // --- 6. FUNÇÃO DE ENVIO (MUITO MAIS SIMPLES) ---
  const enviaServidor = async (e) => {
    e.preventDefault();
    setErrors({});
    const tempErrors = {};

    // Validação
    if (!form.nome) tempErrors.nome = "O nome do evento é obrigatório!";
    if (!form.endereco) tempErrors.endereco = "O endereço é obrigatório!";
    if (!form.dataHora) tempErrors.dataHora = "A data e hora são obrigatórias!";

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    if (!user || !user.id) {
      console.error("Erro: ID do usuário ONG não encontrado.");
      setErrors({ geral: "Erro de autenticação, faça login novamente." });
      return;
    }

    try {
      // ** AQUI ESTÁ A MÁGICA **
      // O valor de 'form.dataHora' já é "2025-11-10T20:30".
      // Só precisamos adicionar os segundos (":00") que o backend espera.
      const dataHoraLocalString = `${form.dataHora}:00`;

      const payload = {
        nome: form.nome,
        dataHora: dataHoraLocalString, // <-- Perfeito!
        endereco: form.endereco,
        descricao: form.descricao, // <-- MUDANÇA 2: ADICIONADO AO PAYLOAD
        idOng: user.id,
      };

      console.log("Enviando payload para criar evento:", payload);
      await EventoService.criarEvento(payload);
      navigate("/eventos");

    } catch (err) {
      console.error("Falha ao cadastrar evento:", err);
      setErrors({
        geral: err.response?.data?.message || "Falha ao criar evento.",
      });
    }
  };

  // Função para renderizar inputs de TEXTO (igual)
  const renderInput = (id, label) => (
    <div className="mb-3.5">
      <label htmlFor={id} className="block text-black font-medium text-sm">
        {label}:
      </label>
      <input
        id={id}
        name={id}
        type="text"
        value={form[id]}
        onChange={handleForm}
        placeholder={`Digite ${label.toLowerCase()}`}
        className={`w-full text-base py-3.5 px-3 rounded-md border-[1.5px] ${
          errors[id] ? "border-red-500" : "border-white/80"
        } bg-white/95 text-black`}
      />
      {errors[id] && <p className="text-red-600 text-xs mt-1">{errors[id]}</p>}
    </div>
  );

  if (!user || user.tipo !== "ONG") {
    return null;
  }

  // --- 7. RENDERIZAÇÃO DO COMPONENTE (JSX) ---
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen p-5 sm:p-20 md:p-10 text-[#333]">
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 text-black rounded-lg hover:bg-gray-200 transition-colors z-50"
      >
        <FaArrowLeft size={20} />
        <span className="text-lg font-medium">Voltar</span>
      </button>

      <div className="relative w-full max-w-[500px] min-w-[320px] p-0 animate-slideIn">
        <div className="flex flex-col items-center mb-7 text-black font-bold text-3xl text-shadow">
          <h2 className="logo-title text-6xl font-bold">PetMatch</h2>
          <img src={Frame1} alt="logo" className="max-w-[200px] mt-2.5" />
          <h2 className="text-2xl font-bold">Cadastrar Novo Evento</h2>
          <h2 className="text-sm font-bold">
            Preencha os dados para criar um novo evento
          </h2>
        </div>

        <form onSubmit={enviaServidor} className="w-full">
          {renderInput("nome", "Nome do Evento")}

          {/* --- O NOVO SELETOR DE DATA/HORA NATIVO --- */}
          <div className="mb-3.5">
            <label htmlFor="dataHora" className="block text-black font-medium text-sm">
              Data e Hora:
            </label>
            <input
              id="dataHora"
              name="dataHora"
              type="datetime-local" // <-- O tipo nativo do HTML5
              value={form.dataHora}
              onChange={handleForm}
              // Usamos as mesmas classes para parecer o mais próximo possível
              className={`w-full text-base py-3.5 px-3 rounded-md border-[1.5px] ${
                errors.dataHora ? "border-red-500" : "border-white/80"
              } bg-white/95 text-black`}
            />
            {errors.dataHora && (
              <p className="text-red-600 text-xs mt-1">{errors.dataHora}</p>
            )}
          </div>
          {/* --- FIM DO NOVO SELETOR --- */}

          {renderInput("endereco", "Endereço")}

          {/* --- MUDANÇA 3: NOVO CAMPO DE DESCRIÇÃO --- */}
        <div className="mb-3.5">
          <label htmlFor="descricao" className="block text-black font-medium text-sm">
            Descrição (Opcional):
          </label>
          <textarea
            id="descricao"
            name="descricao"
            rows="4"
            value={form.descricao}
            onChange={handleForm}
            placeholder="Digite os detalhes do evento..."
            className={`w-full text-base py-3.5 px-3 rounded-md border-[1.5px] ${
              errors.descricao ? "border-red-500" : "border-white/80"
            } bg-white/95 text-black`}
          />
          {errors.descricao && <p className="text-red-600 text-xs mt-1">{errors.descricao}</p>}
        </div>
        {/* --- FIM DO NOVO CAMPO --- */}

          {errors.geral && (
            <p className="text-red-600 text-sm text-center mt-2">
              {errors.geral}
            </p>
          )}

          <button
            type="submit"
            className="w-full text-base rounded-2xl py-2.5 mt-4 bg-black text-white font-semibold cursor-pointer transition-colors hover:bg-gray-800 disabled:opacity-50"
          >
            Cadastrar Evento
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventoForm;