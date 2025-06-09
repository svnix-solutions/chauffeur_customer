import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Calendar, MapPin } from "lucide-react"
import type { BookingFormData, BookingType } from "../BookingPage"

interface BookingTypeStepProps {
  formData: BookingFormData
  updateFormData: (data: Partial<BookingFormData>) => void
  onNext: () => void
}

export function BookingTypeStep({ formData, updateFormData, onNext }: BookingTypeStepProps) {
  const handleTypeSelect = (type: BookingType) => {
    updateFormData({ bookingType: type })
    onNext()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <Card
          className={`p-4 cursor-pointer transition-all border-2 rounded-lg flex flex-row items-center gap-4 hover:border-primary ${
            formData.bookingType === "hourly" ? "border-primary bg-accent/30" : "border-muted"
          }`}
          onClick={() => updateFormData({ bookingType: "hourly" })}
        >
          <Clock className="w-10 h-10 text-primary" />
          <div>
            <h3 className="font-semibold text-base">Hourly</h3>
            <p className="text-xs text-muted-foreground">Book a ride for a few hours</p>
          </div>
        </Card>
        <Card
          className={`p-4 cursor-pointer transition-all border-2 rounded-lg flex flex-row items-center gap-4 hover:border-primary ${
            formData.bookingType === "full_day" ? "border-primary bg-accent/30" : "border-muted"
          }`}
          onClick={() => updateFormData({ bookingType: "full_day" })}
        >
          <Calendar className="w-10 h-10 text-primary" />
          <div>
            <h3 className="font-semibold text-base">Full Day</h3>
            <p className="text-xs text-muted-foreground">Book a ride for the entire day</p>
          </div>
        </Card>
        <Card
          className={`p-4 cursor-pointer transition-all border-2 rounded-lg flex flex-row items-center gap-4 hover:border-primary ${
            formData.bookingType === "outstation" ? "border-primary bg-accent/30" : "border-muted"
          }`}
          onClick={() => updateFormData({ bookingType: "outstation" })}
        >
          <MapPin className="w-10 h-10 text-primary" />
          <div>
            <h3 className="font-semibold text-base">Outstation</h3>
            <p className="text-xs text-muted-foreground">Book a ride for multiple days</p>
          </div>
        </Card>
      </div>
      <div className="flex justify-end mt-4">
        <Button
          size="lg"
          className="w-full sm:w-auto"
          onClick={() => handleTypeSelect(formData.bookingType)}
          disabled={!formData.bookingType}
        >
          Continue
        </Button>
      </div>
    </div>
  )
} 