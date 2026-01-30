
export type PropertyType = 'Casa' | 'Apartamento' | 'Terreno' | 'Cobertura' | 'Chácara';
export type ListingType = 'venda' | 'aluguel';

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  listingType: ListingType;
  price: number;
  location: {
    state: string;
    city: string;
    neighborhood: string;
  };
  size: number;
  bedrooms: number;
  bathrooms: number;
  garage: number;
  description: string;
  images: string[];
  featured?: boolean;
}

export interface Consultant {
  id: string;
  name: string;
  role: string;
  region: string;
  photo: string;
  phone: string;
}

export interface SearchFilters {
  state: string;
  city: string;
  neighborhood: string;
  minPrice: number;
  maxPrice: number;
  type: string;
}
