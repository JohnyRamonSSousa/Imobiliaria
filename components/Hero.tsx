
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Home, DollarSign } from 'lucide-react';
import { STATES } from '../constants';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    state: '',
    type: '',
    priceRange: '',
    listingType: 'venda' as 'venda' | 'aluguel'
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.state) params.append('state', filters.state);
    if (filters.type) params.append('type', filters.type);
    if (filters.priceRange) params.append('priceRange', filters.priceRange);
    if (filters.listingType) params.append('listingType', filters.listingType);

    navigate(`/imoveis?${params.toString()}`);
  };

  return (
    <div className="relative h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-105"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")' }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 drop-shadow-lg leading-tight">
          Encontre o imóvel ideal para você e sua família
        </h1>
        <p className="text-lg md:text-xl text-gray-100 mb-10 max-w-2xl mx-auto font-light drop-shadow-md">
          Curadoria exclusiva dos melhores imóveis de luxo nas regiões mais valorizadas do país.
        </p>

        {/* Quick Search Bar */}
        <div className="bg-white/95 backdrop-blur-md p-4 md:p-6 rounded-2xl shadow-2xl mx-auto flex flex-col md:flex-row items-center gap-4">
          <div className="w-full md:w-1/5">
            <div className="flex bg-gray-50 border border-gray-200 p-1.5 rounded-xl">
              <button
                type="button"
                onClick={() => setFilters({ ...filters, listingType: 'venda' })}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${filters.listingType === 'venda' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Comprar
              </button>
              <button
                type="button"
                onClick={() => setFilters({ ...filters, listingType: 'aluguel' })}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${filters.listingType === 'aluguel' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Alugar
              </button>
            </div>
          </div>

          <div className="w-full md:w-1/5">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500" />
              <select
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 appearance-none text-gray-700 text-sm font-medium"
                value={filters.state}
                onChange={(e) => setFilters({ ...filters, state: e.target.value })}
              >
                <option value="">Estado</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="w-full md:w-1/5">
            <div className="relative">
              <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500" />
              <select
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 appearance-none text-gray-700 text-sm font-medium"
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option value="">Tipo</option>
                <option value="Casa">Casa</option>
                <option value="Apartamento">Apartamento</option>
                <option value="Cobertura">Cobertura</option>
                <option value="Terreno">Terreno</option>
              </select>
            </div>
          </div>

          <div className="w-full md:w-1/5">
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500" />
              <select
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 appearance-none text-gray-700 text-sm font-medium"
                value={filters.priceRange}
                onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
              >
                <option value="">Faixa de Preço</option>
                <option value="low">Até R$ 1M</option>
                <option value="mid">R$ 1M - R$ 3M</option>
                <option value="high">Acima de R$ 3M</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleSearch}
            className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center space-x-2 group shadow-lg shadow-indigo-100"
          >
            <Search className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span className="md:hidden lg:inline">Buscar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
