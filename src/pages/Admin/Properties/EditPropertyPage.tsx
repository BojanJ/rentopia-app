import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TimePicker } from "@/components/ui/time-picker";
import {
  Home,
  ArrowLeft,
  MapPin,
  DollarSign,
  Users,
  Settings,
  Plus,
  X,
  Save,
  Calendar,
} from "lucide-react";
import { useProperty, useUpdateProperty } from "@/hooks/usePropertyApi";

// Property form validation schema
const propertySchema = z.object({
  name: z
    .string()
    .min(1, "Property name is required")
    .max(200, "Property name must be less than 200 characters"),
  description: z.string().optional(),
  addressLine1: z
    .string()
    .min(1, "Address is required")
    .max(255, "Address must be less than 255 characters"),
  addressLine2: z
    .string()
    .max(255, "Address must be less than 255 characters")
    .optional(),
  city: z
    .string()
    .min(1, "City is required")
    .max(100, "City must be less than 100 characters"),
  state: z
    .string()
    .min(1, "State/Province is required")
    .max(100, "State must be less than 100 characters"),
  postalCode: z
    .string()
    .min(1, "Postal code is required")
    .max(20, "Postal code must be less than 20 characters"),
  country: z
    .string()
    .min(1, "Country is required")
    .max(100, "Country must be less than 100 characters"),
  propertyType: z.enum([
    "apartment",
    "house",
    "condo",
    "townhouse",
    "studio",
    "loft",
    "other",
  ]),
  bedrooms: z.number().min(0, "Bedrooms must be 0 or more"),
  bathrooms: z.number().min(0, "Bathrooms must be 0 or more"),
  maxOccupancy: z.number().min(1, "Max occupancy must be at least 1"),
  squareFeet: z.number().min(0, "Square feet must be 0 or more").optional(),
  basePrice: z.number().min(0, "Base price must be 0 or more"),
  cleaningFee: z.number().min(0, "Cleaning fee must be 0 or more"),
  securityDeposit: z.number().min(0, "Security deposit must be 0 or more"),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  houseRules: z.string().optional(),
  amenities: z.array(z.string()).default([]),
  icalUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  syncEnabled: z.boolean().default(false),
});

type PropertyFormData = z.infer<typeof propertySchema>;

const PROPERTY_TYPES = [
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" },
  { value: "studio", label: "Studio" },
  { value: "loft", label: "Loft" },
  { value: "other", label: "Other" },
] as const;

const COMMON_AMENITIES = [
  "WiFi",
  "Parking",
  "Kitchen",
  "Washing Machine",
  "Dryer",
  "Air Conditioning",
  "Heating",
  "TV",
  "Pool",
  "Gym",
  "Balcony",
  "Garden",
  "Pet Friendly",
  "Smoking Allowed",
];

