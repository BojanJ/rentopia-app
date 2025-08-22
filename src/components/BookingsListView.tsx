import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { MoreHorizontal, Edit, Eye, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Skeleton } from "./ui/skeleton";

import { useBookings } from "../hooks/useBookings";
import { useDeleteBooking } from "../hooks/useBookingApi";
import type { Booking } from "../types/booking";

const getStatusColor = (status: Booking["bookingStatus"]) => {
  switch (status) {
    case "confirmed":
      return "bg-green-500 hover:bg-green-600";
    case "pending":
      return "bg-yellow-500 hover:bg-yellow-600";
    case "checked_in":
      return "bg-blue-500 hover:bg-blue-600";
    case "checked_out":
      return "bg-gray-500 hover:bg-gray-600";
    case "cancelled":
      return "bg-red-500 hover:bg-red-600";
    case "no_show":
      return "bg-red-700 hover:bg-red-800";
    default:
      return "bg-gray-400 hover:bg-gray-500";
  }
};

const getStatusLabel = (status: Booking["bookingStatus"]) => {
  switch (status) {
    case "confirmed":
      return "Confirmed";
    case "pending":
      return "Pending";
    case "checked_in":
      return "Checked In";
    case "checked_out":
      return "Checked Out";
    case "cancelled":
      return "Cancelled";
    case "no_show":
      return "No Show";
    default:
      return status;
  }
};

interface BookingsListViewProps {
  propertyId: string;
  onBookingSelect?: (booking: Booking) => void;
}

export function BookingsListView({ propertyId, onBookingSelect }: BookingsListViewProps) {
  const navigate = useNavigate();
  const { data: bookingsResponse, isLoading, error } = useBookings({ propertyId });
  const deleteBookingMutation = useDeleteBooking();

  const bookings = bookingsResponse?.bookings || [];

  const handleEditBooking = (bookingId: string) => {
    console.log("🚀 Navigating to edit booking:", bookingId);
    console.log("🚀 Navigation path:", `/admin/bookings/${bookingId}/edit`);
    navigate(`/admin/bookings/${bookingId}/edit`);
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await deleteBookingMutation.mutateAsync(bookingId);
      } catch (error) {
        console.error("Failed to delete booking:", error);
      }
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load bookings. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No bookings found for this property.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Guest</TableHead>
            <TableHead>Check-in</TableHead>
            <TableHead>Check-out</TableHead>
            <TableHead>Guests</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{booking.guestName}</p>
                  {booking.guestEmail && (
                    <p className="text-sm text-muted-foreground">
                      {booking.guestEmail}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(booking.checkInDate), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                {format(new Date(booking.checkOutDate), "MMM d, yyyy")}
              </TableCell>
              <TableCell>{booking.numberOfGuests}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(booking.bookingStatus)}>
                  {getStatusLabel(booking.bookingStatus)}
                </Badge>
              </TableCell>
              <TableCell>${booking.totalAmount}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onBookingSelect?.(booking)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleEditBooking(booking.id)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteBooking(booking.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
