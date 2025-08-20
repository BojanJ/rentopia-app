import { useEffect, useCallback } from 'react';
import { usePropertyStore } from '@/store/propertyStore';
import { propertyService } from '@/services/propertyService';

export const useProperties = () => {
  const {
    properties,
    selectedProperty,
    isLoading,
    error,
    setProperties,
    setLoading,
    setError,
    clearError,
    getActiveProperties,
  } = usePropertyStore();

  // Load properties from API
  const loadProperties = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      const fetchedProperties = await propertyService.getProperties();
      setProperties(fetchedProperties);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load properties';
      setError(errorMessage);
      console.error('Failed to load properties:', err);
    } finally {
      setLoading(false);
    }
  }, [setProperties, setLoading, setError, clearError]);

  // Refresh properties
  const refreshProperties = useCallback(() => {
    return loadProperties();
  }, [loadProperties]);

  // Auto-load properties on mount
  useEffect(() => {
    if (properties.length === 0 && !isLoading && !error) {
      loadProperties();
    }
  }, [properties.length, isLoading, error, loadProperties]);

  return {
    properties,
    activeProperties: getActiveProperties(),
    selectedProperty,
    isLoading,
    error,
    loadProperties,
    refreshProperties,
    clearError,
  };
};
