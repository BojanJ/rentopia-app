# Generic Pagination System

This document explains how to use the new generic pagination system implemented in the Rentopia application.

## Overview

We've created a generic pagination system that can be used across the application for any API endpoints that return paginated data. The system consists of:

1. **Generic Types** (`src/types/pagination.ts`)
2. **Generic Hooks** (`src/hooks/usePagination.ts`)
3. **Property-specific Implementation** (`src/hooks/usePropertyApi.ts`)

## Types

### `PaginationMeta`
```typescript
interface PaginationMeta {
  total: number;      // Total number of items
  limit: number;      // Number of items per page
  offset: number;     // Number of items to skip
  hasMore: boolean;   // Whether there are more items
}
```

### `PaginatedResponse<T>`
```typescript
interface PaginatedResponse<T> {
  data: T[];                    // Array of items
  pagination: PaginationMeta;   // Pagination metadata
}
```

### `PaginationParams`
```typescript
interface PaginationParams {
  limit?: number;   // Items per page
  offset?: number;  // Items to skip
  page?: number;    // Page number (alternative to offset)
}
```

## API Response Format

Your API should return data in this format:

```json
{
  "properties": [
    { "id": "1", "name": "Property 1" },
    { "id": "2", "name": "Property 2" }
  ],
  "pagination": {
    "total": 100,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

## Usage Examples

### Basic Properties List with Pagination

```typescript
import { usePropertiesList } from '../hooks/usePropertyApi';

const PropertiesComponent = () => {
  const {
    properties,           // Array of Property objects
    paginationMeta,      // Pagination metadata
    isLoading,           // Loading state
    error,               // Error state
    currentPage,         // Current page number
    pageSize,            // Items per page
    hasNextPage,         // Can go to next page
    hasPrevPage,         // Can go to previous page
    totalProperties,     // Total number of properties
    nextPage,            // Function to go to next page
    prevPage,            // Function to go to previous page
    setPageSize,         // Function to change page size
  } = usePropertiesList();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {/* Render properties */}
      {properties.map(property => (
        <div key={property.id}>{property.name}</div>
      ))}
      
      {/* Pagination controls */}
      <button onClick={prevPage} disabled={!hasPrevPage}>
        Previous
      </button>
      <span>Page {currentPage}</span>
      <button onClick={nextPage} disabled={!hasNextPage}>
        Next
      </button>
    </div>
  );
};
```

### With Custom Initial Pagination

```typescript
const PropertiesComponent = () => {
  const { properties, ...rest } = usePropertiesList(
    "", // filters
    { limit: 20, offset: 0 } // custom initial pagination
  );
  
  // ... rest of component
};
```

### Using the Lower-Level Hook

```typescript
import { usePaginatedProperties } from '../hooks/usePropertyApi';

const PropertiesComponent = () => {
  const result = usePaginatedProperties();
  
  // Access the full API response
  const apiResponse = result.data; // PropertiesApiResponse
  const properties = apiResponse?.properties || [];
  const paginationMeta = apiResponse?.pagination;
  
  // ... rest of component
};
```

## Creating Your Own Paginated Hook

You can create paginated hooks for other resources using the generic `usePaginatedQuery`:

```typescript
import { usePaginatedQuery } from '../hooks/usePagination';
import { type PaginationParams } from '../types/pagination';

// Example for a bookings API
export const usePaginatedBookings = (filters?: string) => {
  return usePaginatedQuery({
    queryKey: (pagination) => ['bookings', 'list', { filters, pagination }],
    queryFn: async (pagination) => {
      const searchParams = buildPaginationParams(pagination);
      const url = `/bookings${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      const response = await api.get(url);
      return response.data;
    },
    initialPagination: { limit: 25, offset: 0 },
    enabled: true,
    staleTime: 5 * 60 * 1000,
  });
};
```

## Helper Functions

### `buildPaginationParams(params: PaginationParams): URLSearchParams`

Converts pagination parameters to URL search parameters:

```typescript
const params = buildPaginationParams({ limit: 20, offset: 40 });
// Returns URLSearchParams: "limit=20&offset=40"
```

### `calculatePagination(page: number, limit: number)`

Converts page-based pagination to offset-based:

```typescript
const { offset, limit } = calculatePagination(3, 20);
// Returns: { offset: 40, limit: 20 }
```

## Migration Guide

### Before (Old Way)
```typescript
const { data: properties, isLoading, error } = useProperties();
// properties was just an array, no pagination info
```

### After (New Way)
```typescript
const { 
  properties, 
  paginationMeta, 
  isLoading, 
  error,
  nextPage,
  prevPage 
} = usePropertiesList();
// Now you have pagination controls and metadata
```

## Best Practices

1. **Use `usePropertiesList`** for most property list scenarios
2. **Use `usePaginatedProperties`** when you need access to the raw API response
3. **Always handle loading and error states**
4. **Provide pagination controls** for better UX
5. **Allow users to change page size** when appropriate
6. **Show total count and current page info** for context

## Component Example

See `src/components/PropertiesListExample.tsx` for a complete working example with pagination controls and proper error handling.
