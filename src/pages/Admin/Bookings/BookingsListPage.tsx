import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CalendarDays,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Users,
} from "lucide-react";
import { useBookings } from "@/hooks/useBookings";
import { useDeleteBooking } from "@/hooks/useBookingApi";
import { useProperties } from "@/hooks/useProperties";

export default function BookingsListPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  
  const { properties } = useProperties();
  const { data: bookingsResponse, isLoading } = useBookings({
    propertyId: selectedProperty !== "all" ? selectedProperty : undefined,
    status: selectedStatus !== "all" ? selectedStatus : undefined,
  });
  
  const deleteBookingMutation = useDeleteBooking();

  const bookings = bookingsResponse?.bookings || [];

  // Filter bookings based on search term
  const filteredBookings = bookings.filter((booking) =>
    booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.guestEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.confirmationCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleDeleteBooking = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await deleteBookingMutation.mutateAsync(id);
      } catch (error) {
        console.error("Failed to delete booking:", error);
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Bookings</h1>
            <p className="text-muted-foreground">
              Manage your property bookings
            </p>
          </div>
          <Button onClick={() => navigate("/admin/bookings/add")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Booking
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by guest name, email, or confirmation code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter by property" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="checked_in">Checked In</SelectItem>
                  <SelectItem value="checked_out">Checked Out</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="no_show">No Show</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Bookings ({filteredBookings.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading bookings...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-8">
                <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium">
                  No bookings found
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchTerm || selectedProperty !== "all" || selectedStatus !== "all"
                    ? "Try adjusting your search or filters"
                    : "Get started by adding your first booking"}
                </p>
                {!(searchTerm || selectedProperty !== "all" || selectedStatus !== "all") && (
                  <Button
                    className="mt-4"
                    onClick={() => navigate("/admin/bookings/add")}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Booking
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guest</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Guests</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead className="w-[70px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{booking.guestName}</div>
                            {booking.guestEmail && (
                              <div className="text-sm text-muted-foreground">
                                {booking.guestEmail}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {booking.property?.name || "Unknown Property"}
                          </div>
                          {booking.property && (
                            <div className="text-sm text-muted-foreground">
                              {booking.property.city}, {booking.property.state}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>Check-in: {format(new Date(booking.checkInDate), "MMM dd, yyyy")}</div>
                            <div>Check-out: {format(new Date(booking.checkOutDate), "MMM dd, yyyy")}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{booking.numberOfGuests}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(booking.bookingStatus)}>
                            {booking.bookingStatus.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                            {booking.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            ${booking.totalAmount.toFixed(2)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => navigate(`/admin/bookings/${booking.id}`)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => navigate(`/admin/bookings/${booking.id}/edit`)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteBooking(booking.id)}
                                className="text-destructive"
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
