import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useFrappeGetCall, useFrappeGetDoc } from "frappe-react-sdk"
import { format } from "date-fns"
import { CheckCircle2, MapPin, Calendar, Clock, Car, User, Loader2 } from "lucide-react"

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

interface Booking {
  name: string
  status: string
  pickup_location: string
  dropoff_location: string
  scheduled_time: string
  driver_name?: string
  otp?: string
}

export default function BookingSuccessPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const { data: booking, isLoading } = useFrappeGetDoc<Booking>('Ride', id || '')

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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Booking not found.
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md py-6 px-2 min-h-screen flex flex-col gap-6">
      <div className="flex justify-end">
        <Link to={`/rides/${booking.name}`} className="inline-block">
          <Button variant="outline">View Ride Details</Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Booking Confirmed</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Status</span>
            <span className="font-semibold text-lg">{booking.status}</span>
          </div>
          {booking.status === 'Reached' && booking.otp && (
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Trip Start OTP</span>
              <span className="font-mono text-2xl tracking-widest bg-muted rounded px-4 py-2 w-fit">{booking.otp}</span>
              <span className="text-xs text-muted-foreground">Share this OTP with your driver to start the trip.</span>
            </div>
          )}
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Pickup</span>
            <span className="font-medium">{booking.pickup_location}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Dropoff</span>
            <span className="font-medium">{booking.dropoff_location}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Scheduled Time</span>
            <span className="font-medium">{new Date(booking.scheduled_time).toLocaleString()}</span>
          </div>
          {booking.driver_name && (
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Driver</span>
              <span className="font-medium">{booking.driver_name}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 