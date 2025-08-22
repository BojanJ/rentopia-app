import { api } from "../lib/apiClient";
import type {
  Booking,
  BookingsResponse,
  BookingsQueryParams,
  BookingResponse,
} from "../types/booking";
import { demoBookings } from "../data/demoBookings";

export class BookingService {
  private static readonly BASE_URL = "/bookings";

  /**
   * Get all bookings with optional filters
   */
  static async getBookings(
    params?: BookingsQueryParams
  ): Promise<BookingsResponse> {
    console.log("🔍 API Request - getBookings params:", params);

    const searchParams = new URLSearchParams();

    if (params?.status) searchParams.append("status", params.status);
    if (params?.propertyId)
      searchParams.append("propertyId", params.propertyId);
    if (params?.startDate) searchParams.append("startDate", params.startDate);
    if (params?.endDate) searchParams.append("endDate", params.endDate);
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.offset) searchParams.append("offset", params.offset.toString());

    const url = `${this.BASE_URL}${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    console.log("🌐 Making API call to:", url);

    try {
      const response = await api.get<BookingsResponse>(url);
      console.log("✅ API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ API Error:", error);

      // Fallback to demo data for development
      let filteredBookings = demoBookings;

      // Apply property filter if specified
      if (params?.propertyId) {
        filteredBookings = filteredBookings.filter(
          (booking) => booking.propertyId === params.propertyId
        );
      }

      // Apply status filter if specified
      if (params?.status) {
        filteredBookings = filteredBookings.filter(
          (booking) => booking.bookingStatus === params.status
        );
      }

      console.log("📝 Returning demo bookings:", filteredBookings);

      // Return demo data with pagination structure
      return {
        bookings: filteredBookings,
        pagination: {
          total: filteredBookings.length,
          limit: params?.limit || 50,
          offset: params?.offset || 0,
          hasMore: false,
        },
      };
    }
  }

  /**
   * Get a specific booking by ID
   */
  static async getBooking(id: string): Promise<Booking> {
    try {
      const response = await api.get<BookingResponse>(`${this.BASE_URL}/${id}`);
      return response.data.booking;
    } catch (error) {
      console.error("❌ API Error getting booking:", error);

      // Fallback to demo data for development
      const demoBooking = demoBookings.find((booking) => booking.id === id);
      if (demoBooking) {
        console.log("📝 Returning demo booking:", demoBooking);
        return demoBooking;
      }

      throw error;
    }
  }

  /**
   * Get bookings for a specific property and date range
   */
  static async getBookingsForProperty(
    propertyId: string,
    startDate?: string,
    endDate?: string
  ): Promise<Booking[]> {
    console.log("🏠 Getting bookings for property:", {
      propertyId,
      startDate,
      endDate,
    });

    try {
      const response = await this.getBookings({
        propertyId,
        startDate,
        endDate,
        limit: 1000, // Get all bookings for the date range
      });

      console.log("🏠 Property bookings response:", response);

      // Make sure we return an array, not undefined
      return response?.bookings || [];
    } catch (error) {
      console.error("❌ Error getting bookings for property:", error);
      // Return empty array instead of letting undefined propagate
      return [];
    }
  }

  /**
   * Get bookings for a specific month
   */
  static async getBookingsForMonth(
    propertyId: string,
    year: number,
    month: number
  ): Promise<Booking[]> {
    console.log("📅 Getting bookings for month:", { propertyId, year, month });

    try {
      const startDate = new Date(year, month, 1).toISOString().split("T")[0];
      const endDate = new Date(year, month + 1, 0).toISOString().split("T")[0];

      console.log("📅 Date range:", { startDate, endDate });

      const response = await this.getBookingsForProperty(
        propertyId,
        startDate,
        endDate
      );
      console.log("📅 Month bookings response:", response);

      // Ensure we always return an array
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error("❌ Error getting bookings for month:", error);
      // Return empty array instead of letting undefined propagate
      return [];
    }
  }

  /**
   * Create a new booking
   */
  static async createBooking(bookingData: Partial<Booking>): Promise<Booking> {
    const response = await api.post<Booking>(this.BASE_URL, bookingData);
    return response.data;
  }

  /**
   * Update an existing booking
   */
  static async updateBooking(
    id: string,
    bookingData: Partial<Booking>
  ): Promise<Booking> {
    const response = await api.put<Booking>(
      `${this.BASE_URL}/${id}`,
      bookingData
    );
    return response.data;
  }

  /**
   * Delete a booking
   */
  static async deleteBooking(id: string): Promise<void> {
    await api.delete(`${this.BASE_URL}/${id}`);
  }
}

export default BookingService;
