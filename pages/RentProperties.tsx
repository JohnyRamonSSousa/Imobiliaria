import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Key, Lock, ArrowLeft, Search } from 'lucide-react';
import { PROPERTIES } from '../constants';
import PropertyCard from '../components/PropertyCard';
import PropertyModal from '../components/PropertyModal';
import { Property } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import { db } from '../services/database';

const RentProperties: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const [dbProperties, setDbProperties] = useState<Property[]>([]);
  const [soldIds, setSoldIds] = useState<string[]>([]);
  const [dbLoading, setDbLoading] = useState(true);
  const isLoggedIn = !!user;

  useEffect(() => {
    fetchDbProperties();
    setSoldIds(db.getSoldPropertyIds());
  }, []);

  const fetchDbProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('listing_type', 'aluguel')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
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
      console.error('Error fetching rentals from Supabase:', err);
    } finally {
      setDbLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate('/login?reason=rent&redirect=/aluguel');
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

  const queryParams = new URLSearchParams(location.search);
  const typeFilter = queryParams.get('type');

  const allRentals = [...dbProperties, ...PROPERTIES.filter(p => p.listingType === 'aluguel')].filter(p => !soldIds.includes(p.id.toString()));

  const rentalProperties = allRentals.filter(p => {
    if (!typeFilter) return true;
    return p.type === typeFilter;
  });

  return (
    <div className="pt-32 pb-24 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              <Key className="h-3.5 w-3.5" />
              Área de Aluguel Exclusiva
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">Alugue seu Próximo Lar</h1>
            <p className="text-gray-500 mt-2 text-lg">Confira nossa seleção exclusiva de imóveis premium para locação.</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 font-bold hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rentalProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
            />
          ))}
        </div>

        {!dbLoading && rentalProperties.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Search className="h-12 w-12 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900">Nenhum imóvel disponível para aluguel no momento.</h3>
            <p className="text-gray-500">Volte em breve para conferir novas oportunidades.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RentProperties;
