
import React from 'react';
import { MapPin, Maximize, BedDouble, Bath, Car } from 'lucide-react';
import { Property } from '../types';
import { usePropertyDetails } from '../contexts/PropertyContext';

interface PropertyCardProps {
  property: Property;
  onClick?: (property: Property) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
  const { openPropertyDetails } = usePropertyDetails();
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(property.price);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
      <div className="relative h-64 overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-indigo-700 uppercase tracking-wider">
          {property.type}
        </div>
        {property.featured && (
          <div className="absolute top-4 right-4 bg-indigo-600 px-3 py-1 rounded-lg text-xs font-bold text-white uppercase tracking-wider">
            Destaque
          </div>
        )}
      </div>

      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <MapPin className="h-3.5 w-3.5 mr-1 text-indigo-400" />
          <span>{property.location.neighborhood}, {property.location.city} - {property.location.state}</span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
          {property.title}
        </h3>

        <p className="text-gray-500 text-sm line-clamp-2 mb-4">
          {property.description}
        </p>

        <div className="grid grid-cols-4 gap-2 mb-6 border-t border-b border-gray-50 py-4">
          <div className="flex flex-col items-center">
            <Maximize className="h-4 w-4 text-gray-400 mb-1" />
            <span className="text-[10px] uppercase font-bold text-gray-400">Área</span>
            <span className="text-xs font-semibold">{property.size}m²</span>
          </div>
          <div className="flex flex-col items-center border-l border-gray-50">
            <BedDouble className="h-4 w-4 text-gray-400 mb-1" />
            <span className="text-[10px] uppercase font-bold text-gray-400">Dorms</span>
            <span className="text-xs font-semibold">{property.bedrooms}</span>
          </div>
          <div className="flex flex-col items-center border-l border-gray-50">
            <Bath className="h-4 w-4 text-gray-400 mb-1" />
            <span className="text-[10px] uppercase font-bold text-gray-400">Banheiros</span>
            <span className="text-xs font-semibold">{property.bathrooms}</span>
          </div>
          <div className="flex flex-col items-center border-l border-gray-50">
            <Car className="h-4 w-4 text-gray-400 mb-1" />
            <span className="text-[10px] uppercase font-bold text-gray-400">Vagas</span>
            <span className="text-xs font-semibold">{property.garage}</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-bold text-indigo-600">{formattedPrice}</span>
          <button
            onClick={() => onClick ? onClick(property) : openPropertyDetails(property)}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-indigo-600 transition-colors"
          >
            Ver Detalhes
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
