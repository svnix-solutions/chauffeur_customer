import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useFrappePostCall } from "frappe-react-sdk"
import { format } from "date-fns"
import type { BookingFormData } from "../BookingPage"

interface ConfirmationStepProps {
  formData: BookingFormData
  onBack: () => void
}

export function ConfirmationStep({
  formData,
  onBack
}: ConfirmationStepProps) {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { call: createBooking } = useFrappePostCall(
    'chauffeur_customer.chauffeur_customer.booking.create_booking'
  )

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true)
      setError(null)

      const response = await createBooking({
        booking_type: formData.bookingType,
        pickup_location: formData.pickupLocation,
        drop_location: formData.dropLocation,
        date: formData.date,
        time: formData.time,
        duration: formData.duration,
        vehicle_type: formData.vehicleType,
        registration_number: formData.registrationNumber,
        gear_type: formData.gearType,
        save_to_garage: formData.saveToGarage,
        city: formData.city || '',
        zone: formData.zone || ''
      })

      // Navigate to booking success page
      navigate(`/bookings/${response.message.booking_id}`)
    } catch (err) {
      setError('Failed to create booking. Please try again.')
      console.error('Error creating booking:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDateTime = (date: string, time: string) => {
    return format(new Date(`${date}T${time}`), 'PPp')
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Booking Type</p>
              <p className="font-medium capitalize">{formData.bookingType.replace('_', ' ')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Vehicle Type</p>
              <p className="font-medium capitalize">{formData.vehicleType}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Pickup Location</p>
              <p className="font-medium">{formData.pickupLocation.address}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Drop Location</p>
              <p className="font-medium">{formData.dropLocation.address}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Date & Time</p>
              <p className="font-medium">
                {formatDateTime(formData.date, formData.time)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">
                {formData.duration} {formData.bookingType === "hourly" ? "hours" : "days"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Gear Type</p>
              <p className="font-medium capitalize">{formData.gearType}</p>
            </div>
            {formData.registrationNumber && (
              <div>
                <p className="text-sm text-muted-foreground">Registration Number</p>
                <p className="font-medium">{formData.registrationNumber}</p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <p className="text-red-500 mt-4">{error}</p>
        )}
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Confirming..." : "Confirm Booking"}
        </Button>
      </div>
    </div>
  )
} 