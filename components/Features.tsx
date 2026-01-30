
import React from 'react';
import { ShieldCheck, Zap, Users, Search } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: <Users className="h-8 w-8 text-indigo-600" />,
      title: "Atendimento Personalizado",
      description: "Entendemos suas necessidades específicas para encontrar o imóvel que realmente combina com seu estilo de vida."
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-indigo-600" />,
      title: "Segurança e Transparência",
      description: "Processos jurídicos rigorosos e total clareza em todas as etapas da negociação, garantindo sua paz de espírito."
    },
    {
      icon: <Zap className="h-8 w-8 text-indigo-600" />,
      title: "Variedade de Imóveis",
      description: "Acesso exclusivo a propriedades que não estão no mercado comum, incluindo pré-lançamentos e mansões de alto luxo."
    },
    {
      icon: <Search className="h-8 w-8 text-indigo-600" />,
      title: "Suporte Completo",
      description: "Do primeiro contato ao pós-venda, oferecemos suporte em documentação, financiamento e reformas."
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              Por que nos escolher?
            </div>
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6 leading-tight">
              Excelência e Credibilidade no Mercado Imobiliário de Luxo
            </h2>
            <p className="text-gray-500 text-lg mb-10 leading-relaxed">
              Com anos de experiência no segmento premium, a LuxuryState se consolidou como referência em negociações complexas e propriedades exclusivas.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {features.map((f, i) => (
                <div key={i} className="flex flex-col">
                  <div className="mb-4">{f.icon}</div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Luxury House" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-indigo-600 p-8 rounded-3xl shadow-xl hidden md:block max-w-[280px]">
              <p className="text-white text-3xl font-bold mb-2">+10 Anos</p>
              <p className="text-indigo-100 text-sm uppercase font-bold tracking-wider">De experiência transformando sonhos em realidade</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
