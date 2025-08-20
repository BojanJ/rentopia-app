import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Home,
  ArrowLeft,
  Edit,
  MapPin,
  Bed,
  Bath,
  Users,
  DollarSign,
  Clock,
  Calendar,
  Settings,
  Image as ImageIcon,
} from "lucide-react";
import { useProperty } from "@/hooks/usePropertyApi";

const PROPERTY_TYPES = [
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" },
  { value: "studio", label: "Studio" },
  { value: "loft", label: "Loft" },
  { value: "other", label: "Other" },
] as const;

export default function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: property, isLoading, error } = useProperty(id!);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading property details</p>
        <Button onClick={() => navigate("/admin/properties")} className="mt-4">
          Back to Properties
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const propertyTypeLabel =
    PROPERTY_TYPES.find((t) => t.value === property.propertyType)?.label ||
    property.propertyType;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/properties")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{property.name}</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {property.addressLine1}, {property.city}, {property.state}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(property.status)}>
            {property.status}
          </Badge>
          <Button
            onClick={() => navigate(`/admin/properties/${property.id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Property
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Details
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Images
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Bookings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Property Summary */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Property Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <Bed className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <div className="text-2xl font-bold">
                        {property.bedrooms}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Bedrooms
                      </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Bath className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <div className="text-2xl font-bold">
                        {property.bathrooms}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Bathrooms
                      </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Users className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <div className="text-2xl font-bold">
                        {property.maxOccupancy}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Max Guests
                      </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Home className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <div className="text-lg font-bold">
                        {propertyTypeLabel}
                      </div>
                      <div className="text-sm text-muted-foreground">Type</div>
                    </div>
                  </div>

                  {property.description && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-medium mb-2">Description</h4>
                        <p className="text-muted-foreground">
                          {property.description}
                        </p>
                      </div>
                    </>
                  )}

                  {property.amenities && property.amenities.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-medium mb-2">Amenities</h4>
                        <div className="flex flex-wrap gap-2">
                          {property.amenities.map((amenity) => (
                            <Badge key={amenity} variant="secondary">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {property.houseRules && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-medium mb-2">House Rules</h4>
                        <p className="text-muted-foreground whitespace-pre-wrap">
                          {property.houseRules}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Pricing Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Base Price:</span>
                    <span className="font-medium">
                      ${property.basePrice}/night
                    </span>
                  </div>
                  {property.cleaningFee > 0 && (
                    <div className="flex justify-between">
                      <span>Cleaning Fee:</span>
                      <span className="font-medium">
                        ${property.cleaningFee}
                      </span>
                    </div>
                  )}
                  {property.securityDeposit > 0 && (
                    <div className="flex justify-between">
                      <span>Security Deposit:</span>
                      <span className="font-medium">
                        ${property.securityDeposit}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Check-in/out Times */}
              {(property.checkInTime || property.checkOutTime) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Check-in/out
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {property.checkInTime && (
                      <div className="flex justify-between">
                        <span>Check-in:</span>
                        <span className="font-medium">
                          {property.checkInTime}
                        </span>
                      </div>
                    )}
                    {property.checkOutTime && (
                      <div className="flex justify-between">
                        <span>Check-out:</span>
                        <span className="font-medium">
                          {property.checkOutTime}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Property Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Property ID:</span>
                    <span className="font-mono text-sm">{property.id}</span>
                  </div>
                  {property.squareFeet && (
                    <div className="flex justify-between">
                      <span>Square Feet:</span>
                      <span className="font-medium">
                        {property.squareFeet} sq ft
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span className="font-medium">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Updated:</span>
                    <span className="font-medium">
                      {new Date(property.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Full Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span>{property.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span>{propertyTypeLabel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge className={getStatusColor(property.status)}>
                        {property.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Address</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Address 1:</span>
                      <span>{property.addressLine1}</span>
                    </div>
                    {property.addressLine2 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Address 2:
                        </span>
                        <span>{property.addressLine2}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">City:</span>
                      <span>{property.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">State:</span>
                      <span>{property.state}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Postal Code:
                      </span>
                      <span>{property.postalCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Country:</span>
                      <span>{property.country}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images Tab */}
        <TabsContent value="images" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Property Images</span>
                <Button size="sm">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Upload Images
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {property.images && property.images.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {property.images.map((image) => (
                    <div key={image.id} className="relative">
                      <img
                        src={image.imageUrl}
                        alt={image.altText || property.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      {image.isPrimary && (
                        <Badge className="absolute top-2 left-2">Primary</Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-medium">No images</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Upload some images to showcase your property
                  </p>
                  <Button className="mt-4" size="sm">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Upload Images
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium">No bookings yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Bookings for this property will appear here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
