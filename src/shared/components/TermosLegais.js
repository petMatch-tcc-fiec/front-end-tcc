// --- 1. IMPORTAÇÕES SIMPLIFICADAS ---
import React from "react";
import { ArrowLeft } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import Frame1 from '../../features/splash/assets/Frame1.png';

const TermosLegais = () => {
  const navigate = useNavigate();

  const handleBack = () => navigate(-1);

  // Estilo comum para os títulos das seções
  const sectionTitleStyle = "font-bold mt-4 mb-2 text-lg";
  // Estilo para o texto corrido
  const paragraphStyle = "mb-2 text-sm leading-relaxed text-justify";

  // --- 7. RENDERIZAÇÃO DO COMPONENTE (JSX) ---
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen p-5 sm:p-20 md:p-10 text-[#333]">
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 text-black rounded-lg hover:bg-gray-200 transition-colors z-50"
      >
        <ArrowLeft size={20} />
        <span className="text-lg font-medium">Voltar</span>
      </button>

      {/* Container Principal */}
      <div className="relative w-full max-w-[800px] min-w-[320px] p-0 animate-slideIn">
        {/* Cabeçalho com Logo */}
        <div className="flex flex-col items-center mb-7 text-black font-bold text-3xl text-shadow">
          <h2 className="logo-title text-6xl font-bold">PetMatch</h2>
          <img src={Frame1} alt="logo" className="max-w-[200px] mt-2.5" />
          <h2 className="text-2xl font-bold mt-4">Termos e Privacidade</h2>
        </div>

        {/* Container de Texto (Estilo Frame/Vidro) */}
        <div className="w-full bg-white/95 rounded-md border-[1.5px] border-white/80 text-black p-6 sm:p-8 shadow-lg overflow-y-auto max-h-[70vh]">
          
          {/* --- POLÍTICA DE PRIVACIDADE --- */}
          <section className="mb-10">
            <h1 className="text-2xl font-extrabold mb-1 text-center">POLÍTICA DE PRIVACIDADE — PETMATCH</h1>
            <p className="text-center text-sm font-medium mb-6 text-gray-600">Data de vigência: 24/11/2025</p>

            <h3 className={sectionTitleStyle}>1. APRESENTAÇÃO</h3>
            <p className={paragraphStyle}>
              Esta Política de Privacidade explica como o PetMatch coleta, usa, armazena e protege dados pessoais dos usuários. O PetMatch é um sistema acadêmico gratuito e social, desenvolvido como Trabalho de Conclusão de Curso Técnico em Informática pela Fundação Indaiatubana de Educação e Cultura (FIEC), localizada em Indaiatuba/SP.
            </p>

            <h3 className={sectionTitleStyle}>2. DADOS COLETADOS</h3>
            <p className={paragraphStyle}>
              São coletados: nome, CPF, endereço, e-mail, telefone, cidade, senha criptografada e informações sobre os animais cadastrados. Também podem ser coletados dados técnicos como IP e data/hora de acesso.
            </p>

            <h3 className={sectionTitleStyle}>3. FINALIDADE DO TRATAMENTO</h3>
            <p className={paragraphStyle}>
              Os dados são usados para cadastro, autenticação, exibição de perfis, funcionamento do sistema e segurança. Nenhum dado é usado para fins comerciais.
            </p>

            <h3 className={sectionTitleStyle}>4. BASE LEGAL</h3>
            <p className={paragraphStyle}>
              O tratamento é baseado no consentimento do usuário, execução de funcionalidades e cumprimento de obrigações legais, conforme a LGPD (Lei 13.709/2018).
            </p>

            <h3 className={sectionTitleStyle}>5. COMPARTILHAMENTO</h3>
            <p className={paragraphStyle}>
              Os dados não são vendidos nem compartilhados, exceto por obrigação legal ou manutenção técnica de infraestrutura.
            </p>

            <h3 className={sectionTitleStyle}>6. ARMAZENAMENTO E SEGURANÇA</h3>
            <p className={paragraphStyle}>
              Os dados são armazenados em ambiente seguro com criptografia e controle de acesso. Apesar das medidas, não há garantia absoluta contra incidentes, que serão comunicados conforme a LGPD.
            </p>

            <h3 className={sectionTitleStyle}>7. DIREITOS DO TITULAR</h3>
            <p className={paragraphStyle}>
              O usuário pode solicitar acesso, correção, exclusão ou portabilidade dos dados, além de revogar consentimento a qualquer momento, pelo canal de contato informado.
            </p>

            <h3 className={sectionTitleStyle}>8. RETENÇÃO DOS DADOS</h3>
            <p className={paragraphStyle}>
              Os dados são mantidos apenas pelo tempo necessário ao funcionamento da aplicação e depois excluídos ou anonimizados.
            </p>

            <h3 className={sectionTitleStyle}>9. COOKIES</h3>
            <p className={paragraphStyle}>
              Podem ser usados cookies para manter login ativo e gerar estatísticas. O usuário pode desativar cookies no navegador, ciente das limitações.
            </p>

            <h3 className={sectionTitleStyle}>10. MENORES DE IDADE</h3>
            <p className={paragraphStyle}>
              O uso é recomendado para maiores de 18 anos, com supervisão de responsáveis quando aplicável.
            </p>

            <h3 className={sectionTitleStyle}>11. ALTERAÇÕES</h3>
            <p className={paragraphStyle}>
              Esta Política pode ser atualizada. O uso contínuo do sistema implica concordância com as novas versões.
            </p>

            <h3 className={sectionTitleStyle}>12. CONTATO</h3>
            <p className={paragraphStyle}>
              Dúvidas ou solicitações devem ser enviadas para contato@fiec.edu.br.
            </p>

            <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-200">
              <h4 className="font-bold mb-2">Declaração de Consentimento</h4>
              <p className="text-sm">Ao utilizar o PetMatch, o usuário concorda com o tratamento de dados descrito nesta Política.</p>
            </div>
          </section>

          {/* Divisor visual */}
          <hr className="my-8 border-t-2 border-gray-300" />

          {/* --- TERMO DE USO --- */}
          <section>
            <h1 className="text-2xl font-extrabold mb-1 text-center">TERMO DE USO — PETMATCH</h1>
            <p className="text-center text-sm font-medium mb-6 text-gray-600">Data de vigência: 24/11/2025</p>

            <h3 className={sectionTitleStyle}>1. IDENTIFICAÇÃO</h3>
            <p className={paragraphStyle}>
              O presente Termo de Uso regula o acesso e utilização do PetMatch, sistema de divulgação e centralização de animais para adoção, desenvolvido como Trabalho de Conclusão de Curso Técnico em Informática pela Fundação Indaiatubana de Educação e Cultura (FIEC), localizada em Indaiatuba/SP.
            </p>
            <p className={paragraphStyle}>
              O PetMatch é uma aplicação web destinada exclusivamente a fins educacionais e sociais, sem fins lucrativos ou cobrança de qualquer valor pelos serviços prestados.
            </p>

            <h3 className={sectionTitleStyle}>2. ACEITAÇÃO DOS TERMOS</h3>
            <p className={paragraphStyle}>
              Ao acessar ou utilizar o PetMatch, o usuário declara ter lido, compreendido e concordado integralmente com os termos e condições descritos neste documento. Caso não concorde com qualquer das disposições, o usuário não deverá utilizar o sistema.
            </p>

            <h3 className={sectionTitleStyle}>3. FINALIDADE DO SISTEMA</h3>
            <p className={paragraphStyle}>
              O PetMatch tem como objetivo centralizar informações sobre animais disponíveis para adoção e facilitar a comunicação entre abrigos e adotantes.
            </p>
            <p className={paragraphStyle}>A plataforma permite:</p>
            <ul className="list-disc pl-5 mb-2 text-sm">
              <li>Cadastro de usuários (abrigos e adotantes);</li>
              <li>Publicação e visualização de animais para adoção;</li>
              <li>Indicação de interesse em adotar;</li>
              <li>Comunicação entre as partes envolvidas.</li>
            </ul>
            <p className={paragraphStyle}>
              O sistema é de uso gratuito e não realiza intermediação financeira entre usuários.
            </p>

            <h3 className={sectionTitleStyle}>4. CADASTRO E RESPONSABILIDADE DO USUÁRIO</h3>
            <p className={paragraphStyle}>
              Para utilizar determinadas funcionalidades do PetMatch, é necessário realizar um cadastro com informações pessoais (como nome, e-mail, telefone e cidade).
            </p>
            <p className={paragraphStyle}>O usuário é responsável por:</p>
            <ul className="list-disc pl-5 mb-2 text-sm">
              <li>Fornecer informações verdadeiras, completas e atualizadas;</li>
              <li>Manter a confidencialidade de sua senha e acesso;</li>
              <li>Utilizar a plataforma de forma ética, respeitosa e legal;</li>
              <li>Não publicar conteúdos ofensivos, falsos, ilegais ou que infrinjam direitos de terceiros.</li>
            </ul>
            <p className={paragraphStyle}>
              A equipe do PetMatch reserva-se o direito de suspender ou excluir contas que violem estes Termos ou utilizem o sistema de forma indevida.
            </p>

            <h3 className={sectionTitleStyle}>5. PROPRIEDADE INTELECTUAL</h3>
            <p className={paragraphStyle}>
              Todo o conteúdo do PetMatch — incluindo design, código-fonte, textos, logotipos, ícones e imagens — é protegido por direitos autorais e de propriedade intelectual, pertencentes aos autores do projeto e/ou às instituições envolvidas.
            </p>
            <p className={paragraphStyle}>
              É proibida a reprodução, distribuição, modificação ou uso comercial de qualquer parte do sistema sem autorização expressa da equipe responsável.
            </p>

            <h3 className={sectionTitleStyle}>6. PRIVACIDADE E PROTEÇÃO DE DADOS</h3>
            <p className={paragraphStyle}>
              O PetMatch realiza coleta e tratamento de dados pessoais apenas para fins de funcionamento da plataforma.
            </p>
            <p className={paragraphStyle}>As informações fornecidas pelos usuários são utilizadas para:</p>
            <ul className="list-disc pl-5 mb-2 text-sm">
              <li>Identificação e autenticação de acesso;</li>
              <li>Exibição de perfis e anúncios de adoção;</li>
              <li>Contato entre usuários interessados na adoção.</li>
            </ul>
            <p className={paragraphStyle}>
              Os dados não são compartilhados com terceiros, salvo em cumprimento de obrigação legal. O tratamento segue os princípios da Lei nº 13.709/2018 — Lei Geral de Proteção de Dados (LGPD). Para mais detalhes, recomenda-se a leitura da Política de Privacidade específica do PetMatch.
            </p>

            <h3 className={sectionTitleStyle}>7. LIMITAÇÃO DE RESPONSABILIDADE</h3>
            <p className={paragraphStyle}>
              O PetMatch é um sistema experimental, em ambiente acadêmico, fornecido “no estado em que se encontra”, sem garantias de disponibilidade contínua ou ausência de falhas técnicas.
            </p>
            <p className={paragraphStyle}>A equipe responsável não se responsabiliza por:</p>
            <ul className="list-disc pl-5 mb-2 text-sm">
              <li>Ações ou omissões dos usuários;</li>
              <li>Informações falsas ou incorretas inseridas por terceiros;</li>
              <li>Perdas, danos ou prejuízos decorrentes do uso do sistema;</li>
              <li>Conteúdos externos ou links publicados pelos usuários.</li>
            </ul>
            <p className={paragraphStyle}>
              A adoção de animais é uma decisão pessoal e deve ser conduzida com responsabilidade, sendo o PetMatch apenas um meio de divulgação.
            </p>

            <h3 className={sectionTitleStyle}>8. ALTERAÇÕES NOS TERMOS</h3>
            <p className={paragraphStyle}>
              Os presentes Termos de Uso podem ser atualizados periodicamente. As alterações entram em vigor na data de sua publicação no site. O uso contínuo do PetMatch após as modificações implica concordância com os novos termos.
            </p>

            <h3 className={sectionTitleStyle}>9. LEGISLAÇÃO APLICÁVEL E FORO</h3>
            <p className={paragraphStyle}>
              Este Termo é regido pelas leis da República Federativa do Brasil, especialmente pela Lei nº 13.709/2018 (LGPD) e pelo Código Civil Brasileiro. Fica eleito o foro da Comarca de Indaiatuba/SP para dirimir quaisquer dúvidas ou controvérsias decorrentes deste documento.
            </p>

            <h3 className={sectionTitleStyle}>10. CONTATO</h3>
            <p className={paragraphStyle}>
              Em caso de dúvidas, sugestões ou solicitações relacionadas a este Termo de Uso, o usuário poderá entrar em contato com a equipe do projeto por meio do e-mail institucional da Fundação Indaiatubana de Educação e Cultura (FIEC) ou pelo canal de suporte disponível na aplicação.
            </p>

            <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-200">
              <h4 className="font-bold mb-2">Declaração de Concordância</h4>
              <p className="text-sm">Ao utilizar o PetMatch, o usuário declara estar ciente e de acordo com todas as condições estabelecidas neste Termo de Uso.</p>
            </div>
          </section>
          
        </div>
      </div>
    </div>
  );
};

export default TermosLegais;