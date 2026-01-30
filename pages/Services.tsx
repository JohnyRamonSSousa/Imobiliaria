import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Home,
  Key,
  Search,
  ClipboardCheck,
  BarChart3,
  ArrowRight,
  Lock,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const isLoggedIn = !!user;
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate('/login?reason=services&redirect=/servicos');
    }
  }, [isLoggedIn, loading, navigate]);

  if (loading || !isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Lock className="h-12 w-12 text-indigo-600 mx-auto mb-4 animate-bounce" />
          <h2 className="text-xl font-bold text-gray-900">
            {loading ? 'Carregando...' : 'Acesso Restrito'}
          </h2>
          <p className="text-gray-500">
            {loading ? 'Verificando sua sessão...' : 'Redirecionando para login...'}
          </p>
        </div>
      </div>
    );
  }

  const handleServiceClick = (action: string) => {
    if (action === 'venda') navigate('/imoveis');
    else if (action === 'aluguel') navigate('/aluguel');
    else {
      navigate(`/servico/${action.toLowerCase()}`);
    }
  };

  const services = [
    {
      id: 'venda',
      title: 'Imóveis à Venda',
      description: 'Explore nossa curadoria de mansões, coberturas e casas de alto padrão prontas para morar.',
      icon: <Home className="h-8 w-8 text-indigo-600" />,
      tag: 'Catálogo',
      color: 'bg-indigo-50'
    },
    {
      id: 'aluguel',
      title: 'Imóveis para Alugar',
      description: 'Acesse ofertas exclusivas de locação premium com contratos flexíveis e suporte total.',
      icon: <Key className="h-8 w-8 text-emerald-600" />,
      tag: 'Locação',
      color: 'bg-emerald-50'
    },
    {
      id: 'administracao',
      title: 'Administração de Imóveis',
      description: 'Gestão completa do seu patrimônio: desde a seleção do inquilino até a manutenção preventiva.',
      icon: <Briefcase className="h-8 w-8 text-amber-600" />,
      tag: 'Gestão',
      color: 'bg-amber-50'
    },
    {
      id: 'avaliacao',
      title: 'Avaliação de Imóveis',
      description: 'Saiba o valor real de mercado do seu imóvel com laudos técnicos baseados em Big Data.',
      icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
      tag: 'Especializado',
      color: 'bg-blue-50'
    },
    {
      id: 'vistoria',
      title: 'Vistoria Profissional',
      description: 'Relatórios detalhados com fotos e análises estruturais para garantir a segurança da negociação.',
      icon: <ClipboardCheck className="h-8 w-8 text-purple-600" />,
      tag: 'Segurança',
      color: 'bg-purple-50'
    }
  ];

  return (
    <div className="pt-32 pb-24 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <ShieldCheck className="h-3.5 w-3.5" />
            Central do Cliente
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6">
            Nossos Serviços
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Soluções completas e personalizadas para proprietários, investidores e quem busca um novo lar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => handleServiceClick(service.id)}
              className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col h-full"
            >
              <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {service.icon}
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{service.tag}</span>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors">
                {service.title}
              </h3>

              <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-grow">
                {service.description}
              </p>

              <div className="pt-6 border-t border-gray-50 flex items-center justify-between text-indigo-600 font-bold text-sm">
                <span>Acessar Serviço</span>
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}

          {/* Decorative Card */}
          <div className="bg-indigo-900 rounded-3xl p-8 text-white flex flex-col justify-center relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShieldCheck className="h-32 w-32" />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-4">Atendimento VIP</h3>
            <p className="text-indigo-100 text-sm mb-8 leading-relaxed">
              Precisa de um serviço sob medida que não está listado aqui? Fale diretamente com nossa diretoria.
            </p>
            <button
              onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
              className="bg-white text-indigo-900 py-3 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors"
            >
              Solicitar Consultoria
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
