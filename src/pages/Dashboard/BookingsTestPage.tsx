"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Eye } from "lucide-react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns"

import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { demoBookings } from "../../data/demoBookings"
import type { Booking } from "../../types/booking"

const getStatusColor = (status: Booking['bookingStatus']) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-500 hover:bg-green-600 text-white'
    case 'pending':
      return 'bg-yellow-500 hover:bg-yellow-600 text-white'
    case 'checked_in':
      return 'bg-blue-500 hover:bg-blue-600 text-white'
    case 'checked_out':
      return 'bg-gray-500 hover:bg-gray-600 text-white'
    case 'cancelled':
      return 'bg-red-500 hover:bg-red-600 text-white'
    case 'no_show':
      return 'bg-red-700 hover:bg-red-800 text-white'
    default:
      return 'bg-gray-400 hover:bg-gray-500 text-white'
  }
}

const getStatusLabel = (status: Booking['bookingStatus']) => {
  switch (status) {
    case 'confirmed':
      return 'Confirmed'
    case 'pending':
      return 'Pending'
    case 'checked_in':
      return 'Checked In'
    case 'checked_out':
      return 'Checked Out'
    case 'cancelled':
      return 'Cancelled'
    case 'no_show':
      return 'No Show'
    default:
      return status
  }
}

export default function BookingsTestPage() {
  const [currentDate, setCurrentDate] = React.useState(new Date())
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date())
  
  // Use demo bookings for testing
  const bookings = demoBookings

  const goToNextMonth = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const goToPreviousMonth = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const getBookingsForDate = (date: Date): Booking[] => {
    const dateStr = date.toISOString().split('T')[0]
    return bookings.filter(booking => {
      const checkIn = new Date(booking.checkInDate).toISOString().split('T')[0]
      const checkOut = new Date(booking.checkOutDate).toISOString().split('T')[0]
      return dateStr >= checkIn && dateStr < checkOut
    })
  }

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  })

  const selectedDateBookings = selectedDate ? getBookingsForDate(selectedDate) : []

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bookings Calendar</h1>
            <p className="text-muted-foreground">
              Manage bookings for Downtown Modern Apartment (Demo)
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Booking
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle>{format(currentDate, 'MMMM yyyy')}</CardTitle>
                  <CardDescription>
                    {bookings.length} booking{bookings.length !== 1 ? 's' : ''} total
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
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
                    {Array.from({ length: startOfMonth(currentDate).getDay() }).map((_, i) => (
                      <div key={`empty-${i}`} className="h-20" />
                    ))}

                    {/* Calendar days */}
                    {daysInMonth.map((day) => {
                      const dayBookings = getBookingsForDate(day)
                      const isSelected = selectedDate && isSameDay(day, selectedDate)
                      const isDayToday = isToday(day)
                      const hasBookings = dayBookings.length > 0

                      return (
                        <button
                          key={day.toISOString()}
                          onClick={() => setSelectedDate(day)}
                          className={`
                            h-20 p-2 rounded-lg border-2 transition-colors
                            ${isSelected 
                              ? 'border-primary bg-primary/10' 
                              : 'border-transparent hover:border-gray-200'
                            }
                            ${isDayToday ? 'bg-primary/5' : ''}
                            ${hasBookings ? 'bg-blue-50' : 'hover:bg-gray-50'}
                          `}
                        >
                          <div className="flex flex-col h-full">
                            <span className={`
                              text-sm font-medium
                              ${isDayToday ? 'text-primary font-bold' : ''}
                              ${!isSameMonth(day, currentDate) ? 'text-muted-foreground' : ''}
                            `}>
                              {format(day, 'd')}
                            </span>
                            <div className="flex-1 flex flex-col justify-center space-y-1">
                              {dayBookings.slice(0, 2).map((booking) => (
                                <div
                                  key={booking.id}
                                  className={`
                                    w-full h-1.5 rounded-full
                                    ${getStatusColor(booking.bookingStatus).split(' ')[0]}
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
                      )
                    })}
                  </div>
                </div>
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
                  {selectedDate ? format(selectedDate, 'PPP') : 'Select a date'}
                </CardTitle>
                {selectedDateBookings.length > 0 && (
                  <CardDescription>
                    {selectedDateBookings.length} booking{selectedDateBookings.length !== 1 ? 's' : ''}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {selectedDateBookings.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No bookings for this date</p>
                ) : (
                  <div className="space-y-3">
                    {selectedDateBookings.map((booking) => (
                      <div key={booking.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium">{booking.guestName}</p>
                            <p className="text-sm text-muted-foreground">
                              {booking.numberOfGuests} guest{booking.numberOfGuests !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(booking.bookingStatus)}>
                              {getStatusLabel(booking.bookingStatus)}
                            </Badge>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          {format(new Date(booking.checkInDate), 'MMM d')} - {format(new Date(booking.checkOutDate), 'MMM d')}
                        </div>
                        <div className="mt-1 text-sm font-medium">
                          ${booking.totalAmount}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Booking Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Bookings</span>
                    <span className="font-medium">{bookings.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Confirmed</span>
                    <span className="font-medium">
                      {bookings.filter(b => b.bookingStatus === 'confirmed').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Pending</span>
                    <span className="font-medium">
                      {bookings.filter(b => b.bookingStatus === 'pending').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Revenue</span>
                    <span className="font-medium">
                      ${bookings
                        .filter(b => b.bookingStatus !== 'cancelled')
                        .reduce((sum, b) => sum + Number(b.totalAmount), 0)
                        .toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
