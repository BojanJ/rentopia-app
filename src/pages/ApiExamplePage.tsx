import { useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useLogin, useLogout } from '../hooks/useAuth';
import { useProperties, useCreateProperty } from '../hooks/usePropertyApi';
import { useAuthStore } from '../store/authStore';

export function ApiExamplePage() {
  const { user, isAuthenticated } = useAuthStore();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const propertiesQuery = useProperties();
  const createPropertyMutation = useCreateProperty();

  // Auto-fetch properties when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      propertiesQuery.refetch();
    }
  }, [isAuthenticated, propertiesQuery]);

  const handleLogin = () => {
    loginMutation.mutate({
      email: 'test@example.com',
      password: 'password123',
    });
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleCreateProperty = () => {
    createPropertyMutation.mutate({
      name: 'Sample Property',
      addressLine1: '123 Main St',
      city: 'Sample City',
      state: 'CA',
      postalCode: '12345',
      country: 'USA',
      propertyType: 'apartment',
      bedrooms: 2,
      bathrooms: 1,
      maxOccupancy: 4,
      amenities: ['WiFi', 'Parking'],
      basePrice: 150,
      cleaningFee: 50,
      securityDeposit: 200,
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">API Integration Example</h1>
      
      {/* Authentication Section */}
      <Card>
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAuthenticated ? (
            <div className="space-y-2">
              <p>Welcome, {user?.firstName} {user?.lastName}!</p>
              <p>Role: {user?.role}</p>
              <Button 
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <p>Not authenticated</p>
              <Button 
                onClick={handleLogin}
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? 'Logging in...' : 'Login (Demo)'}
              </Button>
            </div>
          )}
          
          {loginMutation.error && (
            <p className="text-red-500">Login error: {loginMutation.error.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Properties Section */}
      <Card>
        <CardHeader>
          <CardTitle>Properties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={() => propertiesQuery.refetch()}
              disabled={propertiesQuery.isFetching}
            >
              {propertiesQuery.isFetching ? 'Loading...' : 'Refresh Properties'}
            </Button>
            
            <Button 
              onClick={handleCreateProperty}
              disabled={createPropertyMutation.isPending || !isAuthenticated}
            >
              {createPropertyMutation.isPending ? 'Creating...' : 'Create Sample Property'}
            </Button>
          </div>
          
          {propertiesQuery.error && (
            <p className="text-red-500">
              Properties error: {propertiesQuery.error.message}
            </p>
          )}
          
          {createPropertyMutation.error && (
            <p className="text-red-500">
              Create error: {createPropertyMutation.error.message}
            </p>
          )}
          
          {propertiesQuery.data && (
            <div className="space-y-2">
              <h3 className="font-semibold">Properties ({propertiesQuery.data.length}):</h3>
              {propertiesQuery.data.map((property) => (
                <div key={property.id} className="p-3 border rounded">
                  <h4 className="font-medium">{property.name}</h4>
                  <p className="text-sm text-gray-600">
                    {property.addressLine1}, {property.city}, {property.state}
                  </p>
                  <p className="text-sm">
                    ${property.basePrice}/night • {property.bedrooms} bed • {property.bathrooms} bath
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
