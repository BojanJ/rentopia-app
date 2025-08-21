import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, differenceInDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  ArrowLeft,
  CalendarDays,
  User,
  DollarSign,
  Settings,
} from "lucide-react";
import { useCreateBooking } from "@/hooks/useBookingApi";
import { useProperties } from "@/hooks/useProperties";

// Booking form validation schema
const bookingSchema = z.object({
  propertyId: z.string().min(1, "Property is required"),
  guestName: z.string()
    .min(1, "Guest name is required")
    .max(100, "Guest name must be less than 100 characters"),
  guestEmail: z.string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  guestPhone: z.string()
    .max(20, "Phone number must be less than 20 characters")
    .optional()
    .or(z.literal("")),
  numberOfGuests: z.number().min(1, "Number of guests must be at least 1"),
  checkInDate: z.string().min(1, "Check-in date is required"),
  checkOutDate: z.string().min(1, "Check-out date is required"),
  baseAmount: z.number().min(0, "Base amount must be 0 or more"),
  cleaningFee: z.number().min(0, "Cleaning fee must be 0 or more"),
  taxes: z.number().min(0, "Taxes must be 0 or more"),
  securityDeposit: z.number().min(0, "Security deposit must be 0 or more"),
  bookingStatus: z.enum(["pending", "confirmed", "checked_in", "checked_out", "cancelled", "no_show"]),
  paymentStatus: z.enum(["pending", "partial", "paid", "refunded"]),
  specialRequests: z.string().optional(),
  internalNotes: z.string().optional(),
  bookingSource: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const BOOKING_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "checked_in", label: "Checked In" },
  { value: "checked_out", label: "Checked Out" },
  { value: "cancelled", label: "Cancelled" },
  { value: "no_show", label: "No Show" },
] as const;

const PAYMENT_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "partial", label: "Partial" },
  { value: "paid", label: "Paid" },
  { value: "refunded", label: "Refunded" },
] as const;

export default function AddBookingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const createBookingMutation = useCreateBooking();
  const { properties } = useProperties();
  
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [nightsCount, setNightsCount] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      propertyId: searchParams.get("propertyId") || "",
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      numberOfGuests: 1,
      checkInDate: "",
      checkOutDate: "",
      baseAmount: 0,
      cleaningFee: 0,
      taxes: 0,
      securityDeposit: 0,
      bookingStatus: "pending",
      paymentStatus: "pending",
      specialRequests: "",
      internalNotes: "",
      bookingSource: "direct",
    },
  });

  const { watch, setValue } = form;
  const watchedValues = watch();

  // Calculate nights and total when dates or amounts change
  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      const nights = differenceInDays(dateRange.to, dateRange.from);
      setNightsCount(nights);
      
      setValue("checkInDate", format(dateRange.from, "yyyy-MM-dd"));
      setValue("checkOutDate", format(dateRange.to, "yyyy-MM-dd"));
      
      // Calculate total amount
      const baseTotal = watchedValues.baseAmount * nights;
      const total = baseTotal + watchedValues.cleaningFee + watchedValues.taxes;
      setTotalAmount(total);
    } else {
      setNightsCount(0);
      setTotalAmount(0);
    }
  }, [dateRange, watchedValues.baseAmount, watchedValues.cleaningFee, watchedValues.taxes, setValue]);

  // Auto-populate property details when property is selected
  useEffect(() => {
    const selectedProperty = properties.find(p => p.id === watchedValues.propertyId);
    if (selectedProperty) {
      setValue("baseAmount", selectedProperty.basePrice);
      setValue("cleaningFee", selectedProperty.cleaningFee);
      setValue("securityDeposit", selectedProperty.securityDeposit);
    }
  }, [watchedValues.propertyId, properties, setValue]);

  const onSubmit = async (data: BookingFormData) => {
    try {
      const bookingData = {
        ...data,
        totalAmount,
        guestEmail: data.guestEmail || undefined,
        guestPhone: data.guestPhone || undefined,
        specialRequests: data.specialRequests || undefined,
        internalNotes: data.internalNotes || undefined,
        bookingSource: data.bookingSource || undefined,
      };
      
      const result = await createBookingMutation.mutateAsync(bookingData);
      navigate(`/admin/bookings/${result.id}`);
    } catch (error) {
      console.error("Failed to create booking:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/admin/bookings")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Add New Booking</h1>
            <p className="text-muted-foreground">
              Create a new booking for your property
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Property Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Property & Guest Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="propertyId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a property" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {properties.map((property) => (
                              <SelectItem key={property.id} value={property.id}>
                                {property.name} - {property.city}, {property.state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="numberOfGuests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Guests</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
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
                    name="guestName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Guest Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter guest name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="guestEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Guest Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="guest@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="guestPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guest Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  Booking Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="dateRange">Check-in and Check-out Dates</Label>
                  <DateRangePicker
                    date={dateRange}
                    onDateChange={setDateRange}
                    placeholder="Pick check-in and check-out dates"
                    className="mt-2"
                  />
                  {nightsCount > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {nightsCount} night{nightsCount !== 1 ? 's' : ''}
                    </p>
                  )}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="baseAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Base Price per Night</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
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
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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
                    name="taxes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Taxes</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
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
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Total Calculation */}
                {nightsCount > 0 && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Base price ({nightsCount} nights × ${watchedValues.baseAmount})</span>
                        <span>${(watchedValues.baseAmount * nightsCount).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cleaning fee</span>
                        <span>${watchedValues.cleaningFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxes</span>
                        <span>${watchedValues.taxes.toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status & Additional Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Status & Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="bookingStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Booking Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {BOOKING_STATUSES.map((status) => (
                              <SelectItem key={status.value} value={status.value}>
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PAYMENT_STATUSES.map((status) => (
                              <SelectItem key={status.value} value={status.value}>
                                {status.label}
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
                  name="bookingSource"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Booking Source</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Airbnb, Booking.com, Direct" {...field} />
                      </FormControl>
                      <FormDescription>
                        Where did this booking come from?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specialRequests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Requests</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any special requests from the guest..."
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="internalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Internal Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Internal notes (not visible to guest)..."
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Error Display */}
            {createBookingMutation.error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {createBookingMutation.error.message || "Failed to create booking. Please try again."}
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
                    onClick={() => navigate("/admin/bookings")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createBookingMutation.isPending || !dateRange?.from || !dateRange?.to}
                  >
                    {createBookingMutation.isPending ? "Creating..." : "Create Booking"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