export default function EditPropertyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: property, isLoading, error } = useProperty(id!);

  const updatePropertyMutation = useUpdateProperty();
  const [newAmenity, setNewAmenity] = useState("");

  const form = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: "",
      description: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      propertyType: "apartment" as const,
      bedrooms: 1,
      bathrooms: 1,
      maxOccupancy: 2,
      squareFeet: undefined,
      basePrice: 100,
      cleaningFee: 50,
      securityDeposit: 200,
      checkInTime: "",
      checkOutTime: "",
      houseRules: "",
      amenities: [] as string[],
    },
  });

  const { watch, setValue, reset } = form;
  const amenities = watch("amenities");

  // Helper function to format time from API response
  const formatTimeForInput = (timeValue: string | null | undefined): string => {
    if (!timeValue) return "";

    // If it's already in HH:MM format, return as is
    if (timeValue.match(/^\d{2}:\d{2}$/)) {
      return timeValue;
    }

    // If it's in HH:MM:SS format, extract HH:MM
    if (timeValue.match(/^\d{2}:\d{2}:\d{2}/)) {
      return timeValue.substring(0, 5);
    }

    // If it's a full datetime, extract the time part
    if (timeValue.includes("T") || timeValue.includes(" ")) {
      const date = new Date(timeValue);
      if (!isNaN(date.getTime())) {
        return date.toTimeString().substring(0, 5);
      }
    }

    return "";
  };

  // Load property data when it becomes available
  useEffect(() => {
    if (property) {
      reset({
        name: property.name,
        description: property.description || "",
        addressLine1: property.addressLine1,
        addressLine2: property.addressLine2 || "",
        city: property.city,
        state: property.state,
        postalCode: property.postalCode,
        country: property.country,
        propertyType: property.propertyType,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        maxOccupancy: property.maxOccupancy,
        squareFeet: property.squareFeet,
        basePrice: property.basePrice,
        cleaningFee: property.cleaningFee,
        securityDeposit: property.securityDeposit,
        checkInTime: formatTimeForInput(property.checkInTime),
        checkOutTime: formatTimeForInput(property.checkOutTime),
        houseRules: property.houseRules || "",
        amenities: property.amenities || [],
        icalUrl: property.icalUrl || "",
        syncEnabled: property.syncEnabled || false,
      });
    }
  }, [property, reset]);

  const onSubmit = async (data: PropertyFormData) => {
    try {
      // Process time fields - they're already in HH:MM format from TimePicker
      const processedData = {
        ...data,
        checkInTime:
          data.checkInTime && data.checkInTime.trim() !== ""
            ? `${data.checkInTime}:00`
            : undefined,
        checkOutTime:
          data.checkOutTime && data.checkOutTime.trim() !== ""
            ? `${data.checkOutTime}:00`
            : undefined,
        icalUrl: data.icalUrl && data.icalUrl.trim() !== "" ? data.icalUrl : undefined,
        syncEnabled: data.syncEnabled || false,
      };

      await updatePropertyMutation.mutateAsync({
        id: id!,
        data: processedData,
      });
      navigate(`/admin/properties/${id}`);
    } catch (error) {
      console.error("Failed to update property:", error);
    }
  };

  const addAmenity = (amenity: string) => {
    if (amenity && !(amenities || []).includes(amenity)) {
      setValue("amenities", [...(amenities || []), amenity]);
    }
    setNewAmenity("");
  };

  const removeAmenity = (amenityToRemove: string) => {
    setValue(
      "amenities",
      (amenities || []).filter((a) => a !== amenityToRemove)
    );
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/admin/properties/${id}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Property
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Property</h1>
          <p className="text-muted-foreground">
            Update {property.name} details
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Cozy Downtown Apartment"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="propertyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Type *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PROPERTY_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your property..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a detailed description of your property
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="addressLine1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 1 *</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main Street" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="addressLine2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 2</FormLabel>
                    <FormControl>
                      <Input placeholder="Apartment, suite, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <FormControl>
                        <Input placeholder="New York" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State/Province *</FormLabel>
                      <FormControl>
                        <Input placeholder="NY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code *</FormLabel>
                      <FormControl>
                        <Input placeholder="10001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country *</FormLabel>
                      <FormControl>
                        <Input placeholder="United States" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Property Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="bedrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bedrooms *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bathrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bathrooms *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.5"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxOccupancy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Occupancy *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="squareFeet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Square Feet</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="checkInTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Check-in Time</FormLabel>
                      <FormControl>
                        <TimePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select check-in time"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="checkOutTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Check-out Time</FormLabel>
                      <FormControl>
                        <TimePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select check-out time"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="basePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Price per Night *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                            $
                          </span>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            className="pl-8"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cleaningFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cleaning Fee</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                            $
                          </span>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            className="pl-8"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="securityDeposit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Security Deposit</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                            $
                          </span>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            className="pl-8"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Amenities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Amenities */}
              {(amenities || []).length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Amenities</Label>
                  <div className="flex flex-wrap gap-2">
                    {(amenities || []).map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="pr-1">
                        {amenity}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto p-1 ml-1"
                          onClick={() => removeAmenity(amenity)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Common Amenities */}
              <div className="space-y-2">
                <Label>Common Amenities</Label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_AMENITIES.filter(
                    (amenity) => !(amenities || []).includes(amenity)
                  ).map((amenity) => (
                    <Button
                      key={amenity}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addAmenity(amenity)}
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      {amenity}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Add Custom Amenity */}
              <div className="space-y-2">
                <Label>Add Custom Amenity</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter custom amenity"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addAmenity(newAmenity);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => addAmenity(newAmenity)}
                    disabled={!newAmenity.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Calendar Sync */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Calendar Sync
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="icalUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Booking Calendar URL (iCal)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/calendar.ics"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the iCal URL from your booking platform (Airbnb, Booking.com, etc.)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="syncEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Enable Calendar Sync
                      </FormLabel>
                      <FormDescription>
                        Automatically sync bookings from the external calendar
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* House Rules */}
          <Card>
            <CardHeader>
              <CardTitle>House Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="houseRules"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>House Rules</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., No smoking, No pets, Quiet hours after 10 PM..."
                        className="resize-none"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Specify any rules or restrictions for guests
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Error Display */}
          {updatePropertyMutation.error && (
            <Alert variant="destructive">
              <AlertDescription>
                {updatePropertyMutation.error.message ||
                  "Failed to update property. Please try again."}
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/admin/properties/${id}`)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updatePropertyMutation.isPending}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {updatePropertyMutation.isPending
                    ? "Saving..."
                    : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
