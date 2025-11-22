import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPaw, FaArrowRight } from 'react-icons/fa';
import AuthImg from '../../features/splash/assets/Auth.png';
import Frame1 from "../../features/splash/assets/Frame1.png";

const Home = () => {
    const navigate = useNavigate();

    const handleCadastroClick = () => {
        navigate('/tipo-cadastro');
    };

    return (
        <div 
            className="relative flex items-center justify-center min-h-screen bg-cover bg-center p-5 sm:p-20 md:p-10 text-[#333]"
            style={{
                backgroundImage: `url(${AuthImg})`
            }}
        >
            {/* Container Reduzido para max-w-3xl (era 5xl) para ficar menos "gigante" */}
            <div className="relative z-10 w-full max-w-3xl bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up border border-white/50">
                
                {/* Faixa Decorativa Superior */}
                <div className="h-3 bg-gradient-to-r from-yellow-400 to-orange-500 w-full" />

                {/* Padding Reduzido de p-12/16 para p-8/10 */}
                <div className="p-6 md:p-10 text-center md:text-left">
                    
                    {/* --- CABEÇALHO --- */}
                    <div className="flex flex-col items-center mb-8">
                        <img 
                            src={Frame1} 
                            alt="Logo PetMatch" 
                            className="max-w-[150px] mb-4 hover:scale-105 transition-transform duration-300 drop-shadow-sm" 
                        />
                        
                        <h1 className="text-3xl md:text-4xl font-black text-gray-800 mb-3 tracking-tight">
                            Bem-vindo ao <span className="text-yellow-600">PetMatch!</span>
                        </h1>
                        
                        <div className="h-1 w-20 bg-yellow-400 rounded-full mb-5"></div>

                        <p className="text-base md:text-lg font-medium text-gray-600 max-w-2xl text-center leading-relaxed">
                            Nós da PetMatch acreditamos que todo animal merece encontrar sua família perfeita, e toda família merece a chance de viver esse amor!
                        </p>
                    </div>

                    {/* --- CORPO DO TEXTO --- */}
                    <div className="space-y-4 text-gray-700 text-sm md:text-base leading-relaxed text-justify md:text-center max-w-2xl mx-auto">
                        <p>
                            Nossa missão é simples e cheia de carinho: <strong>conectar tutores e suas almas gêmeas de quatro patas</strong>, facilitando o processo de adoção e dando mais visibilidade aos animais que hoje aguardam um lar em ONGs.
                        </p>
                        <p>
                            Queremos ser a plataforma referência em soluções digitais para adoção, criando pontes, aproximando pessoas e multiplicando finais felizes.
                        </p>
                    </div>

                    {/* --- SEÇÃO DE VALORES --- */}
                    <div className="mt-8 mb-8">
                        <h3 className="text-xl font-bold text-center text-gray-800 mb-6 flex items-center justify-center gap-2">
                            <FaPaw className="text-yellow-500" /> Nossos Valores
                        </h3>

                        {/* Grid ajustado para telas menores */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-100 flex flex-col items-center text-center hover:shadow-md transition-all">
                                <div className="bg-white p-2 rounded-full shadow-sm text-yellow-600 mb-2 text-xl">💛</div>
                                <h4 className="font-bold text-gray-800 text-sm mb-1">Empatia</h4>
                                <p className="text-xs text-gray-600 hidden sm:block">Respeito e sensibilidade.</p>
                            </div>

                            <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 flex flex-col items-center text-center hover:shadow-md transition-all">
                                <div className="bg-white p-2 rounded-full shadow-sm text-orange-500 mb-2 text-xl">🤝</div>
                                <h4 className="font-bold text-gray-800 text-sm mb-1">Responsabilidade</h4>
                                <p className="text-xs text-gray-600 hidden sm:block">Adoções conscientes.</p>
                            </div>

                            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex flex-col items-center text-center hover:shadow-md transition-all">
                                <div className="bg-white p-2 rounded-full shadow-sm text-blue-500 mb-2 text-xl">🌱</div>
                                <h4 className="font-bold text-gray-800 text-sm mb-1">Transparência</h4>
                                <p className="text-xs text-gray-600 hidden sm:block">Decisões seguras.</p>
                            </div>

                            <div className="bg-teal-50 p-3 rounded-xl border border-teal-100 flex flex-col items-center text-center hover:shadow-md transition-all md:col-span-1.5">
                                <div className="bg-white p-2 rounded-full shadow-sm text-teal-500 mb-2 text-xl">📣</div>
                                <h4 className="font-bold text-gray-800 text-sm mb-1">Colaboração</h4>
                                <p className="text-xs text-gray-600 hidden sm:block">Rede do bem.</p>
                            </div>

                            <div className="bg-purple-50 p-3 rounded-xl border border-purple-100 flex flex-col items-center text-center hover:shadow-md transition-all md:col-span-1.5 md:col-start-2 md:row-start-2 lg:col-auto lg:row-auto">
                                <div className="bg-white p-2 rounded-full shadow-sm text-purple-500 mb-2 text-xl">✨</div>
                                <h4 className="font-bold text-gray-800 text-sm mb-1">Inovação</h4>
                                <p className="text-xs text-gray-600 hidden sm:block">Transformando vidas.</p>
                            </div>
                        </div>
                    </div>

                    {/* --- CALL TO ACTION --- */}
                    <div className="text-center mt-8">
                        <p className="text-gray-600 mb-5 font-medium italic text-sm">
                            "Entre, explore e encontre o amigo que está esperando por você!<br/>
                            Porque aqui, todo match tem um propósito 🐶😺💖"
                        </p>

                        <button
                            onClick={handleCadastroClick}
                            className="group relative inline-flex items-center justify-center gap-3 px-8 py-3 font-bold text-white transition-all duration-300 bg-gray-900 rounded-full hover:bg-gray-800 hover:scale-105 shadow-lg hover:shadow-xl text-base"
                        >
                            <span>Comece a Adotar Agora!</span>
                            <div className="bg-yellow-500 rounded-full p-1 text-black group-hover:translate-x-1 transition-transform">
                                <FaArrowRight size={12} />
                            </div>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Home;