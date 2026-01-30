import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, Plus, Check, Lock, X, AlertCircle, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import { STATES } from '../constants';

const SellProperty: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [size, setSize] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [garage, setGarage] = useState('');
  const [state, setState] = useState('SP');
  const [city, setCity] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [listingType, setListingType] = useState<'venda' | 'aluguel'>('venda');
  const [images, setImages] = useState<string[]>([]);

  const isLoggedIn = !!user;

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate('/login?reason=sell&redirect=/vender');
    }
  }, [isLoggedIn, loading, navigate]);

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImages(prev => [...prev, event.target?.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      setError('Por favor, adicione pelo menos uma imagem.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { data, error: insertError } = await supabase
        .from('properties')
        .insert([
          {
            title,
            type,
            listing_type: listingType,
            price: parseFloat(price),
            description,
            size: parseInt(size),
            bedrooms: parseInt(bedrooms) || 0,
            bathrooms: parseInt(bathrooms) || 0,
            garage: parseInt(garage) || 0,
            images,
            location: { state, city, neighborhood },
            user_id: user?.id,
            featured: true
          } as any
        ]);

      if (insertError) throw insertError;

      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => navigate('/imoveis'), 2500);
    } catch (err: any) {
      setError(err.message || 'Erro ao publicar anúncio. Tente novamente.');
      setIsSubmitting(false);
    }
  };

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

  if (success) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center px-4 bg-gray-50">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-gray-100 text-center">
          <div className="bg-green-100 p-5 rounded-full inline-block mb-6">
            <Check className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Anúncio Enviado!</h2>
          <p className="text-gray-600 mb-8">
            Seu imóvel foi cadastrado com sucesso e já está disponível em nossa vitrine.
          </p>
          <div className="animate-pulse text-sm text-indigo-600 font-bold">Redirecionando para imóveis...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate('/')}
        className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 font-bold mb-10 transition-colors group"
      >
        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
        <span>Cancelar e Voltar</span>
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-indigo-600 p-8 text-white">
          <h1 className="text-3xl font-serif font-bold">Anunciar Meu Imóvel</h1>
          <p className="text-indigo-100 mt-2">Preencha os dados abaixo para colocar sua propriedade à venda ou para alugar na JE Imobiliária.</p>
        </div>

        {error && (
          <div className="m-8 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center">
            <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
          {/* Basic Info */}
          <section className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-indigo-600" />
              Informações Básicas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Título do Anúncio</label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Casa Moderna com Piscina"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Tipo de Imóvel</label>
                <select
                  required
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Selecione...</option>
                  <option value="Casa">Casa</option>
                  <option value="Apartamento">Apartamento</option>
                  <option value="Cobertura">Cobertura</option>
                  <option value="Terreno">Terreno</option>
                  <option value="Chácara">Chácara / Sítio</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Finalidade</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setListingType('venda')}
                    className={`p-4 rounded-2xl border-2 transition-all font-bold ${listingType === 'venda' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}
                  >
                    Venda
                  </button>
                  <button
                    type="button"
                    onClick={() => setListingType('aluguel')}
                    className={`p-4 rounded-2xl border-2 transition-all font-bold ${listingType === 'aluguel' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}
                  >
                    Aluguel
                  </button>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Descrição Detalhada</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva os diferenciais do imóvel..."
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              />
            </div>
          </section>

          {/* Location */}
          <section className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-indigo-600" />
              Localização
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Estado</label>
                <select
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Cidade</label>
                <input
                  required
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ex: São Paulo"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Bairro</label>
                <input
                  required
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Ex: Jardins"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </section>

          {/* Pricing & Size */}
          <section className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
              <Plus className="h-5 w-5 text-indigo-600" />
              Detalhes e Valor
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Valor (R$)</label>
                <input
                  required
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0,00"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Área (m²)</label>
                <input
                  required
                  type="number"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  placeholder="0"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Quartos</label>
                <input
                  required
                  type="number"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  placeholder="0"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Banheiros</label>
                <input
                  required
                  type="number"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  placeholder="0"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </section>

          {/* Photos */}
          <section className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-indigo-600" />
              Fotos do Imóvel
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <input
                type="file"
                hidden
                multiple
                ref={fileInputRef}
                onChange={handleImageAdd}
                accept="image/*"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:bg-indigo-50 hover:border-indigo-200 transition-all font-bold"
              >
                <Plus className="h-8 w-8 mb-2" />
                <span className="text-xs font-bold uppercase">Adicionar</span>
              </button>

              {images.map((img, index) => (
                <div key={index} className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center relative group overflow-hidden border border-gray-100 shadow-sm">
                  <img src={img} className="w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="text-white text-xs font-bold underline flex items-center gap-1 bg-black/20 p-2 rounded-lg"
                    >
                      <X className="h-4 w-4" />
                      Remover
                    </button>
                  </div>
                </div>
              ))}

              {images.length === 0 && (
                <div className="aspect-square bg-gray-50 rounded-2xl flex flex-col items-center justify-center border border-gray-100 italic text-gray-400 text-[10px] text-center p-4">
                  Nenhuma imagem selecionada
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 italic">Selecione uma ou mais fotos de alta qualidade.</p>
          </section>

          <div className="pt-10">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white py-6 rounded-2xl font-bold text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-4 border-white border-t-transparent" />
                  <span>Publicando...</span>
                </>
              ) : (
                <span>Publicar Anúncio Agora</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellProperty;
