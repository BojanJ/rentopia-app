import { useMemo } from "react";
import { useProperties as usePropertiesQuery } from "./usePropertyApi";
import { usePropertyStore } from "@/store/propertyStore";
import { useAuthStore } from "@/store/authStore";

/**
 * A convenient hook that provides properties data and common selectors
 * This wraps the TanStack Query hook and provides additional computed values
 */
export const useProperties = () => {
  const { isAuthenticated } = useAuthStore();
  const { selectedProperty, setSelectedProperty } = usePropertyStore();

  // Use the TanStack Query hook
  const propertiesQuery = usePropertiesQuery();

  // Safely get properties data - only when authenticated and data is available
  const properties = useMemo(() => {
    if (!isAuthenticated) return [];
    const properties = propertiesQuery.data?.properties;

    return Array.isArray(properties) ? properties : [];
  }, [propertiesQuery.data, isAuthenticated]);

  // Compute derived values
  const activeProperties = useMemo(() => {
    return properties.filter((property) => property?.status === "active");
  }, [properties]);

  const getPropertyById = (id: string) => {
    if (!Array.isArray(properties)) return undefined;
    return properties.find((property) => property?.id === id);
  };

  const getPropertiesByType = (type: string) => {
    if (!Array.isArray(properties)) return [];
    return properties.filter((property) => property?.propertyType === type);
  };

  return {
    // Raw query data
    ...propertiesQuery,

    // Computed properties
    properties,
    activeProperties,

    // Selected property state
    selectedProperty,
    setSelectedProperty,

    // Utility functions
    getPropertyById,
    getPropertiesByType,

    // Convenient aliases
    isLoading: propertiesQuery.isLoading,
    error: propertiesQuery.error,
    refetch: propertiesQuery.refetch,
  };
};
