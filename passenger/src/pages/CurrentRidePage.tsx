import { useEffect, useState } from 'react'
import { useFrappeAuth, useFrappeGetDocList } from 'frappe-react-sdk'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

interface Ride {
  name: string
  status: string
  pickup_location: string
  dropoff_location: string
  scheduled_time: string
  driver_name?: string
  otp?: string
}

export default function CurrentRidePage() {
  const { currentUser } = useFrappeAuth()
  const safeUser = currentUser || ''
  const [ride, setRide] = useState<Ride | null>(null)
  const { data, isLoading } = useFrappeGetDocList<Ride>(
    'Ride',
    {
      filters: [
        ['customer', '=', safeUser],
        ['status', 'in', ['Accepted', 'On the Way', 'Reached', 'In Progress']]
      ],
      fields: [
        'name', 'status', 'pickup_location', 'dropoff_location',
        'scheduled_time', 'driver_name', 'otp'
      ],
      orderBy: {
        field: 'modified',
        order: 'desc',
      },
      limit: 1
    }
  )

  useEffect(() => {
    if (data && data.length > 0) {
      setRide(data[0])
    } else {
      setRide(null)
    }
  }, [data])

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
            No active ride at the moment.
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md py-6 px-2 min-h-screen flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Current Ride</CardTitle>
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
      <div className="mt-4 flex justify-end">
        <Link to={`/rides/${ride.name}`} className="inline-block">
          <Button variant="outline">View Full Details</Button>
        </Link>
      </div>
    </div>
  )
} 