# Property Switcher Refactoring

## Overview
The `team-switcher.tsx` component has been refactored into a `property-switcher.tsx` component with integrated Zustand state management for properties.

## Changes Made

### 1. Created Zustand Store (`src/store/propertyStore.ts`)
- **State Management**: Centralized property state with Zustand
- **Persistence**: Store state persists across browser sessions
- **Features**:
  - Properties list management
  - Selected property state
  - Loading and error states
  - CRUD operations for properties
  - Helper selectors (active properties, by type, etc.)

### 2. Property Switcher Component (`src/components/property-switcher.tsx`)
- **Replacement**: Replaces the team-switcher component
- **Features**:
  - Displays current selected property with icon and location
  - Dropdown menu showing all active properties
  - Property type icons (Building2 for apartments/condos, Home for houses)
  - Loading state with animated icon
  - Empty state for when no properties exist
  - Auto-selection of first property when none selected

### 3. Property Service (`src/services/propertyService.ts`)
- **API Integration**: Service layer for property CRUD operations
- **Fallback**: Uses demo data when API is unavailable
- **Features**:
  - Get all properties
  - Get single property
  - Create, update, delete properties
  - Image upload support
  - Authentication token handling

### 4. Custom Hook (`src/hooks/useProperties.ts`)
- **Data Management**: Hook for loading and managing properties
- **Features**:
  - Auto-loads properties on mount
  - Loading state management
  - Error handling
  - Refresh functionality

### 5. Demo Data (`src/data/demoProperties.ts`)
- **Sample Properties**: Three demo properties with realistic data
- **Fallback**: Used when API is not available
- **Properties Included**:
  - Downtown Modern Apartment (NYC)
  - Seaside Beach House (Miami Beach)
  - Mountain Cabin Retreat (Aspen)

## Usage

### Basic Usage
The PropertySwitcher component is automatically integrated into the AppSidebar:

```tsx
import { PropertySwitcher } from "@/components/property-switcher";

// In AppSidebar
<SidebarHeader>
  <PropertySwitcher />
</SidebarHeader>
```

### Using the Store
```tsx
import { usePropertyStore } from "@/store/propertyStore";

function MyComponent() {
  const { 
    properties, 
    selectedProperty, 
    setSelectedProperty 
  } = usePropertyStore();
  
  // Your component logic
}
```

### Using the Hook
```tsx
import { useProperties } from "@/hooks/useProperties";

function MyComponent() {
  const { 
    activeProperties, 
    isLoading, 
    error, 
    refreshProperties 
  } = useProperties();
  
  // Your component logic
}
```

## Store Features

### State
- `properties`: Array of all properties
- `selectedProperty`: Currently selected property
- `isLoading`: Loading state flag
- `error`: Error message string

### Actions
- `setProperties(properties)`: Set the properties array
- `setSelectedProperty(property)`: Set the selected property
- `addProperty(property)`: Add a new property
- `updateProperty(id, updates)`: Update an existing property
- `removeProperty(id)`: Remove a property
- `setLoading(loading)`: Set loading state
- `setError(error)`: Set error message
- `clearError()`: Clear error message

### Selectors
- `getActiveProperties()`: Get only active properties
- `getPropertyById(id)`: Get property by ID
- `getPropertiesByType(type)`: Get properties by type

## Configuration

### Environment Variables
Create a `.env` file with:
```
VITE_API_URL=http://localhost:3000/api
VITE_USE_DEMO_DATA=true
```

### API Integration
The service automatically falls back to demo data if the API is unavailable. To connect to your API:
1. Ensure the API is running on the configured URL
2. Implement authentication token management
3. Update the service endpoints as needed

## Visual Features

### Property Icons
- **Apartments/Condos/Studios**: Building2 icon
- **Houses/Townhouses**: Home icon
- **All others**: Building2 icon (default)

### Display Information
- Property name as main text
- City, State as location with MapPin icon
- Bedroom/Bathroom/Occupancy info in dropdown
- Visual indicators for selected property

### States
- **Loading**: Animated icon with "Loading..." text
- **Empty**: "Add Property" state when no properties
- **Populated**: Full dropdown with property selection

## Migration Notes

The old `team-switcher.tsx` has been moved to `team-switcher.tsx.backup` for reference. The new PropertySwitcher provides the same visual experience but with property-specific data and functionality.

## Future Enhancements

- Property search/filtering in dropdown
- Property creation from the "Add property" option
- Property images in the dropdown
- Keyboard shortcuts for property switching
- Integration with property management workflows
