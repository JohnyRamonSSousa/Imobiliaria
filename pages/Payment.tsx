import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, CreditCard, Landmark, QrCode, FileText, CheckCircle2, MapPin } from 'lucide-react';
import { PROPERTIES } from '../constants';
import { Property } from '../types';
import { db } from '../services/database';
import { useAuth } from '../contexts/AuthContext';

const PaymentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('financing');

  useEffect(() => {
    const found = PROPERTIES.find(p => p.id === id);
    if (found) {
      setProperty(found);
    } else {
      navigate('/imoveis');
    }
  }, [id, navigate]);

  const formattedPrice = property ? new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(property.price) : '';

  const reservationFee = property ? new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(property.price * 0.01) : ''; // 1% reservation fee simulation

  const handleProcessProposal = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {

      try {
        // Save transaction
        if (property && user) {
          db.saveTransaction(property, property.listingType === 'venda' ? 'sale' : 'rent', {
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Cliente',
            email: user.email || 'cliente@exemplo.com'
          }, 'pending');
        }
        setStep(3);
      } catch (error) {
        console.error("Payment error:", error);
        alert("Erro ao processar pagamento. Tente novamente.");
      } finally {
        setIsSubmitting(false);
      }
    }, 2000);
  };

  if (!property) return null;

  return (
    <div className="pt-32 pb-24 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {step < 3 && (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 font-bold mb-8 transition-colors group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span>Voltar para o Imóvel</span>
          </button>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Content */}
          <div className={`${step === 3 ? 'lg:col-span-12' : 'lg:col-span-8'}`}>

            {step === 1 && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                  <h1 className="text-2xl font-serif font-bold text-gray-900">
                    {property.listingType === 'venda' ? 'Formalizar Proposta & Reserva' : 'Formalizar Interesse em Aluguel'}
                  </h1>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">Passo 1 de 2</span>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">CPF</label>
                      <input required type="text" placeholder="000.000.000-00" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Estado Civil</label>
                      <select required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="">Selecione...</option>
                        <option value="single">Solteiro(a)</option>
                        <option value="married">Casado(a)</option>
                        <option value="divorced">Divorciado(a)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Profissão</label>
                    <input required type="text" placeholder="Sua ocupação principal" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>

                  <div className="bg-indigo-50 p-6 rounded-2xl">
                    <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5" />
                      Garantia de Segurança
                    </h3>
                    <p className="text-sm text-indigo-700 leading-relaxed">
                      Seus dados são criptografados e serão utilizados exclusivamente para a análise de crédito e formalização do contrato de {property.listingType === 'venda' ? 'compra e venda' : 'locação'} pela nossa equipe jurídica.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                  >
                    Próximo Passo
                  </button>
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                  <h1 className="text-2xl font-serif font-bold text-gray-900">Forma de Pagamento & Reserva</h1>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">Passo 2 de 2</span>
                </div>

                <div className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => setPaymentMethod('financing')}
                      className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${paymentMethod === 'financing' ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                      <Landmark className={`h-8 w-8 ${paymentMethod === 'financing' ? 'text-indigo-600' : 'text-gray-400'}`} />
                      <span className="text-sm font-bold text-gray-900">Financiamento</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('pix')}
                      className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${paymentMethod === 'pix' ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                      <QrCode className={`h-8 w-8 ${paymentMethod === 'pix' ? 'text-indigo-600' : 'text-gray-400'}`} />
                      <span className="text-sm font-bold text-gray-900">Pix / À Vista</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('consortium')}
                      className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${paymentMethod === 'consortium' ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                      <FileText className={`h-8 w-8 ${paymentMethod === 'consortium' ? 'text-indigo-600' : 'text-gray-400'}`} />
                      <span className="text-sm font-bold text-gray-900">Consórcio</span>
                    </button>
                    {property.listingType === 'aluguel' && (
                      <div className="md:col-span-3 p-4 bg-amber-50 text-amber-700 text-xs rounded-xl border border-amber-100 italic">
                        Nota: Para aluguel, as opções acima representam sua preferência de garantia/pagamento inicial.
                      </div>
                    )}
                  </div>

                  <div className="p-6 bg-gray-50 rounded-2xl space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">{property.listingType === 'venda' ? 'Valor da Reserva (1%)' : 'Taxa de Reserva / Caução'}</span>
                      <span className="font-bold text-gray-900">{reservationFee}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Taxa de Formalização</span>
                      <span className="font-bold text-green-600 text-xs uppercase">Grátis</span>
                    </div>
                    <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                      <span className="font-bold text-gray-900 uppercase text-xs tracking-widest">Total Imediato</span>
                      <span className="text-2xl font-bold text-indigo-600">{reservationFee}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 text-center pt-2">
                      Ao pagar a reserva, o imóvel ficará bloqueado para outros interessados por 7 dias úteis enquanto analisamos sua documentação.
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <button
                      onClick={handleProcessProposal}
                      disabled={isSubmitting}
                      className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-3"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                          <span>Processando...</span>
                        </>
                      ) : (
                        <span>Enviar Proposta e Pagar Reserva</span>
                      )}
                    </button>
                    <button
                      onClick={() => setStep(1)}
                      className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors py-2"
                    >
                      Alterar Dados Pessoais
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white rounded-3xl shadow-xl p-12 border border-gray-100 text-center animate-in zoom-in duration-500">
                <div className="flex justify-center mb-8">
                  <div className="bg-green-100 p-6 rounded-full">
                    <CheckCircle2 className="h-16 w-16 text-green-600" />
                  </div>
                </div>
                <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Proposta Enviada com Sucesso!</h2>
                <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
                  Parabéns! Sua proposta para o imóvel <span className="font-bold text-gray-900">"{property.title}"</span> foi recebida. Um consultor entrará em contato em até 24h para os próximos passos.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                  >
                    Ir para Minha Conta
                  </button>
                  <button
                    onClick={() => navigate('/imoveis')}
                    className="px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all"
                  >
                    Explorar Imóveis
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Summary */}
          {step < 3 && (
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-32">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 pb-2 border-b">Resumo do Imóvel</h3>

                <div className="aspect-video rounded-xl overflow-hidden mb-4">
                  <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-gray-900 leading-tight">{property.title}</h4>
                    <div className="flex items-center text-gray-500 text-xs mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{property.location.neighborhood}, {property.location.city}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-400 uppercase font-bold">{property.listingType === 'venda' ? 'Preço de Venda' : 'Preço do Aluguel'}</span>
                    </div>
                    <div className="text-2xl font-bold text-indigo-600">{formattedPrice}{property.listingType === 'aluguel' && <span className="text-xs text-gray-400 ml-1">/mês</span>}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 text-xs font-bold text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                      <span>{property.size} m²</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                      <span>{property.bedrooms} Quartos</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-900 p-6 rounded-3xl text-white shadow-lg flex items-center gap-4">
                <ShieldCheck className="h-10 w-10 text-indigo-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">Transação Segura</h4>
                  <p className="text-[10px] text-indigo-200">Plataforma auditada conforme LGPD e normas do COFECI/CRECI.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
