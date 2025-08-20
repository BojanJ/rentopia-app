import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  propertyType:
    | "apartment"
    | "house"
    | "condo"
    | "townhouse"
    | "studio"
    | "loft"
    | "other";
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
  status: string;
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
  selectedProperty: Property | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setSelectedProperty: (property: Property | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const usePropertyStore = create<PropertyStore>()(
  persist(
    (set) => ({
      // Initial state
      selectedProperty: null,
      isLoading: false,
      error: null,

      // Actions
      setSelectedProperty: (property) => set({ selectedProperty: property }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),
    }),
    {
      name: "rentopia-property-store",
      partialize: (state) => ({
        selectedProperty: state.selectedProperty,
      }),
    }
  )
);
