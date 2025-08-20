# Rentopia API Client & TanStack Query Setup

This document explains the API client setup using Axios and TanStack Query for the Rentopia frontend application.

## Overview

The application now includes:
- **Axios API Client** with automatic bearer token authentication
- **TanStack Query** for server state management
- **Zustand stores** for local state management
- **React hooks** for API operations

## Architecture

### 1. API Client (`src/lib/apiClient.ts`)

The API client is built on Axios and includes:
- Automatic bearer token injection from auth store
- Request/response interceptors
- Global error handling (401 redirects to login)
- Typed API methods (GET, POST, PUT, PATCH, DELETE, upload)

```typescript
import { api } from '../lib/apiClient';

// Example usage
const response = await api.get<User[]>('/users');
const user = await api.post<User>('/users', userData);
```

### 2. TanStack Query Setup (`src/lib/queryClient.ts` & `src/components/QueryProvider.tsx`)

Query client configuration includes:
- 5-minute stale time for cached data
- 10-minute garbage collection time
- Smart retry logic (no retry on 4xx errors except 408)
- Exponential backoff for retries
- Development tools integration

### 3. Authentication Store (`src/store/authStore.ts`)

Zustand-based auth store with:
- User information and JWT token storage
- Persistent storage (localStorage)
- Authentication state management

```typescript
import { useAuthStore } from '../store/authStore';

const { user, token, isAuthenticated, setAuth, logout } = useAuthStore();
```

### 4. API Hooks

#### Authentication Hooks (`src/hooks/useAuth.ts`)

- `useLogin()` - Login mutation
- `useRegister()` - Registration mutation  
- `useLogout()` - Logout mutation with cache clearing
- `useCurrentUser()` - Get current user query
- `useRefreshToken()` - Token refresh mutation

```typescript
import { useLogin, useLogout } from '../hooks/useAuth';

const loginMutation = useLogin();
const logoutMutation = useLogout();

// Usage
loginMutation.mutate({ email, password });
logoutMutation.mutate();
```

#### Property Hooks (`src/hooks/usePropertyApi.ts`)

- `useProperties(filters?)` - List properties
- `useProperty(id)` - Get single property
- `useCreateProperty()` - Create new property
- `useUpdateProperty()` - Update existing property
- `useDeleteProperty()` - Delete property
- `useUploadPropertyImages()` - Upload property images

```typescript
import { useProperties, useCreateProperty } from '../hooks/usePropertyApi';

const propertiesQuery = useProperties();
const createMutation = useCreateProperty();

// Usage
const { data: properties, isLoading, error } = propertiesQuery;
createMutation.mutate(propertyData);
```

## Usage Examples

### 1. Setting up a Component with API Data

```typescript
import { useProperties, useCreateProperty } from '../hooks/usePropertyApi';
import { useAuthStore } from '../store/authStore';

export function PropertiesPage() {
  const { isAuthenticated } = useAuthStore();
  const { data: properties, isLoading, error } = useProperties();
  const createMutation = useCreateProperty();

  const handleCreate = (propertyData) => {
    createMutation.mutate(propertyData, {
      onSuccess: () => {
        // Property automatically added to store and cache invalidated
        console.log('Property created successfully!');
      },
    });
  };

  if (!isAuthenticated) return <div>Please log in</div>;
  if (isLoading) return <div>Loading properties...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {properties?.map(property => (
        <PropertyCard key={property.id} property={property} />
      ))}
      <CreatePropertyForm onSubmit={handleCreate} />
    </div>
  );
}
```

### 2. Authentication Flow

```typescript
import { useLogin, useCurrentUser } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';

export function LoginForm() {
  const { isAuthenticated } = useAuthStore();
  const loginMutation = useLogin();
  const { data: currentUser } = useCurrentUser();

  const handleSubmit = (formData) => {
    loginMutation.mutate(formData, {
      onSuccess: () => {
        // User automatically stored and redirected
        navigate('/dashboard');
      },
    });
  };

  if (isAuthenticated && currentUser) {
    return <div>Welcome, {currentUser.firstName}!</div>;
  }

  return <LoginFormComponent onSubmit={handleSubmit} />;
}
```

### 3. File Upload

```typescript
import { useUploadPropertyImages } from '../hooks/usePropertyApi';

export function ImageUpload({ propertyId }) {
  const uploadMutation = useUploadPropertyImages();

  const handleFileUpload = (files: File[]) => {
    uploadMutation.mutate({ propertyId, files }, {
      onSuccess: (updatedProperty) => {
        console.log('Images uploaded:', updatedProperty.images);
      },
    });
  };

  return (
    <input 
      type="file" 
      multiple 
      accept="image/*"
      onChange={(e) => handleFileUpload(Array.from(e.target.files || []))}
    />
  );
}
```

## Environment Variables

Add these to your `.env` file:

```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=Rentopia
VITE_APP_VERSION=1.0.0
```

## Query Key Patterns

The application uses structured query keys for efficient cache management:

```typescript
// Properties
['properties'] // All properties-related queries
['properties', 'list'] // All property lists
['properties', 'list', { filters: 'active' }] // Filtered lists
['properties', 'detail'] // All property details
['properties', 'detail', 'property-id'] // Specific property

// Auth
['auth', 'currentUser'] // Current user data
```

## Error Handling

### Global Error Handling
- 401 errors automatically trigger logout and redirect to login
- 5xx errors are logged to console
- Network errors are retried automatically

### Component-Level Error Handling
```typescript
const { data, error, isLoading } = useProperties();

if (error) {
  // Handle specific error
  if (error.response?.status === 403) {
    return <div>Access denied</div>;
  }
  return <div>Error: {error.message}</div>;
}
```

## Best Practices

1. **Always check authentication state** before making authenticated requests
2. **Use the provided hooks** instead of calling API directly
3. **Handle loading and error states** in components
4. **Leverage automatic cache invalidation** - mutations automatically update related queries
5. **Use optimistic updates** for better UX when appropriate
6. **Structure query keys consistently** for efficient cache management

## Development Tools

In development mode, TanStack Query DevTools are automatically available. Press the TanStack Query icon in the bottom corner to inspect:
- Active queries and their state
- Cache contents and staleness
- Network requests and responses
- Performance metrics

## Integration with Existing Code

The new API setup integrates seamlessly with the existing Zustand stores:
- **Property Store** is automatically updated by property API hooks
- **Auth Store** is managed by authentication hooks
- **Existing components** can gradually migrate to use the new hooks

## Next Steps

1. Replace existing API calls with the new hooks
2. Add proper TypeScript types for all API responses
3. Implement optimistic updates for mutations
4. Add pagination support to list queries
5. Implement real-time updates with WebSocket integration
