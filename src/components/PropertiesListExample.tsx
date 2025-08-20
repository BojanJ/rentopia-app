import React from 'react';
import { usePropertiesList } from '../hooks/usePropertyApi';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export const PropertiesListExample: React.FC = () => {
  const {
    properties,
    paginationMeta,
    isLoading,
    error,
    currentPage,
    pageSize,
    hasNextPage,
    hasPrevPage,
    totalProperties,
    nextPage,
    prevPage,
    setPageSize,
  } = usePropertiesList();

  if (isLoading) {
    return <div>Loading properties...</div>;
  }

  if (error) {
    return <div>Error loading properties: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Card key={property.id}>
            <CardHeader>
              <CardTitle>{property.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{property.description}</p>
              <div className="mt-2">
                <p className="text-sm">📍 {property.city}, {property.state}</p>
                <p className="text-sm">🛏️ {property.bedrooms} bed, 🛁 {property.bathrooms} bath</p>
                <p className="text-lg font-semibold">${property.basePrice}/night</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            Showing {properties.length} of {totalProperties} properties
          </span>
          <select 
            value={pageSize} 
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="text-sm border rounded px-2 py-1"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={prevPage} 
            disabled={!hasPrevPage}
          >
            Previous
          </Button>
          
          <span className="text-sm">
            Page {currentPage} of {Math.ceil(totalProperties / pageSize)}
          </span>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={nextPage} 
            disabled={!hasNextPage}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Debug Info */}
      <div className="text-xs text-muted-foreground bg-gray-50 p-4 rounded">
        <h4 className="font-semibold mb-2">Pagination Debug Info:</h4>
        <pre>{JSON.stringify(paginationMeta, null, 2)}</pre>
      </div>
    </div>
  );
};
