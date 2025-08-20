import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { api } from '../lib/apiClient';
import { usePropertyStore } from '../store/propertyStore';
import type { Property } from '../store/propertyStore';

// Types for API requests
export interface CreatePropertyRequest {
  name: string;
  description?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  propertyType: Property['propertyType'];
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
}

export interface UpdatePropertyRequest extends Partial<CreatePropertyRequest> {
  isActive?: boolean;
}

// Property API functions
const propertyApi = {
  getProperties: async (): Promise<Property[]> => {
    const response = await api.get<Property[]>('/properties');
    return response.data;
  },

  getProperty: async (id: string): Promise<Property> => {
    const response = await api.get<Property>(`/properties/${id}`);
    return response.data;
  },

  createProperty: async (data: CreatePropertyRequest): Promise<Property> => {
    const response = await api.post<Property>('/properties', data);
    return response.data;
  },

  updateProperty: async (id: string, data: UpdatePropertyRequest): Promise<Property> => {
    const response = await api.patch<Property>(`/properties/${id}`, data);
    return response.data;
  },

  deleteProperty: async (id: string): Promise<void> => {
    await api.delete(`/properties/${id}`);
  },

  uploadPropertyImages: async (propertyId: string, files: File[]): Promise<Property> => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`images`, file);
      formData.append(`displayOrder[${index}]`, index.toString());
    });
    
    const response = await api.upload<Property>(`/properties/${propertyId}/images`, formData);
    return response.data;
  },
};

// Query keys
export const propertyKeys = {
  all: ['properties'] as const,
  lists: () => [...propertyKeys.all, 'list'] as const,
  list: (filters: string) => [...propertyKeys.lists(), { filters }] as const,
  details: () => [...propertyKeys.all, 'detail'] as const,
  detail: (id: string) => [...propertyKeys.details(), id] as const,
};

// React Query hooks for properties
export const useProperties = (filters?: string) => {
  const { setProperties, setLoading, setError } = usePropertyStore();
  
  const query = useQuery({
    queryKey: propertyKeys.list(filters || ''),
    queryFn: propertyApi.getProperties,
  });

  useEffect(() => {
    if (query.data) {
      setProperties(query.data);
      setError(null);
    }
    if (query.error) {
      setError(query.error.message);
    }
    setLoading(query.isLoading);
  }, [query.data, query.error, query.isLoading, setProperties, setError, setLoading]);

  return query;
};

export const useProperty = (id: string) => {
  const { setSelectedProperty, setError } = usePropertyStore();
  
  const query = useQuery({
    queryKey: propertyKeys.detail(id),
    queryFn: () => propertyApi.getProperty(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (query.data) {
      setSelectedProperty(query.data);
      setError(null);
    }
    if (query.error) {
      setError(query.error.message);
    }
  }, [query.data, query.error, setSelectedProperty, setError]);

  return query;
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  const { addProperty } = usePropertyStore();
  
  return useMutation({
    mutationFn: propertyApi.createProperty,
    onSuccess: (data) => {
      addProperty(data);
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
    },
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  const { updateProperty } = usePropertyStore();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePropertyRequest }) => 
      propertyApi.updateProperty(id, data),
    onSuccess: (data) => {
      updateProperty(data.id, data);
      queryClient.invalidateQueries({ queryKey: propertyKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  const { removeProperty } = usePropertyStore();
  
  return useMutation({
    mutationFn: propertyApi.deleteProperty,
    onSuccess: (_, id) => {
      removeProperty(id);
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      queryClient.removeQueries({ queryKey: propertyKeys.detail(id) });
    },
  });
};

export const useUploadPropertyImages = () => {
  const queryClient = useQueryClient();
  const { updateProperty } = usePropertyStore();
  
  return useMutation({
    mutationFn: ({ propertyId, files }: { propertyId: string; files: File[] }) => 
      propertyApi.uploadPropertyImages(propertyId, files),
    onSuccess: (data) => {
      updateProperty(data.id, data);
      queryClient.invalidateQueries({ queryKey: propertyKeys.detail(data.id) });
    },
  });
};
