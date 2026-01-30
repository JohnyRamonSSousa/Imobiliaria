import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Search, Filter, X } from 'lucide-react';
import { PROPERTIES, STATES } from '../constants';
import PropertyCard from '../components/PropertyCard';
import PropertyModal from '../components/PropertyModal';
import { Property } from '../types';
import { supabase } from '../services/supabase';
import { db } from '../services/database';

const PropertiesPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [dbProperties, setDbProperties] = useState<Property[]>([]);
  const [soldIds, setSoldIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    state: '',
    type: '',
    minBedrooms: 0,
    maxPrice: 10000000,
    listingType: 'venda' as 'venda' | 'aluguel' | ''
  });

  useEffect(() => {
    fetchDbProperties();
    setSoldIds(db.getSoldPropertyIds());
  }, []);

  const fetchDbProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        // Map DB fields to Property interface if necessary (handle snake_case to camelCase)
        const mapped: Property[] = data.map(p => ({
          id: p.id,
          title: p.title,
          type: p.type as any,
          listingType: p.listing_type as any,
          price: p.price,
          location: p.location,
          size: p.size,
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms || 0,
          garage: p.garage || 0,
          description: p.description,
          images: p.images,
          featured: p.featured
        }));
        setDbProperties(mapped);
      }
    } catch (err) {
      console.error('Error fetching properties from Supabase:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const state = params.get('state') || '';
    const type = params.get('type') || '';
    const priceRange = params.get('priceRange') || '';
    const lType = params.get('listingType') as any || 'venda';

    let maxPrice = 10000000;
    if (priceRange === 'low') maxPrice = 1000000;
    if (priceRange === 'mid') maxPrice = 3000000;

    setFilters(prev => ({
      ...prev,
      state: state,
      type: type,
      maxPrice: maxPrice,
      listingType: lType
    }));
  }, [location.search]);

  const allProperties = [...dbProperties, ...PROPERTIES].filter(p => !soldIds.includes(p.id.toString()));

  const filteredProperties = allProperties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = filters.state ? p.location.state === filters.state : true;
    const matchesType = filters.type ? p.type === filters.type : true;
    const matchesBeds = p.bedrooms >= filters.minBedrooms;
    const matchesPrice = p.price <= filters.maxPrice;
    const matchesListing = filters.listingType ? p.listingType === filters.listingType : true;

    return matchesSearch && matchesState && matchesType && matchesBeds && matchesPrice && matchesListing;
  });

  return (
    <div className="pt-24 min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 font-bold mb-8 transition-colors group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span>Voltar para Início</span>
        </button>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-12">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-grow relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Busque por título ou cidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <select
                value={filters.state}
                onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                className="px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
              >
                <option value="">Todos os Estados</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <select
                value={filters.listingType}
                onChange={(e) => setFilters({ ...filters, listingType: e.target.value as any })}
                className="px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium text-indigo-600 font-bold"
              >
                <option value="venda">Venda</option>
                <option value="aluguel">Aluguel</option>
              </select>

              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
              >
                <option value="">Todos os Tipos</option>
                <option value="Casa">Casa</option>
                <option value="Apartamento">Apartamento</option>
                <option value="Terreno">Terreno</option>
                <option value="Cobertura">Cobertura</option>
                <option value="Chácara">Chácara</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            {loading ? 'Carregando imóveis...' : `${filteredProperties.length} Imóveis Disponíveis`}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((p) => (
            <PropertyCard
              key={p.id}
              property={p}
            />
          ))}
        </div>

        {!loading && filteredProperties.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 inline-block">
              <X className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum imóvel encontrado</h3>
              <p className="text-gray-500">Tente ajustar seus filtros para encontrar o que procura.</p>
              <button
                onClick={() => { setSearchTerm(''); setFilters({ state: '', type: '', minBedrooms: 0, maxPrice: 10000000, listingType: 'venda' }) }}
                className="mt-6 text-indigo-600 font-bold hover:underline"
              >
                Limpar todos os filtros
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPage;
