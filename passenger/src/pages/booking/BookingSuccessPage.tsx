import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useFrappeGetCall } from "frappe-react-sdk"
import { format } from "date-fns"
import { CheckCircle2, MapPin, Calendar, Clock, Car, User } from "lucide-react"

interface BookingDetails {
  booking_id: string
  status: string
  booking: {
    booking_type: string
    pickup_location: {
      lat: number
      lng: number
      address: string
    }
    drop_location: {
      lat: number
      lng: number
      address: string
    }
    date: string
    time: string
    duration: number
    vehicle_type: string
    customer_name: string
    customer_email: string
  }
}

export default function BookingSuccessPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const { data, isLoading } = useFrappeGetCall<{ message: BookingDetails }>(
    'chauffeur_customer.chauffeur_customer.booking.get_booking',
    { booking_id: id }
  )

  const formatDateTime = (date: string, time: string) => {
    return `${date} ${time}`
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </Card>
        </div>
      </div>
    )
  }

  if (!data) {
    return null
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="p-6">
          <div className="text-center mb-8">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground">
              Your booking has been successfully created
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">Pickup Location</span>
                </div>
                <p className="font-medium">
                  {data.message.booking.pickup_location.address}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">Drop Location</span>
                </div>
                <p className="font-medium">
                  {data.message.booking.drop_location.address}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">Date & Time</span>
                </div>
                <p className="font-medium">
                  {formatDateTime(data.message.booking.date, data.message.booking.time)}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">Duration</span>
                </div>
                <p className="font-medium">
                  {data.message.booking.duration} {data.message.booking.booking_type === "hourly" ? "hours" : "days"}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground">
                  <Car className="w-4 h-4 mr-2" />
                  <span className="text-sm">Vehicle Details</span>
                </div>
                <p className="font-medium capitalize">
                  {data.message.booking.vehicle_type}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground">
                  <span className="text-sm">Customer Details</span>
                </div>
                <p className="font-medium">
                  {data.message.booking.customer_name} ({data.message.booking.customer_email})
                </p>
              </div>
            </div>

            <div className="flex justify-center space-x-4 pt-6">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
              >
                Back to Home
              </Button>
              <Button
                onClick={() => navigate(`/bookings/${data.message.booking_id}`)}
              >
                View Booking Details
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
} 