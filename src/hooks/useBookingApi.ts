import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookingService } from "../services/bookingService";

export interface CreateBookingRequest {
  propertyId: string;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  numberOfGuests: number;
  checkInDate: string;
  checkOutDate: string;
  baseAmount: number;
  cleaningFee: number;
  taxes: number;
  totalAmount: number;
  securityDeposit: number;
  bookingStatus: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show';
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded';
  specialRequests?: string;
  internalNotes?: string;
  bookingSource?: string;
}

export interface UpdateBookingRequest extends Partial<CreateBookingRequest> {
  id: string;
}

// Hook to get a single booking by ID
export function useBooking(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => BookingService.getBooking(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to create a new booking
export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookingRequest) => BookingService.createBooking(data),
    onSuccess: (newBooking) => {
      // Invalidate and refetch bookings
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      
      // Add the new booking to the cache
      queryClient.setQueryData(["booking", newBooking.id], newBooking);
    },
    onError: (error) => {
      console.error("Failed to create booking:", error);
    },
  });
}

// Hook to update an existing booking
export function useUpdateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateBookingRequest> }) =>
      BookingService.updateBooking(id, data),
    onSuccess: (updatedBooking) => {
      // Invalidate and refetch bookings
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      
      // Update the specific booking in the cache
      queryClient.setQueryData(["booking", updatedBooking.id], updatedBooking);
    },
    onError: (error) => {
      console.error("Failed to update booking:", error);
    },
  });
}

// Hook to delete a booking
export function useDeleteBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => BookingService.deleteBooking(id),
    onSuccess: (_, deletedId) => {
      // Invalidate and refetch bookings
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      
      // Remove the booking from the cache
      queryClient.removeQueries({ queryKey: ["booking", deletedId] });
    },
    onError: (error) => {
      console.error("Failed to delete booking:", error);
    },
  });
}
