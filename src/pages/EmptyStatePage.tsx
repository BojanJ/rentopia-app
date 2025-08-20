import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Plus, MapPin, Users, Calendar } from "lucide-react";

export default function EmptyStatePage() {
  const navigate = useNavigate();

  const handleAddProperty = () => {
    navigate("/admin/properties/add");
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Home className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Rentopia!
          </h1>
          <p className="text-lg text-gray-600">
            Let's get you started by adding your first property
          </p>
        </div>

        {/* Main Card */}
        <Card className="border-2 border-dashed border-gray-200 bg-gray-50/50">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2 text-xl">
              <Plus className="h-5 w-5" />
              Add Your First Property
            </CardTitle>
            <CardDescription className="text-base">
              Start managing your rental properties with ease. Add property details, 
              track tenants, and manage maintenance all in one place.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Features Preview */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Property Details</h3>
                <p className="text-sm text-gray-600">
                  Add comprehensive property information and photos
                </p>
              </div>
              <div className="text-center p-4">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Tenant Management</h3>
                <p className="text-sm text-gray-600">
                  Track tenants, leases, and rental payments
                </p>
              </div>
              <div className="text-center p-4">
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Maintenance</h3>
                <p className="text-sm text-gray-600">
                  Schedule and track property maintenance requests
                </p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="pt-4 border-t border-gray-200">
              <Button 
                onClick={handleAddProperty}
                className="w-full h-12 text-base"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add Your First Property
              </Button>
              <p className="text-xs text-gray-500 text-center mt-3">
                You can always add more properties later from the dashboard
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Help */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600 mb-4">
            Need help getting started? Check out our{" "}
            <Button variant="link" className="h-auto p-0 text-sm">
              quick start guide
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
