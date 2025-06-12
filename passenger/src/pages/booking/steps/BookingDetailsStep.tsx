import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, MapPin, Clock } from "lucide-react"
import type { BookingFormData } from "../BookingPage"
import classNames from "react-day-picker/style.module.css";

interface BookingDetailsStepProps {
  formData: BookingFormData
  updateFormData: (data: Partial<BookingFormData>) => void
  onNext: () => void
  onBack: () => void
  selectedServiceableCity: string
}

export function BookingDetailsStep({
  formData,
  updateFormData,
  onNext,
  onBack,
  selectedServiceableCity
}: BookingDetailsStepProps) {
  const [date, setDate] = useState<Date | undefined>(
    formData.date ? new Date(formData.date) : undefined
  )
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [serviceableZone, setServiceableZone] = useState(formData.serviceable_zone || "")
  const [serviceableZones, setServiceableZones] = useState<string[]>([])

  useEffect(() => {
    // TODO: Replace with backend call
    if (selectedServiceableCity === 'Mumbai') setServiceableZones(['South Mumbai', 'Andheri', 'Borivali'])
    else if (selectedServiceableCity === 'Delhi') setServiceableZones(['South Delhi', 'Dwarka', 'Rohini'])
    else if (selectedServiceableCity === 'Bangalore') setServiceableZones(['Whitefield', 'Koramangala', 'Indiranagar'])
    else setServiceableZones([])
    setServiceableZone("")
    updateFormData({ serviceable_zone: "" })
  }, [selectedServiceableCity])

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (selectedDate) {
      updateFormData({
        date: selectedDate.toISOString().split('T')[0]
      })
      setCalendarOpen(false)
    }
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ time: e.target.value })
  }

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ duration: parseInt(e.target.value) || 1 })
  }

  const handleLocationChange = (
    type: 'pickup' | 'drop',
    value: string
  ) => {
    // TODO: Implement Google Places Autocomplete
    updateFormData({
      [type === 'pickup' ? 'pickupLocation' : 'dropLocation']: {
        address: value,
        lat: 0, // Will be set by Google Places
        lng: 0  // Will be set by Google Places
      }
    })
  }

  const handleServiceableZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setServiceableZone(e.target.value)
    updateFormData({ serviceable_zone: e.target.value })
  }

  const isFormValid = () => {
    return (
      serviceableZone &&
      formData.pickupLocation.address &&
      formData.dropLocation.address &&
      formData.date &&
      formData.time &&
      formData.duration > 0
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="serviceable_zone">Serviceable Zone</Label>
        <select
          id="serviceable_zone"
          className="w-full mt-1 rounded border px-3 py-2"
          value={serviceableZone}
          onChange={handleServiceableZoneChange}
          required
          disabled={!selectedServiceableCity}
        >
          <option value="" disabled>Select serviceable zone</option>
          {serviceableZones.map(z => <option key={z} value={z}>{z}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pickup">Pickup Location</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="pickup"
              placeholder="Enter pickup location"
              value={formData.pickupLocation.address}
              onChange={(e) => handleLocationChange('pickup', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="drop">Drop Location</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="drop"
              placeholder="Enter drop location"
              value={formData.dropLocation.address}
              onChange={(e) => handleLocationChange('drop', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Date</Label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto min-w-[320px] p-0 z-[100] shadow-2xl rounded-xl border mt-2" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                classNames={classNames}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <div className="relative">
            <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={handleTimeChange}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">
            Duration {formData.bookingType === "hourly" ? "(hours)" : "(days)"}
          </Label>
          <Input
            id="duration"
            type="number"
            min="1"
            value={formData.duration}
            onChange={handleDurationChange}
          />
        </div>
      </div>

      <div className="flex justify-between mt-4">
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