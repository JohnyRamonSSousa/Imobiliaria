import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Key, Lock, ArrowLeft, Search } from 'lucide-react';
import { PROPERTIES } from '../constants';
import PropertyCard from '../components/PropertyCard';
import { Property } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/database';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db as firestoreDb } from '../services/firebase';

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
      const q = query(
        collection(firestoreDb, 'properties'),
        where('listing_type', '==', 'aluguel'),
        orderBy('created_at', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const mapped: Property[] = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          type: data.type,
          listingType: data.listing_type,
          price: data.price,
          location: data.location,
          size: data.size,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms || 0,
          garage: data.garage || 0,
          description: data.description,
          images: data.images,
          featured: data.featured
        };
      });
      setDbProperties(mapped);
    } catch (err) {
      console.error('Error fetching rentals from Firestore:', err);
    } finally {
      setDbLoading(false);
    }
  };

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
