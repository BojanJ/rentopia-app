import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Property {
  id: string;
  name: string;
  description?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  propertyType: 'apartment' | 'house' | 'condo' | 'townhouse' | 'studio' | 'loft' | 'other';
  bedrooms: number;
  bathrooms: number;
  maxOccupancy: number;
  squareFeet?: number;
  amenities: string[];
  houseRules?: string;
  checkInTime?: string;
  checkOutTime?: string;
  basePrice: number;
  cleaningFee: number;
  securityDeposit: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  images?: PropertyImage[];
}

export interface PropertyImage {
  id: string;
  propertyId: string;
  imageUrl: string;
  altText?: string;
  displayOrder: number;
  isPrimary: boolean;
  createdAt: string;
}

interface PropertyStore {
  // State
  properties: Property[];
  selectedProperty: Property | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setProperties: (properties: Property[]) => void;
  setSelectedProperty: (property: Property | null) => void;
  addProperty: (property: Property) => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  removeProperty: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Selectors
  getActiveProperties: () => Property[];
  getPropertyById: (id: string) => Property | undefined;
  getPropertiesByType: (type: Property['propertyType']) => Property[];
}

export const usePropertyStore = create<PropertyStore>()(
  persist(
    (set, get) => ({
      // Initial state
      properties: [],
      selectedProperty: null,
      isLoading: false,
      error: null,

      // Actions
      setProperties: (properties) => set({ properties }),
      
      setSelectedProperty: (property) => set({ selectedProperty: property }),
      
      addProperty: (property) => 
        set((state) => ({ 
          properties: [...state.properties, property],
          error: null 
        })),
      
      updateProperty: (id, updates) =>
        set((state) => ({
          properties: state.properties.map((property) =>
            property.id === id ? { ...property, ...updates } : property
          ),
          selectedProperty: state.selectedProperty?.id === id 
            ? { ...state.selectedProperty, ...updates }
            : state.selectedProperty,
          error: null
        })),
      
      removeProperty: (id) =>
        set((state) => ({
          properties: state.properties.filter((property) => property.id !== id),
          selectedProperty: state.selectedProperty?.id === id ? null : state.selectedProperty,
          error: null
        })),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),

      // Selectors
      getActiveProperties: () => get().properties.filter(property => property.isActive),
      
      getPropertyById: (id) => get().properties.find(property => property.id === id),
      
      getPropertiesByType: (type) => get().properties.filter(property => property.propertyType === type),
    }),
    {
      name: 'rentopia-property-store',
      partialize: (state) => ({
        properties: state.properties,
        selectedProperty: state.selectedProperty,
      }),
    }
  )
);
