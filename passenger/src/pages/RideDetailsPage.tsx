import { useParams } from 'react-router-dom'
import { useFrappeGetDoc } from 'frappe-react-sdk'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface Ride {
  name: string
  status: string
  pickup_location: string
  dropoff_location: string
  scheduled_time: string
  driver_name?: string
  otp?: string
}

export default function RideDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { data: ride, isLoading } = useFrappeGetDoc<Ride>('Ride', id || '')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!ride) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Ride not found.
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md py-6 px-2 min-h-screen flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Ride Details</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Status</span>
            <span className="font-semibold text-lg">{ride.status}</span>
          </div>
          {ride.status === 'Reached' && ride.otp && (
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Trip Start OTP</span>
              <span className="font-mono text-2xl tracking-widest bg-muted rounded px-4 py-2 w-fit">{ride.otp}</span>
              <span className="text-xs text-muted-foreground">Share this OTP with your driver to start the trip.</span>
            </div>
          )}
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Pickup</span>
            <span className="font-medium">{ride.pickup_location}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Dropoff</span>
            <span className="font-medium">{ride.dropoff_location}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Scheduled Time</span>
            <span className="font-medium">{new Date(ride.scheduled_time).toLocaleString()}</span>
          </div>
          {ride.driver_name && (
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Driver</span>
              <span className="font-medium">{ride.driver_name}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 