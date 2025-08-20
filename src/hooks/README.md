# Property Hooks Usage Guide

This document explains how to use the refactored property hooks that now use axios and TanStack Query.

## Overview

We have two main hooks for working with properties:

1. **`usePropertyApi`** - Low-level TanStack Query hooks for direct API operations
2. **`useProperties`** - High-level convenience hook with computed values and utilities

## Low-Level API Hooks (`usePropertyApi`)

These hooks provide direct access to TanStack Query functionality:

```typescript
import { 
  useProperties, 
  useProperty, 
  useCreateProperty, 
  useUpdateProperty, 
  useDeleteProperty,
  useUploadPropertyImages 
} from '@/hooks/usePropertyApi';

// Fetch all properties
const { data: properties, isLoading, error } = useProperties();

// Fetch a specific property
const { data: property } = useProperty(propertyId);

// Create a new property
const createProperty = useCreateProperty();
const handleCreate = (propertyData) => {
  createProperty.mutate(propertyData);
};

// Update a property
const updateProperty = useUpdateProperty();
const handleUpdate = (id, updates) => {
  updateProperty.mutate({ id, data: updates });
};

// Delete a property
const deleteProperty = useDeleteProperty();
const handleDelete = (id) => {
  deleteProperty.mutate(id);
};
```

## High-Level Convenience Hook (`useProperties`)

This hook provides a more convenient API with computed values:

```typescript
import { useProperties } from '@/hooks/useProperties';

function PropertyComponent() {
  const {
    // All properties data
    properties,
    activeProperties,
    
    // Selected property management
    selectedProperty,
    setSelectedProperty,
    
    // Query state
    isLoading,
    error,
    refetch,
    
    // Utility functions
    getPropertyById,
    getPropertiesByType,
  } = useProperties();

  // Auto-select first property
  useEffect(() => {
    if (!selectedProperty && activeProperties.length > 0) {
      setSelectedProperty(activeProperties[0]);
    }
  }, [selectedProperty, activeProperties, setSelectedProperty]);

  if (isLoading) return <div>Loading properties...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Active Properties ({activeProperties.length})</h2>
      {activeProperties.map(property => (
        <div key={property.id}>
          <h3>{property.name}</h3>
          <p>{property.city}, {property.state}</p>
        </div>
      ))}
    </div>
  );
}
```

## Property Store

The property store has been simplified and now only handles:

- Selected property state
- Loading state
- Error state

The actual properties data is managed by TanStack Query for better caching and synchronization.

```typescript
import { usePropertyStore } from '@/store/propertyStore';

const { 
  selectedProperty, 
  setSelectedProperty,
  isLoading,
  setLoading,
  error,
  setError,
  clearError 
} = usePropertyStore();
```

## Benefits of the New Architecture

1. **Better Caching** - TanStack Query provides automatic caching and background updates
2. **Optimistic Updates** - Built-in support for optimistic UI updates
3. **Error Handling** - Standardized error handling across all API calls
4. **Authentication** - Automatic integration with the auth system
5. **Performance** - Queries are only enabled when user is authenticated
6. **Stale Data Management** - Data is cached for 5 minutes by default
7. **Background Refetching** - Data is automatically refreshed when needed

## Migration from Old Hooks

If you were using the old `useProperties` hook:

```typescript
// Old way
const { 
  properties, 
  activeProperties, 
  loadProperties, 
  isLoading 
} = useProperties();

// New way
const { 
  properties, 
  activeProperties, 
  refetch, 
  isLoading 
} = useProperties();
```

The main differences:
- `loadProperties()` → `refetch()`
- Properties are automatically loaded when authenticated
- No need to manually manage loading states
- Error handling is built-in
