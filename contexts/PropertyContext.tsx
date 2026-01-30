import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Property } from '../types';
import { PROPERTIES } from '../constants';
import { supabase } from '../services/supabase';

interface PropertyContextType {
    selectedProperty: Property | null;
    openPropertyDetails: (property: Property) => void;
    openPropertyDetailsById: (id: string) => Promise<void>;
    closePropertyDetails: () => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

    const openPropertyDetails = (property: Property) => {
        setSelectedProperty(property);
    };

    const openPropertyDetailsById = async (id: string) => {
        // 1. Check local constants
        const foundLocal = PROPERTIES.find(p => p.id === id);
        if (foundLocal) {
            setSelectedProperty(foundLocal);
            return;
        }

        // 2. Check Supabase
        try {
            const { data, error } = await supabase
                .from('properties')
                .select('*')
                .eq('id', id)
                .single();

            if (data && !error) {
                const mapped: Property = {
                    id: data.id,
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
                setSelectedProperty(mapped);
            }
        } catch (err) {
            console.error('Error fetching property by ID:', err);
        }
    };

    const closePropertyDetails = () => {
        setSelectedProperty(null);
    };

    return (
        <PropertyContext.Provider value={{ selectedProperty, openPropertyDetails, openPropertyDetailsById, closePropertyDetails }}>
            {children}
        </PropertyContext.Provider>
    );
};

export const usePropertyDetails = () => {
    const context = useContext(PropertyContext);
    if (context === undefined) {
        throw new Error('usePropertyDetails must be used within a PropertyProvider');
    }
    return context;
};
