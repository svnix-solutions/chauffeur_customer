import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { BookingFormData } from "../BookingPage"

interface VehicleDetailsStepProps {
  formData: BookingFormData
  updateFormData: (data: Partial<BookingFormData>) => void
  onNext: () => void
  onBack: () => void
}

const vehicleTypes = [
  { value: "sedan", label: "Sedan" },
  { value: "suv", label: "SUV" },
  { value: "hatchback", label: "Hatchback" },
  { value: "premium", label: "Premium" }
]

const gearTypes = [
  { value: "manual", label: "Manual" },
  { value: "automatic", label: "Automatic" },
  { value: "imt", label: "IMT" }
]

export function VehicleDetailsStep({
  formData,
  updateFormData,
  onNext,
  onBack
}: VehicleDetailsStepProps) {
  const handleVehicleTypeChange = (value: string) => {
    updateFormData({ vehicleType: value as BookingFormData["vehicleType"] })
  }

  const handleGearTypeChange = (value: string) => {
    updateFormData({ gearType: value as BookingFormData["gearType"] })
  }

  const handleRegistrationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ registrationNumber: e.target.value })
  }

  const handleSaveToGarageChange = (checked: boolean) => {
    updateFormData({ saveToGarage: checked })
  }

  const isFormValid = () => {
    return formData.vehicleType && formData.gearType
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Car Type</Label>
          <Select
            value={formData.vehicleType}
            onValueChange={handleVehicleTypeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select car type" />
            </SelectTrigger>
            <SelectContent>
              {vehicleTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Gear Type</Label>
          <Select
            value={formData.gearType}
            onValueChange={handleGearTypeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gear type" />
            </SelectTrigger>
            <SelectContent>
              {gearTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="registration">Registration Number (Optional)</Label>
          <Input
            id="registration"
            placeholder="Enter registration number"
            value={formData.registrationNumber || ""}
            onChange={handleRegistrationChange}
          />
        </div>

        <div className="flex items-center space-x-2 pt-6">
          <Checkbox
            id="saveToGarage"
            checked={formData.saveToGarage}
            onCheckedChange={handleSaveToGarageChange}
          />
          <Label
            htmlFor="saveToGarage"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Save vehicle to My Garage
          </Label>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!isFormValid()}>
          Continue
        </Button>
      </div>
    </div>
  )
} 