import React, { useState } from "react";
import { cpf } from "cpf-cnpj-validator";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import AdotanteService from "../services/AdotanteService";
import LoginService from "../services/LoginService"; // Importado
import useAuthStore from "../../../shared/store/AuthStore";
// import useUserStore from "../../../shared/store/UserStore"; // Removido
import { useAuth } from "../../../shared/context/AuthContext";

import Frame1 from "../assets/Frame1.png";

const AdotanteForm = () => {
  const navigate = useNavigate();
  const { setAuthData, fcmToken } = useAuthStore();
  // const { setMe } = useUserStore(); // Removido
  const { login } = useAuth();

  const [form, setForm] = useState({
    nomeAdotante: "",
    cpfAdotante: "",
    enderecoAdotante: "",
    celularAdotante: "",
    emailAdotante: "",
    descricaoOutrosAnimais: "",
    preferencia: "",
    senha: "",
    confirmSenha: "",
    termos: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmSenha, setShowConfirmSenha] = useState(false);

  const handleForm = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBack = () => navigate(-1);

  const enviaServidor = async (e) => {
    e.preventDefault();
    const tempErrors = {};

    // --- Lógica de Validação de Erros ---
    if (!form.nomeAdotante) tempErrors.nomeAdotante = "O nome é obrigatório!";
    if (!form.cpfAdotante) tempErrors.cpfAdotante = "O CPF é obrigatório!";
    else if (!cpf.isValid(form.cpfAdotante)) tempErrors.cpfAdotante = "CPF inválido!";
    const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;
    if (!form.emailAdotante) tempErrors.emailAdotante = "O e-mail é obrigatório!";
    else if (!emailRegex.test(form.emailAdotante))
      tempErrors.emailAdotante = "Digite um e-mail válido que termine com '.com'";
    if (!form.celularAdotante) tempErrors.celularAdotante = "O celular é obrigatório!";
    if (!form.enderecoAdotante) tempErrors.enderecoAdotante = "O endereço é obrigatório!";
    if (!form.descricaoOutrosAnimais)
      tempErrors.descricaoOutrosAnimais = "A descrição é obrigatória!";
    if (!form.preferencia) tempErrors.preferencia = "A preferência é obrigatória!";
    const senhaRegex = /^(?=.*[A-Za-z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!form.senha) tempErrors.senha = "A senha é obrigatória!";
    else if (!senhaRegex.test(form.senha))
      tempErrors.senha =
        "A senha deve ter no mínimo 8 caracteres, conter letras maiúsculas e minúsculas e pelo menos um caractere especial (@, #, !, etc).";
    if (!form.confirmSenha)
      tempErrors.confirmSenha = "A confirmação da senha é obrigatória!";
    else if (form.senha !== form.confirmSenha)
      tempErrors.confirmSenha = "As senhas não coincidem!";
    if (!form.termos) tempErrors.termos = "Você deve aceitar os termos de uso!";
    // ------------------------------------------------

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: form.nomeAdotante,
        email: form.emailAdotante,
        password: form.senha,
        cpf: form.cpfAdotante,
        endereco: form.enderecoAdotante,
        celular: form.celularAdotante,
        descricaoOutrosAnimais: form.descricaoOutrosAnimais,
        preferencia: form.preferencia,
      };

      console.log("Enviando requisição de registro de adotante...");
      // 1. CHAMA O REGISTRO
      // Esta função agora SÓ cadastra. Não esperamos um token dela.
      await AdotanteService.registerAdotante(payload);

      console.log("Cadastro realizado com sucesso! Iniciando login automático...");

      // 2. ✨ CORREÇÃO: FAZ O LOGIN AUTOMÁTICO
      // Agora chamamos o LoginService para obter o token
      const loginResponse = await LoginService.login({
        email: form.emailAdotante,
        password: form.senha,
      });

      const receivedToken = loginResponse.token; // Pegamos o token do LOGIN

      if (!receivedToken) throw new Error("Token não recebido após o LOGIN.");

      // ✨ 3. Decodificar o token para pegar o payload e o ID (subject)
      const decodedUser = jwtDecode(receivedToken);
      const userIdFromToken = decodedUser.sub; // Assumindo que o ID está no 'sub'

      if (!userIdFromToken) {
        throw new Error("ID do usuário (sub) não encontrado no token JWT.");
      }

      // ✨ 4. Salvar o token no AuthStore IMEDIATAMENTE
      console.log("Token recebido, salvando no AuthStore...");
      setAuthData(receivedToken, decodedUser);
      console.log("Token salvo no AuthStore.");

      // 5. Enviar token FCM (agora funciona)
      if (fcmToken) {
        console.log("Enviando token FCM...");
        await LoginService.sendToken({ fcmToken });
      }

      // 6. Buscar o resto dos dados do usuário (que vêm SEM o ID)
      console.log("Buscando informações completas do usuário (/me)...");
      const userInfo = await LoginService.me(); // {email, cpf, tipo}

      // ✨ 7. CORREÇÃO: Juntar o ID do token com os dados do /me
      const completeUser = {
        ...userInfo, // (email, cpf, tipo, etc.)
        id: userIdFromToken, // <-- Adicionar o ID que faltava
      };

      console.log("Usuário completo (com ID mergeado):", completeUser);

      // ✨ 8. Chamar o login do Contexto com o usuário COMPLETO
      console.log("Chamando login() do AuthContext para finalizar e redirecionar...");
      login(completeUser, receivedToken); // <-- Passando 'completeUser'

    } catch (err) {
      console.error("Erro no processo de cadastro/login:", err);
      setAuthData(null, null); // Limpa o token em caso de falha

      const backendMessage = err.response?.data?.message?.toLowerCase() || err.message.toLowerCase();
      const statusCode = err.response?.status;
      console.log("Status recebido:", statusCode);
      console.log("Mensagem do backend:", backendMessage);

      // Erro específico do novo passo de login
      if (backendMessage.includes("token não recebido")) {
           setErrors((prev) => ({
             ...prev,
             geral: "Cadastro realizado, mas o login automático falhou. Tente logar manualmente.",
           }));
      }
      else if (backendMessage.includes("não passaram na validação")) {
        setErrors((prev) => ({
          ...prev,
          senha:
            "Os dados enviados não passaram na validação. Verifique se a senha possui pelo menos 8 caracteres e um símbolo especial.",
        }));
      } else if (backendMessage.includes("cpf já cadastrado")) {
        setErrors((prev) => ({
          ...prev,
          cpfAdotante: "Este CPF já está cadastrado. Tente outro.",
        }));
      } else if (
        backendMessage.includes("email já cadastrado") ||
        backendMessage.includes("e-mail já cadastrado")
      ) {
        setErrors((prev) => ({
          ...prev,
          emailAdotante: "Este e-mail já está cadastrado. Tente outro.",
        }));
      } else if (statusCode === 409) {
        setErrors((prev) => ({
          ...prev,
          geral: "E-mail ou CPF já cadastrado. Tente novamente com outros dados.",
        }));
      } else if (backendMessage && err.response?.data?.message) {
        setErrors((prev) => ({
          ...prev,
          geral: err.response.data.message,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          geral: "E-mail ou CPF já cadastrado. Tente novamente.",
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (id, label, type = "text") => (
    <div className="mb-3.5">
      <label htmlFor={id} className="block text-black font-medium text-sm">
        {label}:
      </label>
      <input
        id={id}
        name={id}
        type={type}
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
          <h2 className="text-2xl font-bold">Crie uma conta de adotante!</h2>
          <h2 className="text-sm font-bold">
            Digite seus dados para cadastrar no aplicativo
          </h2>
        </div>

        <form onSubmit={enviaServidor} className="w-full">
          {renderInput("nomeAdotante", "Nome")}
          {renderInput("cpfAdotante", "CPF")}
          {renderInput("enderecoAdotante", "Endereço")}
          {renderInput("celularAdotante", "Celular")}
          {renderInput("emailAdotante", "E-mail", "email")}
          {renderInput("descricaoOutrosAnimais", "Descrição sobre outros animais")}
          {renderInput("preferencia", "Preferência")}

          {/* Senha */}
          <div className="mb-3.5 relative">
            <label htmlFor="senha" className="block text-black font-medium text-sm">
              Senha:
            </label>
            <input
              id="senha"
              name="senha"
              type={showSenha ? "text" : "password"}
              value={form.senha}
              onChange={handleForm}
              placeholder="Crie uma senha"
              className={`w-full text-base py-3.5 px-3 pr-10 rounded-md border-[1.5px] ${
                errors.senha ? "border-red-500" : "border-white/80"
              } bg-white/95 text-black`}
            />
            <button
              type="button"
              onClick={() => setShowSenha(!showSenha)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showSenha ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
            </button>
            {errors.senha && (
              <p className="text-red-600 text-xs mt-1">{errors.senha}</p>
            )}
          </div>

          {/* Confirmar Senha */}
          <div className="mb-3.5 relative">
            <label
              htmlFor="confirmSenha"
              className="block text-black font-medium text-sm"
            >
              Confirmar Senha:
            </label>
            <input
              id="confirmSenha"
              name="confirmSenha"
              type={showConfirmSenha ? "text" : "password"}
              value={form.confirmSenha}
              onChange={handleForm}
              placeholder="Repita a senha"
              className={`w-full text-base py-3.5 px-3 pr-10 rounded-md border-[1.e 5px] ${
                errors.confirmSenha ? "border-red-500" : "border-white/80"
              } bg-white/95 text-black`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmSenha(!showConfirmSenha)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showConfirmSenha ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
            </button>
            {errors.confirmSenha && (
              <p className="text-red-600 text-xs mt-1">{errors.confirmSenha}</p>
            )}
          </div>

          {/* Termos */}
          <div className="mb-2 flex items-center gap-2">
            <input
              id="termos"
              name="termos"
              type="checkbox"
              checked={form.termos}
              onChange={handleForm}
              className="w-6 h-6 border-gray-400 rounded cursor-pointer"
            />
            <label htmlFor="termos" className="text-base text-black cursor-pointer">
              Li e aceito os{" "}
              <Link
      to="/termos"   // <--- Aqui aponta para a página que criamos
      target="_blank" // <--- Abre em nova aba para não perder o cadastro
      rel="noopener noreferrer"
      className="underline text-blue-600 hover:text-blue-800"
              >
                termos de uso
              </Link>
            </label>
          </div>
          {errors.termos && (
            <p className="text-red-600 text-xs mt-1">{errors.termos}</p>
          )}

          {/* Erro geral */}
          {errors.geral && (
            <p className="text-red-600 text-sm text-center mt-2">{errors.geral}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full text-base rounded-2xl py-2.5 mt-4 bg-black text-white font-semibold cursor-pointer transition-colors hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>

          <p className="mt-6 text-lg text-gray-500 text-center">
            Já tem uma conta?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
              }}
              className="underline text-black hover:text-gray-700"
            >
              Faça login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdotanteForm;