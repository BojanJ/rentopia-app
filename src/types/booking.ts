export interface Booking {
  id: string;
  propertyId: string;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  numberOfGuests: number;
  checkInDate: string;
  checkOutDate: string;
  nightsCount?: number;
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
  confirmationCode?: string;
  createdAt: string;
  updatedAt: string;
  property?: {
    id: string;
    name: string;
    city: string;
    state: string;
  };
  payments?: BookingPayment[];
  _count?: {
    maintenanceTasks: number;
  };
}

export interface BookingPayment {
  id: string;
  bookingId: string;
  amount: number;
  paymentDate: string;
  paymentMethod?: string;
  transactionId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingsResponse {
  bookings: Booking[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

// Keep the old interface for backwards compatibility
export interface BookingsResponseLegacy {
  data: Booking[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface BookingsQueryParams {
  status?: string;
  propertyId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}
