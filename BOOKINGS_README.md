# Bookings Calendar Page

## Overview

The Bookings page provides a comprehensive calendar view for managing property bookings in the Rentopia application. It features a large, interactive calendar component with month-by-month navigation and detailed booking information.

## Features

### Calendar View
- **Large Calendar Display**: Monthly calendar with clear day-by-day visualization
- **Month Navigation**: Previous/Next month buttons and "Today" quick navigation
- **Visual Booking Indicators**: Color-coded bars on calendar days showing booking status
- **Interactive Date Selection**: Click any date to view detailed booking information

### Booking Status Colors
- **Green**: Confirmed bookings
- **Yellow**: Pending bookings  
- **Blue**: Checked-in guests
- **Gray**: Checked-out guests
- **Red**: Cancelled bookings
- **Dark Red**: No-show bookings

### Sidebar Information
- **Selected Date Details**: Shows all bookings for the selected date
- **Booking Cards**: Display guest name, guest count, status, and date range
- **Monthly Statistics**: Total bookings, confirmed, pending, and revenue summaries

### Responsive Design
- **Desktop Layout**: Calendar takes 2/3 width, sidebar takes 1/3
- **Mobile Layout**: Stacked layout with calendar first, then sidebar
- **Touch-Friendly**: Large touch targets for mobile navigation

## Files Structure

```
src/
├── pages/Dashboard/
│   ├── BookingsPage.tsx          # Main bookings page component
│   └── BookingsTestPage.tsx      # Demo version for testing
├── types/
│   └── booking.ts                # TypeScript interfaces for bookings
├── services/
│   └── bookingService.ts         # API service for booking operations
├── hooks/
│   └── useBookings.ts            # Custom hooks for booking data
└── data/
    └── booking.ts                # TypeScript interfaces for booking data
```

## API Integration

### Endpoints Used
- `GET /api/bookings` - Fetch bookings with optional filters
- `GET /api/bookings/:id` - Get specific booking details

### Query Parameters
- `propertyId` - Filter by property
- `status` - Filter by booking status
- `startDate` - Filter by date range start
- `endDate` - Filter by date range end
- `limit` - Pagination limit
- `offset` - Pagination offset

## Dependencies

### UI Components (shadcn/ui)
- Button
- Card (CardContent, CardDescription, CardHeader, CardTitle)
- Badge
- Alert
- Dialog
- Tooltip
- Skeleton (for loading states)

### External Libraries
- `date-fns` - Date manipulation and formatting
- `lucide-react` - Icons
- `@tanstack/react-query` - Data fetching and caching

## Usage

### Navigation
Add this route to your router configuration:
```tsx
<Route path="bookings" element={<BookingsPage />} />
```

### Property Selection
The page requires a selected property from the property store:
```tsx
const { selectedProperty } = usePropertyStore()
```

## Features Implemented

✅ **Month-by-Month Calendar Navigation**
- Previous/Next month buttons
- Jump to current month
- Visual month/year display

✅ **Booking Visualization**
- Color-coded status indicators on calendar
- Multiple bookings per day support
- Overflow indicators (+N more)

✅ **Interactive Date Selection**
- Click dates to view details
- Highlighted selected date
- Today highlighting

✅ **Detailed Booking Information**
- Guest details display
- Booking status and amounts
- Date ranges and special requests

✅ **Responsive Design**
- Mobile-friendly layout
- Touch interactions
- Proper spacing and typography

✅ **Loading and Error States**
- Skeleton loading animation
- Error message display
- Graceful fallbacks

## Future Enhancements

### Planned Features
- **Booking Creation**: Add new booking dialog
- **Booking Editing**: Inline editing of booking details
- **Quick Actions**: Check-in/check-out buttons
- **Filtering**: Status and date range filters
- **Export**: Calendar export functionality
- **Drag & Drop**: Move bookings between dates
- **Multi-Property**: Switch between properties
- **Booking Conflicts**: Visual conflict detection

### Performance Optimizations
- Virtual scrolling for large date ranges
- Booking data caching
- Optimistic updates
- Background data refresh

## Testing

### Test Routes
- `/dashboard/bookings` - Full authenticated experience
- `/dashboard/bookings-test` - Demo mode without authentication

### Demo Data
The application includes realistic demo booking data for testing all calendar states and interactions.

## Accessibility

- Keyboard navigation support
- Screen reader friendly
- High contrast mode compatibility
- Focus management
- ARIA labels and descriptions
