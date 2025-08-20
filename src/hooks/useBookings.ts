import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookingService } from "../services/bookingService";
import type { Booking } from "../types/booking";

export interface UseBookingsOptions {
  propertyId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  enabled?: boolean;
}

export function useBookings(options: UseBookingsOptions = {}) {
  const { propertyId, status, startDate, endDate, enabled = true } = options;

  return useQuery({
    queryKey: ["bookings", { propertyId, status, startDate, endDate }],
    queryFn: async () => {
      try {
        const response = await BookingService.getBookings({
          propertyId,
          status,
          startDate,
          endDate,
          limit: 1000,
        });
        // Ensure we always return a valid response
        return response || { bookings: [], pagination: { total: 0, limit: 1000, offset: 0, hasMore: false } };
      } catch (error) {
        console.error("❌ useBookings query error:", error);
        // Return empty response on error to prevent undefined
        return { bookings: [], pagination: { total: 0, limit: 1000, offset: 0, hasMore: false } };
      }
    },
    enabled: enabled && !!propertyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function useBookingsForMonth(
  propertyId: string,
  year: number,
  month: number
) {
  return useQuery({
    queryKey: ["bookings", "month", propertyId, year, month],
    queryFn: async () => {
      try {
        const result = await BookingService.getBookingsForMonth(propertyId, year, month);
        // Ensure we always return an array
        return Array.isArray(result) ? result : [];
      } catch (error) {
        console.error("❌ useBookingsForMonth query error:", error);
        // Return empty array on error to prevent undefined
        return [];
      }
    },
    enabled: !!propertyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => BookingService.getBooking(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useBookingCalendar(propertyId: string) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  console.log("📅 useBookingCalendar called with:", { propertyId, year, month });

  const {
    data: bookings,
    isLoading,
    error,
    refetch,
  } = useBookingsForMonth(propertyId, year, month);

  console.log("📅 useBookingCalendar state:", { bookings, isLoading, error });

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getBookingsForDate = (date: Date): Booking[] => {
    if (!bookings) return [];

    const dateStr = date.toISOString().split("T")[0];
    return bookings.filter((booking) => {
      const checkIn = new Date(booking.checkInDate).toISOString().split("T")[0];
      const checkOut = new Date(booking.checkOutDate)
        .toISOString()
        .split("T")[0];
      return dateStr >= checkIn && dateStr < checkOut;
    });
  };

  const isDateBooked = (date: Date): boolean => {
    return getBookingsForDate(date).length > 0;
  };

  const getBookingStatusForDate = (
    date: Date
  ): Booking["bookingStatus"] | null => {
    const bookings = getBookingsForDate(date);
    if (bookings.length === 0) return null;

    // Return the status of the first booking for the date
    // In case of multiple bookings, you might want to handle this differently
    return bookings[0].bookingStatus;
  };

  return {
    currentDate,
    year,
    month,
    bookings: bookings || [],
    isLoading,
    error,
    refetch,
    goToNextMonth,
    goToPreviousMonth,
    goToToday,
    getBookingsForDate,
    isDateBooked,
    getBookingStatusForDate,
  };
}
