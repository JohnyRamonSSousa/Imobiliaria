import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsOfUse: React.FC = () => {
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
            <Shield className="h-10 w-10 text-indigo-200" />
            <div>
              <h1 className="text-3xl font-serif font-bold">Termos de Uso</h1>
              <p className="text-indigo-100">Última atualização: 26 de Janeiro de 2026</p>
            </div>
          </div>

          <div className="p-8 md:p-12 prose prose-indigo max-w-none text-gray-600 space-y-8">
            <section>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e usar a plataforma JE Imobiliária, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar nosso site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">2. Uso da Plataforma</h2>
              <p>
                A JE Imobiliária fornece uma plataforma para visualização, compra, venda e aluguel de imóveis. Você concorda em usar o site apenas para fins legítimos e de acordo com todas as leis aplicáveis.
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Você deve ter pelo menos 18 anos de idade para realizar transações.</li>
                <li>É proibido fornecer informações falsas ou enganosas.</li>
                <li>É proibido tentar interferir na segurança ou integridade da plataforma.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">3. Cadastro e Segurança</h2>
              <p>
                Para acessar certas funcionalidades, você pode precisar criar uma conta. Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrem em sua conta.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">4. Propriedade Intelectual</h2>
              <p>
                Todo o conteúdo presente no site, incluindo textos, gráficos, logotipos e imagens, é propriedade da JE Imobiliária ou de seus licenciadores e está protegido por leis de direitos autorais.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">5. Limitação de Responsabilidade</h2>
              <p>
                Embora nos esforcemos para manter as informações precisas e atualizadas, a JE Imobiliária não garante a exatidão ou completude de qualquer anúncio de terceiros. As transações imobiliárias são de responsabilidade das partes envolvidas.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">6. Modificações</h2>
              <p>
                Reservamo-nos o direito de modificar estes termos a qualquer momento. O uso continuado da plataforma após tais mudanças constitui sua aceitação dos novos termos.
              </p>
            </section>

            <section className="pt-8 border-t">
              <p className="text-sm italic">
                Para dúvidas sobre estes termos, entre em contato conosco através de nossos canais oficiais de suporte.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;
