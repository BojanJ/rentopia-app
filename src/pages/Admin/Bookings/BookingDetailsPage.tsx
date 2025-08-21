import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  CalendarDays,
  User,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Users,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import { useBooking, useDeleteBooking } from "@/hooks/useBookingApi";

export default function BookingDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const deleteBookingMutation = useDeleteBooking();

  // Fetch the booking data
  const { data: booking, isLoading, error } = useBooking(id!, !!id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "checked_in":
        return "bg-blue-100 text-blue-800";
      case "checked_out":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "no_show":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "partial":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDeleteBooking = async () => {
    if (!id) return;
    
    if (window.confirm("Are you sure you want to delete this booking? This action cannot be undone.")) {
      try {
        await deleteBookingMutation.mutateAsync(id);
        navigate("/admin/bookings");
      } catch (error) {
        console.error("Failed to delete booking:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading booking...</span>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load booking. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/admin/bookings")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Booking Details</h1>
              <p className="text-muted-foreground">
                Booking for {booking.guestName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/admin/bookings/${id}/edit`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteBooking}
              disabled={deleteBookingMutation.isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {deleteBookingMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>

        {/* Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Booking Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Booking Status</p>
                <Badge className={getStatusColor(booking.bookingStatus)}>
                  {booking.bookingStatus.replace("_", " ")}
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Payment Status</p>
                <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                  {booking.paymentStatus}
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Confirmation Code</p>
                <p className="font-mono text-sm">
                  {booking.confirmationCode || "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guest Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Guest Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Guest Name</p>
                  <p className="text-lg font-semibold">{booking.guestName}</p>
                </div>
                {booking.guestEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.guestEmail}</span>
                  </div>
                )}
                {booking.guestPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.guestPhone}</span>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.numberOfGuests} guest{booking.numberOfGuests !== 1 ? 's' : ''}</span>
                </div>
                {booking.bookingSource && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Booking Source</p>
                    <p>{booking.bookingSource}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property & Dates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Property & Dates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {booking.property && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Property</p>
                    <p className="text-lg font-semibold">{booking.property.name}</p>
                    <p className="text-muted-foreground">
                      {booking.property.city}, {booking.property.state}
                    </p>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Check-in Date</p>
                  <p className="text-lg">
                    {format(new Date(booking.checkInDate), "EEEE, MMMM dd, yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Check-out Date</p>
                  <p className="text-lg">
                    {format(new Date(booking.checkOutDate), "EEEE, MMMM dd, yyyy")}
                  </p>
                </div>
                {booking.nightsCount && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Duration</p>
                    <p>{booking.nightsCount} night{booking.nightsCount !== 1 ? 's' : ''}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pricing Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Base Amount</span>
                <span>${booking.baseAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Cleaning Fee</span>
                <span>${booking.cleaningFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>${booking.taxes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Security Deposit</span>
                <span>${booking.securityDeposit.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Amount</span>
                <span>${booking.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Special Requests & Notes */}
        {(booking.specialRequests || booking.internalNotes) && (
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {booking.specialRequests && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Special Requests
                  </p>
                  <p className="text-sm bg-muted p-3 rounded-md">
                    {booking.specialRequests}
                  </p>
                </div>
              )}
              {booking.internalNotes && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Internal Notes
                  </p>
                  <p className="text-sm bg-muted p-3 rounded-md">
                    {booking.internalNotes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Timestamps */}
        <Card>
          <CardHeader>
            <CardTitle>Booking History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">Created</p>
                <p>{format(new Date(booking.createdAt), "MMM dd, yyyy 'at' h:mm a")}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Last Updated</p>
                <p>{format(new Date(booking.updatedAt), "MMM dd, yyyy 'at' h:mm a")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
