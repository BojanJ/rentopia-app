import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/apiClient";
import { useAuthStore } from "../store/authStore";
import { usePropertyStore } from "../store/propertyStore";
import type { Property } from "../store/propertyStore";
import {
  type PaginationParams,
  buildPaginationParams,
} from "../types/pagination";
import { usePaginatedQuery } from "./usePagination";

// API Response type for properties (based on your actual API response)
export interface PropertiesApiResponse {
  properties: Property[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface PropertyApiResponse {
  property: Property;
}

// Re-export pagination types for convenience
export type { PaginationParams } from "../types/pagination";

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
  propertyType: Property["propertyType"];
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
  getProperties: async (
    params: PaginationParams = {}
  ): Promise<PropertiesApiResponse> => {
    const searchParams = buildPaginationParams(params);
    const url = `/properties${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    const response = await api.get<PropertiesApiResponse>(url);
    return response.data;
  },

  getProperty: async (id: string): Promise<PropertyApiResponse> => {
    const response = await api.get<PropertyApiResponse>(`/properties/${id}`);
    return response.data;
  },

  createProperty: async (data: CreatePropertyRequest): Promise<Property> => {
    const response = await api.post<Property>("/properties", data);
    return response.data;
  },

  updateProperty: async (
    id: string,
    data: UpdatePropertyRequest
  ): Promise<Property> => {
    const response = await api.patch<Property>(`/properties/${id}`, data);
    return response.data;
  },

  deleteProperty: async (id: string): Promise<void> => {
    await api.delete(`/properties/${id}`);
  },

  uploadPropertyImages: async (
    propertyId: string,
    files: File[]
  ): Promise<Property> => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`images`, file);
      formData.append(`displayOrder[${index}]`, index.toString());
    });

    const response = await api.upload<Property>(
      `/properties/${propertyId}/images`,
      formData
    );
    return response.data;
  },
};

// Query keys - updated to include pagination params
export const propertyKeys = {
  all: ["properties"] as const,
  lists: () => [...propertyKeys.all, "list"] as const,
  list: (filters: string, pagination?: PaginationParams) =>
    [...propertyKeys.lists(), { filters, pagination }] as const,
  details: () => [...propertyKeys.all, "detail"] as const,
  detail: (id: string) => [...propertyKeys.details(), id] as const,
};

// React Query hooks for properties
export const useProperties = (
  filters?: string,
  pagination?: PaginationParams
) => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: propertyKeys.list(filters || "", pagination),
    queryFn: () => propertyApi.getProperties(pagination),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// New paginated properties hook with better UX
export const usePaginatedProperties = (
  filters?: string,
  initialPagination?: PaginationParams
) => {
  const { isAuthenticated } = useAuthStore();

  return usePaginatedQuery({
    queryKey: (pagination) => propertyKeys.list(filters || "", pagination),
    queryFn: (pagination) => propertyApi.getProperties(pagination),
    initialPagination,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook that extracts properties array and pagination info separately
export const usePropertiesList = (
  filters?: string,
  initialPagination?: PaginationParams
) => {
  const result = usePaginatedProperties(filters, initialPagination);

  return {
    ...result,
    properties: result.data?.properties || [],
    paginationMeta: result.data?.pagination,
    hasNextPage: result.data?.pagination?.hasMore || false,
    hasPrevPage: (result.pagination.offset || 0) > 0,
    totalProperties: result.data?.pagination?.total || 0,
  };
};

export const useProperty = (id: string) => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: propertyKeys.detail(id),
    queryFn: () => propertyApi.getProperty(id).then((res) => res.property),
    enabled: !!id && isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  const { setLoading } = usePropertyStore();

  return useMutation({
    mutationFn: propertyApi.createProperty,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      // Invalidate all property list queries (including paginated ones)
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      setLoading(false);
    },
    onError: () => {
      setLoading(false);
    },
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  const { setLoading } = usePropertyStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePropertyRequest }) =>
      propertyApi.updateProperty(id, data),
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.detail(data.id) });
      // Invalidate all property list queries (including paginated ones)
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      setLoading(false);
    },
    onError: () => {
      setLoading(false);
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  const { setLoading } = usePropertyStore();

  return useMutation({
    mutationFn: propertyApi.deleteProperty,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (_, id) => {
      // Invalidate all property list queries (including paginated ones)
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      queryClient.removeQueries({ queryKey: propertyKeys.detail(id) });
      setLoading(false);
    },
    onError: () => {
      setLoading(false);
    },
  });
};

export const useUploadPropertyImages = () => {
  const queryClient = useQueryClient();
  const { setLoading } = usePropertyStore();

  return useMutation({
    mutationFn: ({
      propertyId,
      files,
    }: {
      propertyId: string;
      files: File[];
    }) => propertyApi.uploadPropertyImages(propertyId, files),
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.detail(data.id) });
      setLoading(false);
    },
    onError: () => {
      setLoading(false);
    },
  });
};
