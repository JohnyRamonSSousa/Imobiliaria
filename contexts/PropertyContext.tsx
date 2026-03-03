import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Property } from '../types';
import { PROPERTIES } from '../constants';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

interface PropertyContextType {
    selectedProperty: Property | null;
    openPropertyDetails: (property: Property) => void;
    openPropertyDetailsById: (id: string, propertyData?: any) => Promise<void>;
    closePropertyDetails: () => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

    const openPropertyDetails = (property: Property) => {
        setSelectedProperty(property);
    };

    const openPropertyDetailsById = async (id: string, propertyData?: any) => {
        // 1. Check local constants
        const foundLocal = PROPERTIES.find(p => p.id === id);
        if (foundLocal) {
            setSelectedProperty(foundLocal);
            return;
        }

        // 2. Check if property data already exists (e.g. from a list search)
        if (propertyData) {
            setSelectedProperty(propertyData);
            return;
        }

        // 3. Try Firebase Firestore
        try {
            const docRef = doc(db, 'properties', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                const mapped: Property = {
                    id: docSnap.id,
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
            } else {
                console.log(`Property ${id} not found in Firestore or local constants.`);
            }
        } catch (err) {
            console.error('Error fetching property from Firestore:', err);
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

