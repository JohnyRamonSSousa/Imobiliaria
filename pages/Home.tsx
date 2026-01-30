import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon, Key, Briefcase, BarChart3, ChevronRight, Map, Trees, ShieldCheck, ClipboardCheck } from 'lucide-react';
import Hero from '../components/Hero';
import PropertyCard from '../components/PropertyCard';
import PropertyModal from '../components/PropertyModal';
import ConsultantSection from '../components/ConsultantSection';
import Features from '../components/Features';
import { PROPERTIES } from '../constants';
import { Property } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';

import { usePropertyDetails } from '../contexts/PropertyContext';
import { db } from '../services/database';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openPropertyDetails } = usePropertyDetails();
  const [dbProperties, setDbProperties] = useState<Property[]>([]);
  const [soldIds, setSoldIds] = useState<string[]>([]);
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
      console.error('Error fetching properties from Supabase:', err);
    }
  };

  const allAvailableProperties = [...dbProperties, ...PROPERTIES].filter(p => !soldIds.includes(p.id.toString()));
  const featuredProperties = allAvailableProperties.filter(p => p.featured || dbProperties.includes(p)).slice(0, 3);
  const apartmentProperties = allAvailableProperties.filter(p => p.type === 'Apartamento').slice(0, 3);
  const ruralProperties = allAvailableProperties.filter(p => p.type === 'Terreno' || p.type === 'Chácara').slice(0, 3);

  const services = [
    { id: 'aluguel', title: 'Imóveis para Alugar', icon: <Key className="h-6 w-6" />, color: 'bg-emerald-50 text-emerald-600', path: '/aluguel', badge: 'Essencial' },
    { id: 'terreno', title: 'Alugar Terreno', icon: <Map className="h-6 w-6" />, color: 'bg-orange-50 text-orange-600', path: '/aluguel?type=Terreno' },
    { id: 'sitio', title: 'Alugar Chácara/Sítio', icon: <Trees className="h-6 w-6" />, color: 'bg-green-50 text-green-600', path: '/aluguel?type=Chácara', badge: 'Popular' },
    { id: 'adm', title: 'Administração', icon: <Briefcase className="h-6 w-6" />, color: 'bg-amber-50 text-amber-600', path: '/servico/administracao', badge: 'VIP' },
    { id: 'aval', title: 'Avaliação', icon: <BarChart3 className="h-6 w-6" />, color: 'bg-blue-50 text-blue-600', path: '/servico/avaliacao' },
    { id: 'vistoria', title: 'Vistoria', icon: <ClipboardCheck className="h-6 w-6" />, color: 'bg-purple-50 text-purple-600', path: '/servico/vistoria' },
  ];

  const handleServiceClick = (path: string) => {
    if (!isLoggedIn) {
      navigate(`/login?reason=services&redirect=${encodeURIComponent(path)}`);
    } else {
      navigate(path);
    }
  };

  return (
    <main className="pt-20">
      <Hero />

      {/* Services Section - Restricted access */}
      <section className="py-24 bg-white border-b border-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              <ShieldCheck className="h-3.5 w-3.5" />
              Área do Cliente
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
              Nossos Serviços Especializados
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Soluções completas para todas as suas necessidades imobiliárias. Faça login para acessar.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => handleServiceClick(service.path)}
                className="group flex flex-col items-center p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              >
                {service.badge && (
                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-600 text-white rounded-full animate-pulse">
                      {service.badge}
                    </span>
                  </div>
                )}

                <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm relative`}>
                  {service.badge && <div className="absolute inset-0 rounded-2xl bg-current opacity-10 animate-ping"></div>}
                  {service.icon}
                </div>
                <h3 className="text-sm font-bold text-gray-900 text-center leading-tight mb-4">{service.title}</h3>
                <div className="mt-auto text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="h-5 w-5" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section id="regioes" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              Vitrine JE
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
              Imóveis em Destaque
            </h2>
          </div>
          <button
            onClick={() => navigate('/imoveis')}
            className="text-indigo-600 font-bold hover:text-indigo-700 flex items-center space-x-2 group transition-colors"
          >
            <span>Ver todos os imóveis</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
            />
          ))}
        </div>
      </section>

      {/* Apartments Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                Lifestyle Urbano
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
                Apartamentos
              </h2>
              <p className="text-gray-500 mt-4 max-w-xl">
                As melhores opções de apartamentos em localizações privilegiadas, unindo sofisticação e praticidade.
              </p>
            </div>
            <button
              onClick={() => navigate('/imoveis?type=Apartamento')}
              className="text-blue-600 font-bold hover:text-blue-700 flex items-center space-x-2 group transition-colors"
            >
              <span>Ver todos os apartamentos</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {apartmentProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Rural Properties (Terrenos e Chácaras) Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                Vida no Campo & Investimento
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
                Terrenos & Chácaras
              </h2>
              <p className="text-gray-500 mt-4 max-w-xl">
                As melhores oportunidades para quem busca um novo refúgio ou um investimento sólido em grandes áreas.
              </p>
            </div>
            <button
              onClick={() => navigate('/imoveis?type=Terreno')}
              className="text-emerald-600 font-bold hover:text-emerald-700 flex items-center space-x-2 group transition-colors"
            >
              <span>Ver todos os terrenos</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ruralProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
              />
            ))}
          </div>
        </div>
      </section>

      <Features />
      <ConsultantSection />
    </main>
  );
};

export default HomePage;
