"use client";

import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
} from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Eye,
  Plus,
  Edit,
  MoreHorizontal,
  List,
  Calendar,
} from "lucide-react";
import * as React from "react";
import { useNavigate } from "react-router-dom";

import { Alert, AlertDescription } from "../../components/ui/alert";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";

import { demoProperties } from "../../data/demoProperties";
import { useBookingCalendar } from "../../hooks/useBookings";
import { usePropertyStore } from "../../store/propertyStore";
import type { Booking } from "../../types/booking";
import { BookingsListView } from "../../components/BookingsListView";

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

interface BookingDetailsDialogProps {
  booking: Booking;
  children: React.ReactNode;
}

function BookingDetailsDialog({
  booking,
  children,
}: BookingDetailsDialogProps) {
  const navigate = useNavigate();

  const handleEditBooking = () => {
    console.log("🚀 Calendar: Navigating to edit booking:", booking.id);
    console.log("🚀 Calendar: Navigation path:", `/admin/bookings/${booking.id}/edit`);
    navigate(`/admin/bookings/${booking.id}/edit`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Booking Details
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEditBooking}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Booking
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </DialogTitle>
          <DialogDescription>
            {booking.confirmationCode &&
              `Confirmation: ${booking.confirmationCode}`}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Guest</label>
              <p className="font-medium">{booking.guestName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Guests
              </label>
              <p className="font-medium">{booking.numberOfGuests}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Check-in
              </label>
              <p className="font-medium">
                {format(new Date(booking.checkInDate), "PPP")}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Check-out
              </label>
              <p className="font-medium">
                {format(new Date(booking.checkOutDate), "PPP")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Status
              </label>
              <Badge className={getStatusColor(booking.bookingStatus)}>
                {getStatusLabel(booking.bookingStatus)}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Total Amount
              </label>
              <p className="font-medium">${booking.totalAmount}</p>
            </div>
          </div>

          {booking.guestEmail && (
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="font-medium">{booking.guestEmail}</p>
            </div>
          )}

          {booking.guestPhone && (
            <div>
              <label className="text-sm font-medium text-gray-500">Phone</label>
              <p className="font-medium">{booking.guestPhone}</p>
            </div>
          )}

          {booking.specialRequests && (
            <div>
              <label className="text-sm font-medium text-gray-500">
                Special Requests
              </label>
              <p className="text-sm">{booking.specialRequests}</p>
            </div>
          )}

          {booking.internalNotes && (
            <div>
              <label className="text-sm font-medium text-gray-500">
                Internal Notes
              </label>
              <p className="text-sm">{booking.internalNotes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function BookingsPage() {
  const { selectedProperty, setSelectedProperty } = usePropertyStore();
  const navigate = useNavigate();

  // For testing purposes, automatically set a demo property if none is selected
  React.useEffect(() => {
    if (!selectedProperty && demoProperties.length > 0) {
      console.log("🏠 Setting demo property for testing");
      setSelectedProperty(demoProperties[0]);
    }
  }, [selectedProperty, setSelectedProperty]);

  console.log("🏠 Selected Property:", selectedProperty);

  const {
    currentDate,
    bookings,
    isLoading,
    error,
    goToNextMonth,
    goToPreviousMonth,
    goToToday,
    getBookingsForDate,
  } = useBookingCalendar(selectedProperty?.id || "");

  console.log("🚀 ~ BookingsPage ~ bookings:", bookings);
  console.log("🔄 ~ BookingsPage ~ isLoading:", isLoading);
  console.log("❌ ~ BookingsPage ~ error:", error);

  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date()
  );

  const handleAddBooking = () => {
    navigate("/admin/bookings/add");
  };

  if (!selectedProperty) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertDescription>
            Please select a property to view bookings.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load bookings. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const selectedDateBookings = selectedDate
    ? getBookingsForDate(selectedDate)
    : [];

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
            <p className="text-muted-foreground">
              Manage bookings for {selectedProperty.name}
            </p>
          </div>
          <Button onClick={handleAddBooking}>
            <Plus className="mr-2 h-4 w-4" />
            Add Booking
          </Button>
        </div>

        {/* Tabs for Calendar and List Views */}
        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Calendar View
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              List View
            </TabsTrigger>
          </TabsList>

          {/* Calendar View */}
          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle>{format(currentDate, "MMMM yyyy")}</CardTitle>
                  <CardDescription>
                    {bookings.length} booking{bookings.length !== 1 ? "s" : ""}{" "}
                    this month
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousMonth}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={goToToday}>
                    Today
                  </Button>
                  <Button variant="outline" size="sm" onClick={goToNextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-7 gap-2">
                      {Array.from({ length: 35 }).map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Weekday headers */}
                    <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-muted-foreground">
                      <div>Sun</div>
                      <div>Mon</div>
                      <div>Tue</div>
                      <div>Wed</div>
                      <div>Thu</div>
                      <div>Fri</div>
                      <div>Sat</div>
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-2">
                      {/* Empty cells for days before month starts */}
                      {Array.from({
                        length: startOfMonth(currentDate).getDay(),
                      }).map((_, i) => (
                        <div key={`empty-${i}`} className="h-20" />
                      ))}

                      {/* Calendar days */}
                      {daysInMonth.map((day) => {
                        const dayBookings = getBookingsForDate(day);
                        const isSelected =
                          selectedDate && isSameDay(day, selectedDate);
                        const isDayToday = isToday(day);
                        const hasBookings = dayBookings.length > 0;

                        return (
                          <TooltipProvider key={day.toISOString()}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => setSelectedDate(day)}
                                  className={`
                                    h-20 p-2 rounded-lg border-2 transition-colors
                                    ${
                                      isSelected
                                        ? "border-primary bg-primary/10"
                                        : "border-transparent hover:border-gray-200"
                                    }
                                    ${isDayToday ? "bg-primary/5" : ""}
                                    ${
                                      hasBookings
                                        ? "bg-blue-50"
                                        : "hover:bg-gray-50"
                                    }
                                  `}
                                >
                                  <div className="flex flex-col h-full">
                                    <span
                                      className={`
                                      text-sm font-medium
                                      ${
                                        isDayToday
                                          ? "text-primary font-bold"
                                          : ""
                                      }
                                      ${
                                        !isSameMonth(day, currentDate)
                                          ? "text-muted-foreground"
                                          : ""
                                      }
                                    `}
                                    >
                                      {format(day, "d")}
                                    </span>
                                    <div className="flex-1 flex flex-col justify-center space-y-1">
                                      {dayBookings
                                        .slice(0, 2)
                                        .map((booking) => (
                                          <div
                                            key={booking.id}
                                            className={`
                                            w-full h-1.5 rounded-full
                                            ${getStatusColor(
                                              booking.bookingStatus
                                            ).replace("hover:", "")}
                                          `}
                                          />
                                        ))}
                                      {dayBookings.length > 2 && (
                                        <span className="text-xs text-muted-foreground">
                                          +{dayBookings.length - 2}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="space-y-1">
                                  <p className="font-medium">
                                    {format(day, "PPP")}
                                  </p>
                                  {dayBookings.length === 0 ? (
                                    <p className="text-sm">No bookings</p>
                                  ) : (
                                    <div className="space-y-1">
                                      {dayBookings.map((booking) => (
                                        <p key={booking.id} className="text-sm">
                                          {booking.guestName} -{" "}
                                          {getStatusLabel(
                                            booking.bookingStatus
                                          )}
                                        </p>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Date Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  {selectedDate ? format(selectedDate, "PPP") : "Select a date"}
                </CardTitle>
                {selectedDateBookings.length > 0 && (
                  <CardDescription>
                    {selectedDateBookings.length} booking
                    {selectedDateBookings.length !== 1 ? "s" : ""}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {selectedDateBookings.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No bookings for this date
                  </p>
                ) : (
                  <div className="space-y-3">
                    {selectedDateBookings.map((booking) => (
                      <BookingDetailsDialog key={booking.id} booking={booking}>
                        <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-medium">{booking.guestName}</p>
                              <p className="text-sm text-muted-foreground">
                                {booking.numberOfGuests} guest
                                {booking.numberOfGuests !== 1 ? "s" : ""}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge
                                className={getStatusColor(
                                  booking.bookingStatus
                                )}
                              >
                                {getStatusLabel(booking.bookingStatus)}
                              </Badge>
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            {format(new Date(booking.checkInDate), "MMM d")} -{" "}
                            {format(new Date(booking.checkOutDate), "MMM d")}
                          </div>
                        </div>
                      </BookingDetailsDialog>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Booking Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total Bookings
                    </span>
                    <span className="font-medium">{bookings.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Confirmed
                    </span>
                    <span className="font-medium">
                      {
                        bookings.filter((b) => b.bookingStatus === "confirmed")
                          .length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Pending
                    </span>
                    <span className="font-medium">
                      {
                        bookings.filter((b) => b.bookingStatus === "pending")
                          .length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Revenue
                    </span>
                    <span className="font-medium">
                      $
                      {bookings
                        .filter((b) => b.bookingStatus !== "cancelled")
                        .reduce((sum, b) => sum + Number(b.totalAmount), 0)
                        .toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
            </div>
          </TabsContent>

          {/* List View */}
          <TabsContent value="list" className="space-y-6">
            <BookingsListView 
              propertyId={selectedProperty.id} 
              onBookingSelect={() => {}} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
