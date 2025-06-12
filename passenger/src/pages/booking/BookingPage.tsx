import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookingTypeStep } from "./steps/BookingTypeStep"
import { BookingDetailsStep } from "./steps/BookingDetailsStep"
import { VehicleDetailsStep } from "./steps/VehicleDetailsStep"
import { PricingStep } from "./steps/PricingStep"
import { ConfirmationStep } from "./steps/ConfirmationStep"
import CityStep from "./steps/CityStep"

export type BookingType = "hourly" | "full_day" | "outstation"

export interface BookingFormData {
  bookingType: BookingType
  pickupLocation: {
    address: string
    lat: number
    lng: number
  }
  dropLocation: {
    address: string
    lat: number
    lng: number
  }
  date: string
  time: string
  duration: number
  vehicleType: "sedan" | "suv" | "hatchback" | "premium"
  registrationNumber?: string
  gearType: "manual" | "automatic" | "imt"
  saveToGarage: boolean
  numberOfDays?: number // For outstation
  zone?: string // Added for zone selection
  city?: string // Added for city selection
}

const initialFormData: BookingFormData = {
  bookingType: "hourly",
  pickupLocation: {
    address: "",
    lat: 0,
    lng: 0
  },
  dropLocation: {
    address: "",
    lat: 0,
    lng: 0
  },
  date: "",
  time: "",
  duration: 1,
  vehicleType: "sedan",
  gearType: "manual",
  saveToGarage: false,
  zone: "",
  city: ""
}

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<BookingFormData>(initialFormData)

  const updateFormData = (data: Partial<BookingFormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    setCurrentStep(prev => prev + 1)
  }

  const prevStep = () => {
    setCurrentStep(prev => prev - 1)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BookingTypeStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
          />
        )
      case 2:
        return (
          <CityStep
            onSelect={(city) => {
              updateFormData({ city })
              nextStep()
            }}
          />
        )
      case 3:
        return (
          <BookingDetailsStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
            selectedCity={formData.city || ""}
          />
        )
      case 4:
        return (
          <VehicleDetailsStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )
      case 5:
        return (
          <PricingStep
            formData={formData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )
      case 6:
        return (
          <ConfirmationStep
            formData={formData}
            onBack={prevStep}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto p-2 sm:p-6 flex flex-col items-center justify-center min-h-[90vh]">
      {/* Stepper above the card, centered and responsive */}
      <div className="w-full max-w-md flex flex-col items-center mb-4">
        <div className="flex items-center justify-center w-full gap-2">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div key={step} className={`flex items-center ${step < 6 ? "w-full" : ""}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-medium z-10 bg-white ${
                  step < currentStep
                    ? "border-primary text-primary"
                    : step === currentStep
                    ? "border-primary text-primary font-bold"
                    : "border-muted-foreground text-muted-foreground"
                }`}
              >
                {step}
              </div>
              {step < 6 && (
                <div
                  className={`h-0.5 flex-1 ${
                    step < currentStep
                      ? "bg-primary"
                      : "bg-muted-foreground"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <Card className="w-full max-w-md shadow-md rounded-xl border p-0">
        <CardHeader className="pb-2 pt-6 px-6">
          <CardTitle className="text-2xl">Book a Ride</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-6 pt-2">{renderStep()}</CardContent>
      </Card>
    </div>
  )
} 