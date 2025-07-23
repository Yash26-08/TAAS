"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

const TRUCKS = ["TRUCK1", "TRUCK2", "TRUCK3", "TRUCK4"]

export const BookingPage = () => {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    shipperName: user?.username || "",
    pickupCity: "",
    dropCity: "",
    loadTonnes: "",
    bookingDate: "",
    bookingTime: "",
    goodsType: "",
    specialRequirements: "",
    selectedTruck: "TRUCK1",
    distanceKm: "",
  })
  const [showConfirmation, setShowConfirmation] = useState(false)

  useEffect(() => {
    if (!user || user.role !== "shipper") {
      router.push("/login")
    }
  }, [user, router])

  const estimatedRate = useMemo(() => {
    if (formData.loadTonnes && formData.distanceKm) {
      const mockBaseRate = 100
      const mockRatePerKm = 0.75
      const totalRate =
        mockBaseRate +
        Number.parseFloat(formData.loadTonnes) * 10 +
        Number.parseFloat(formData.distanceKm) * mockRatePerKm
      return totalRate.toFixed(2)
    }
    return "0.00"
  }, [formData.loadTonnes, formData.distanceKm])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newBookingRequest = {
      shipperName: formData.shipperName,
      pickup: formData.pickupCity,
      drop: formData.dropCity,
      loadTonnes: Number.parseFloat(formData.loadTonnes),
      bookingDate: formData.bookingDate,
      bookingTime: formData.bookingTime,
      goodsType: formData.goodsType,
      specialRequirements: formData.specialRequirements,
      truckId: formData.selectedTruck,
      distanceKm: Number.parseFloat(formData.distanceKm),
      status: "Pending",
      timestamp: new Date().toISOString(),
    }

    localStorage.setItem("truckProBookingRequest", JSON.stringify(newBookingRequest))

    const existingBookings = JSON.parse(localStorage.getItem("truckProBookingRecords") || "[]")
    localStorage.setItem("truckProBookingRecords", JSON.stringify([...existingBookings, newBookingRequest]))

    setShowConfirmation(true)
  }

  const closeConfirmation = () => {
    setShowConfirmation(false)
    router.push("/shipper")
  }

  if (!user || user.role !== "shipper") return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl text-center">Book a New Trip</CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shipperName">Shipper Name</Label>
                    <Input
                      id="shipperName"
                      value={formData.shipperName}
                      onChange={(e) => handleInputChange("shipperName", e.target.value)}
                      required
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="selectedTruck">Preferred Truck</Label>
                    <Select
                      value={formData.selectedTruck}
                      onValueChange={(value) => handleInputChange("selectedTruck", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TRUCKS.map((truckId) => (
                          <SelectItem key={truckId} value={truckId}>
                            {truckId}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pickupCity">Origin City</Label>
                    <Input
                      id="pickupCity"
                      value={formData.pickupCity}
                      onChange={(e) => handleInputChange("pickupCity", e.target.value)}
                      placeholder="e.g., Mumbai"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dropCity">Destination City</Label>
                    <Input
                      id="dropCity"
                      value={formData.dropCity}
                      onChange={(e) => handleInputChange("dropCity", e.target.value)}
                      placeholder="e.g., Delhi"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="loadTonnes">Load (tonnes)</Label>
                    <Input
                      id="loadTonnes"
                      type="number"
                      value={formData.loadTonnes}
                      onChange={(e) => handleInputChange("loadTonnes", e.target.value)}
                      placeholder="e.g., 10"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="distanceKm">Distance (km)</Label>
                    <Input
                      id="distanceKm"
                      type="number"
                      value={formData.distanceKm}
                      onChange={(e) => handleInputChange("distanceKm", e.target.value)}
                      placeholder="e.g., 500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goodsType">Goods Type</Label>
                    <Input
                      id="goodsType"
                      value={formData.goodsType}
                      onChange={(e) => handleInputChange("goodsType", e.target.value)}
                      placeholder="e.g., Electronics"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bookingDate">Booking Date</Label>
                    <Input
                      id="bookingDate"
                      type="date"
                      value={formData.bookingDate}
                      onChange={(e) => handleInputChange("bookingDate", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bookingTime">Booking Time</Label>
                    <Input
                      id="bookingTime"
                      type="time"
                      value={formData.bookingTime}
                      onChange={(e) => handleInputChange("bookingTime", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialRequirements">Special Requirements (Optional)</Label>
                  <Textarea
                    id="specialRequirements"
                    value={formData.specialRequirements}
                    onChange={(e) => handleInputChange("specialRequirements", e.target.value)}
                    placeholder="e.g., Temperature control, Fragile goods"
                    rows={3}
                  />
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-lg font-semibold text-gray-800">
                    Estimated Rate: <span className="text-green-600">${estimatedRate}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Final rate may vary based on actual conditions and route optimization.
                  </p>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Submit Booking Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Booking Submitted!</DialogTitle>
              <DialogDescription>
                Your booking request has been sent for {formData.selectedTruck}. The driver will respond shortly.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end">
              <Button onClick={closeConfirmation}>Go to Dashboard</Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
