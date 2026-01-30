import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Briefcase,
    BarChart3,
    ClipboardCheck,
    ShieldCheck,
    CheckCircle2,
    Send,
    User,
    Mail,
    Phone,
    MessageSquare
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SERVICE_DATA: Record<string, any> = {
    'administracao': {
        title: 'Administração de Imóveis',
        description: 'Gestão completa do seu patrimônio com transparência e eficiência.',
        icon: <Briefcase className="h-12 w-12 text-amber-600" />,
        color: 'bg-amber-50',
        benefits: [
            'Seleção rigorosa de inquilinos com análise de crédito',
            'Vistoria fotográfica detalhada na entrada e saída',
            'Gestão de recebíveis e repasses pontuais',
            'Assessoria jurídica para contratos e cobranças',
            'Manutenção preventiva e corretiva garantida'
        ]
    },
    'avaliacao': {
        title: 'Avaliação de Imóveis',
        description: 'Saiba o valor real de mercado do seu imóvel com precisão técnica.',
        icon: <BarChart3 className="h-12 w-12 text-blue-600" />,
        color: 'bg-blue-50',
        benefits: [
            'Laudo técnico assinado por peritos avaliadores',
            'Análise comparativa de mercado em tempo real',
            'Estudo de viabilidade econômica e liquidez',
            'Utilização de Big Data e inteligência imobiliária',
            'Documentação válida para fins judiciais e bancários'
        ]
    },
    'vistoria': {
        title: 'Vistoria Profissional',
        description: 'Segurança absoluta para proprietários e inquilinos em cada detalhe.',
        icon: <ClipboardCheck className="h-12 w-12 text-purple-600" />,
        color: 'bg-purple-50',
        benefits: [
            'Relatórios digitais com centenas de fotos em alta resolução',
            'Verificação técnica de elétrica, hidráulica e estrutura',
            'Termo de entrega de chaves com check-list rigoroso',
            'Assinatura digital com validade jurídica (ICP-Brasil)',
            'Prevenção de conflitos e garantia do estado do imóvel'
        ]
    }
};

const ServiceDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const service = id ? SERVICE_DATA[id] : null;

    useEffect(() => {
        if (!service && id !== 'all') {
            navigate('/servicos');
        }
    }, [id, service, navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setSuccess(true);
        }, 2000);
    };

    if (!service) return null;

    if (success) {
        return (
            <div className="min-h-screen pt-32 pb-24 flex items-center justify-center px-4 bg-gray-50">
                <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-gray-100 text-center animate-in zoom-in duration-500">
                    <div className="bg-green-100 p-5 rounded-full inline-block mb-6">
                        <CheckCircle2 className="h-12 w-12 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Solicitação Enviada!</h2>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Recebemos seu interesse em <strong>{service.title}</strong>. Um de nossos especialistas entrará em contato em breve para dar seguimento ao seu atendimento.
                    </p>
                    <button
                        onClick={() => navigate('/servicos')}
                        className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all"
                    >
                        Voltar para Serviços
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-24 min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 font-bold mb-8 transition-colors group"
                >
                    <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                    <span>Voltar</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Service Info */}
                    <div className="lg:col-span-7 space-y-10">
                        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
                            <div className={`w-24 h-24 ${service.color} rounded-3xl flex items-center justify-center mb-8`}>
                                {service.icon}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
                                {service.title}
                            </h1>
                            <p className="text-xl text-gray-500 leading-relaxed mb-10">
                                {service.description}
                            </p>

                            <div className="space-y-6">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b pb-2">O que você terá:</h3>
                                <ul className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                    {service.benefits.map((benefit: string, idx: number) => (
                                        <li key={idx} className="flex items-start gap-4">
                                            <div className="mt-1 bg-green-100 p-1 rounded-full">
                                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                            </div>
                                            <span className="text-gray-700 font-medium">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-indigo-900 p-8 rounded-3xl text-white shadow-lg flex items-center gap-6 relative overflow-hidden">
                            <ShieldCheck className="h-12 w-12 text-indigo-400 shrink-0" />
                            <div className="relative z-10">
                                <h4 className="font-bold text-lg mb-1">Qualidade Garantida JE</h4>
                                <p className="text-sm text-indigo-200">Nossos processos são auditados e seguem rigorosamente as normas do COFECI e a LGPD.</p>
                            </div>
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <ShieldCheck className="h-32 w-32" />
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 sticky top-32">
                            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Solicitar Orçamento</h2>
                            <p className="text-gray-500 text-sm mb-8">Preencha os campos abaixo e entraremos em contato.</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nome Completo</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            required
                                            type="text"
                                            defaultValue={user?.user_metadata?.full_name}
                                            placeholder="Como podemos te chamar?"
                                            className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">E-mail</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            required
                                            type="email"
                                            defaultValue={user?.email}
                                            placeholder="seu@email.com"
                                            className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Telefone / WhatsApp</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            required
                                            type="tel"
                                            placeholder="(00) 00000-0000"
                                            className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Mensagem Adicional (Opcional)</label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                                        <textarea
                                            rows={3}
                                            placeholder="Conte-nos um pouco mais sobre sua necessidade..."
                                            className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                                            <span>Enviando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-5 w-5" />
                                            <span>Enviar Solicitação</span>
                                        </>
                                    )}
                                </button>
                            </form>

                            <p className="mt-6 text-[10px] text-gray-400 text-center leading-relaxed">
                                Ao enviar este formulário, você concorda com nossa <a href="#/privacidade" className="underline hover:text-indigo-600">Política de Privacidade</a> e autoriza o contato de nossos consultores.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetailPage;
