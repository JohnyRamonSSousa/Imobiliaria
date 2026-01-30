import React, { useState } from 'react';
import { X, MapPin, Maximize, BedDouble, Bath, Car, MessageCircle, Phone, Heart, Share2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Property } from '../types';
import { db } from '../services/database';
import { useAuth } from '../contexts/AuthContext';

interface PropertyModalProps {
  property: Property;
  onClose: () => void;
}

const PropertyModal: React.FC<PropertyModalProps> = ({ property, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  const isLoggedIn = !!user;

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(property.price);

  const priceSuffix = property.listingType === 'aluguel' ? '/mês' : '';

  const handleAction = (actionType: 'whatsapp' | 'call' | 'action') => {
    if (!isLoggedIn) {
      if (actionType === 'action') {
        const reason = property.listingType === 'venda' ? 'buy' : 'rent';
        const redirect = `/pagamento/${property.id}`;
        onClose();
        navigate(`/login?reason=${reason}&redirect=${encodeURIComponent(redirect)}`);
        return;
      }
      setShowLoginAlert(true);
      return;
    }

    if (actionType === 'whatsapp') {
      window.open(`https://wa.me/5511999999999`, '_blank');
    } else if (actionType === 'action') {
      onClose();
      navigate(`/pagamento/${property.id}`);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col md:flex-row">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/90 p-2 rounded-full hover:bg-white text-gray-900 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="w-full md:w-3/5 h-[300px] md:h-auto bg-gray-100">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full md:w-2/5 p-8 md:p-10 flex flex-col">
          {showLoginAlert && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3 items-start animate-bounce">
              <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-800">Acesso Restrito</p>
                <p className="text-xs text-amber-700 mb-3">Você precisa estar logado para ver detalhes de contato.</p>
                <div className="flex gap-4">
                  <button onClick={() => navigate('/login')} className="text-xs font-bold text-indigo-600 hover:underline">Ir para Login</button>
                  <button onClick={() => setShowLoginAlert(false)} className="text-xs font-bold text-gray-500 hover:underline">Fechar</button>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              {property.type} • {property.listingType === 'venda' ? 'Venda' : 'Aluguel'}
            </span>
            <div className="flex space-x-2">
              <button className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-red-500 transition-colors">
                <Heart className="h-5 w-5" />
              </button>
            </div>
          </div>

          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2 leading-tight">
            {property.title}
          </h2>

          <div className="flex items-center text-gray-500 mb-6">
            <MapPin className="h-4 w-4 mr-1.5 text-indigo-500" />
            <span className="text-sm">{property.location.neighborhood}, {property.location.city}</span>
          </div>

          <div className="text-3xl font-bold text-indigo-600 mb-8">
            {formattedPrice}<span className="text-sm text-gray-400 ml-1">{priceSuffix}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-2xl flex items-center space-x-3">
              <Maximize className="h-5 w-5 text-indigo-500" />
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">Área</p>
                <p className="text-sm font-bold text-gray-900">{property.size} m²</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl flex items-center space-x-3">
              <BedDouble className="h-5 w-5 text-indigo-500" />
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">Dorms</p>
                <p className="text-sm font-bold text-gray-900">{property.bedrooms} Qts</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-widest">Descrição</h4>
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
              {property.description}
            </p>
          </div>

          <div className="mt-auto space-y-3">
            <button
              onClick={() => handleAction('action')}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-indigo-100"
            >
              <span>{property.listingType === 'venda' ? 'Tenho Interesse / Comprar' : 'Quero Alugar'}</span>
            </button>
            <button
              onClick={() => handleAction('whatsapp')}
              className="w-full bg-green-500 text-white py-4 rounded-2xl font-bold hover:bg-green-600 transition-all flex items-center justify-center space-x-2"
            >
              <MessageCircle className="h-5 w-5" />
              <span>WhatsApp Consultor</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyModal;
