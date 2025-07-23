"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, MapPin, Calendar, Truck } from "lucide-react"

interface BookingFormData {
  pickup: string
  drop: string
  loadTonnes: number
  bookingDate: string
  bookingTime: string
  goodsType: string
  truckType: string
  contactPhone: string
  contactEmail: string
  additionalNotes: string
}

interface BookingFormProps {
  onBookingSubmit: (booking: BookingFormData) => void
}

const MAJOR_CITIES = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
  "Surat",
  "Jaipur",
  "Lucknow",
  "Kanpur",
  "Nagpur",
  "Indore",
  "Thane",
  "Bhopal",
  "Visakhapatnam",
  "Pimpri-Chinchwad",
]

const TRUCK_TYPES = [
  { value: "small", label: "Small (up to 3 tons)" },
  { value: "medium", label: "Medium (3-10 tons)" },
  { value: "heavy", label: "Heavy (10+ tons)" },
]

const GOODS_TYPES = [
  "Electronics",
  "Textiles",
  "Machinery",
  "Food Products",
  "Chemicals",
  "Pharmaceuticals",
  "Automotive Parts",
  "Construction Materials",
  "Other",
]

export const BookingForm = ({ onBookingSubmit }: BookingFormProps) => {
  const [formData, setFormData] = useState<BookingFormData>({
    pickup: "",
    drop: "",
    loadTonnes: 0,
    bookingDate: "",
    bookingTime: "",
    goodsType: "",
    truckType: "",
    contactPhone: "",
    contactEmail: "",
    additionalNotes: "",
  })

  const [estimatedPrice, setEstimatedPrice] = useState<number>(0)

  const handleInputChange = (field: keyof BookingFormData, value: string | number) => {
    const updatedData = { ...formData, [field]: value }
    setFormData(updatedData)

    // Calculate estimated price
    if (updatedData.loadTonnes && updatedData.pickup && updatedData.drop) {
      const baseRate = 100
      const weightMultiplier = updatedData.loadTonnes * 15
      const distanceEstimate = 500 // Simplified distance estimation
      const estimated = baseRate + weightMultiplier + distanceEstimate * 0.8
      setEstimatedPrice(estimated)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onBookingSubmit(formData)

    // Reset form
    setFormData({
      pickup: "",
      drop: "",
      loadTonnes: 0,
      bookingDate: "",
      bookingTime: "",
      goodsType: "",
      truckType: "",
      contactPhone: "",
      contactEmail: "",
      additionalNotes: "",
    })
    setEstimatedPrice(0)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Book a Truck
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Route Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pickup" className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-600" />
                Origin City
              </Label>
              <Select value={formData.pickup} onValueChange={(value) => handleInputChange("pickup", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pickup city" />
                </SelectTrigger>
                <SelectContent>
                  {MAJOR_CITIES.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="drop" className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-600" />
                Destination City
              </Label>
              <Select value={formData.drop} onValueChange={(value) => handleInputChange("drop", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination city" />
                </SelectTrigger>
                <SelectContent>
                  {MAJOR_CITIES.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Load and Truck Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="loadTonnes">Weight to Ship (tonnes)</Label>
              <Input
                id="loadTonnes"
                type="number"
                min="0.1"
                step="0.1"
                value={formData.loadTonnes || ""}
                onChange={(e) => handleInputChange("loadTonnes", Number.parseFloat(e.target.value) || 0)}
                placeholder="e.g., 5.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="truckType" className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Preferred Truck Type
              </Label>
              <Select value={formData.truckType} onValueChange={(value) => handleInputChange("truckType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select truck type" />
                </SelectTrigger>
                <SelectContent>
                  {TRUCK_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goodsType">Goods Type</Label>
              <Select value={formData.goodsType} onValueChange={(value) => handleInputChange("goodsType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select goods type" />
                </SelectTrigger>
                <SelectContent>
                  {GOODS_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Pickup Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bookingDate" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Pickup Date
              </Label>
              <Input
                id="bookingDate"
                type="date"
                value={formData.bookingDate}
                onChange={(e) => handleInputChange("bookingDate", e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bookingTime">Pickup Time</Label>
              <Input
                id="bookingTime"
                type="time"
                value={formData.bookingTime}
                onChange={(e) => handleInputChange("bookingTime", e.target.value)}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
            <Textarea
              id="additionalNotes"
              value={formData.additionalNotes}
              onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
              placeholder="Special handling requirements, delivery instructions, etc."
              rows={3}
            />
          </div>

          {/* Estimated Price */}
          {estimatedPrice > 0 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-green-800">Estimated Price</p>
                  <p className="text-sm text-green-600">Final price may vary based on actual route and conditions</p>
                </div>
                <p className="text-3xl font-bold text-green-700">${estimatedPrice.toFixed(2)}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={!formData.pickup || !formData.drop || !formData.loadTonnes || !formData.bookingDate}
          >
            Submit Booking Request
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
