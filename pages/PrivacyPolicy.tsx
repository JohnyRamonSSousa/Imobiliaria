import React from 'react';
import { Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="pt-32 pb-24 min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 font-bold mb-8 transition-colors group"
                >
                    <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                    <span>Voltar</span>
                </button>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-indigo-600 p-8 text-white flex items-center gap-4">
                        <Lock className="h-10 w-10 text-indigo-200" />
                        <div>
                            <h1 className="text-3xl font-serif font-bold">Política de Privacidade</h1>
                            <p className="text-indigo-100">Em conformidade com a LGPD (Lei Geral de Proteção de Dados)</p>
                        </div>
                    </div>

                    <div className="p-8 md:p-12 prose prose-indigo max-w-none text-gray-600 space-y-8">
                        <section>
                            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">1. Coleta de Informações</h2>
                            <p>
                                Coletamos informações que você nos fornece diretamente ao se cadastrar em nossa plataforma, como nome completo, e-mail, telefone e detalhes sobre o imóvel de seu interesse ou que deseja anunciar.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">2. Uso das Informações</h2>
                            <p>
                                As informações coletadas são utilizadas para:
                            </p>
                            <ul className="list-disc pl-6 mt-4 space-y-2">
                                <li>Processar suas solicitações de compra e aluguel.</li>
                                <li>Conectar você a corretores e proprietários.</li>
                                <li>Enviar notificações sobre novos imóveis e atualizações de processos.</li>
                                <li>Melhorar nossa plataforma e serviços.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">3. Compartilhamento de Dados</h2>
                            <p>
                                Seus dados de contato podem ser compartilhados com consultores imobiliários parceiros apenas quando você demonstra interesse explícito em um imóvel através dos botões de contato ou formalização de proposta.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">4. Segurança dos Dados</h2>
                            <p>
                                Utilizamos medidas de segurança técnicas e administrativas para proteger seus dados pessoais contra acesso não autorizado, perda, alteração ou divulgação indevida.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">5. Seus Direitos</h2>
                            <p>
                                De acordo com a LGPD, você tem o direito de acessar, corrigir, excluir ou limitar o uso de seus dados pessoais. Para exercer esses direitos, entre em contato através de nosso canal de suporte.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">6. Cookies</h2>
                            <p>
                                Utilizamos cookies para melhorar sua experiência de navegação e entender como você utiliza nosso site. Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.
                            </p>
                        </section>

                        <section className="pt-8 border-t">
                            <p className="text-sm italic">
                                Ao utilizar nossa plataforma, você consente com a coleta e uso de informações conforme descrito nesta política.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
