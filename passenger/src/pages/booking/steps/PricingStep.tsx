import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useFrappeGetCall } from "frappe-react-sdk"
import type { BookingFormData } from "../BookingPage"

interface PricingStepProps {
  formData: BookingFormData
  onNext: () => void
  onBack: () => void
}

interface PriceBreakdown {
  basePrice: number
  distancePrice: number
  timePrice: number
  vehicleMultiplier: number
  peakHourMultiplier: number
  total: number
}

export function PricingStep({
  formData,
  onNext,
  onBack
}: PricingStepProps) {
  const { data, isLoading } = useFrappeGetCall<{ message: PriceBreakdown }>(
    'chauffeur_customer.chauffeur_customer.booking.calculate_price',
    {
      booking_type: formData.bookingType,
      pickup_location: formData.pickupLocation,
      drop_location: formData.dropLocation,
      date: formData.date,
      time: formData.time,
      duration: formData.duration,
      vehicle_type: formData.vehicleType
    }
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price)
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Price Breakdown</h3>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : data ? (
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Base Price</span>
              <span>{formatPrice(data.message.basePrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Distance Price</span>
              <span>{formatPrice(data.message.distancePrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Time Price</span>
              <span>{formatPrice(data.message.timePrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Vehicle Type Multiplier</span>
              <span>x{data.message.vehicleMultiplier}</span>
            </div>
            <div className="flex justify-between">
              <span>Peak Hour Multiplier</span>
              <span>x{data.message.peakHourMultiplier}</span>
            </div>
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between font-semibold">
                <span>Total Price</span>
                <span>{formatPrice(data.message.total)}</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-red-500">Error calculating price. Please try again.</p>
        )}
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={isLoading || !data}
        >
          Continue
        </Button>
      </div>
    </div>
  )
} 