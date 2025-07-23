"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RouteMap } from "@/components/maps/route-map"
import { BookingForm } from "@/components/forms/booking-form"
import { Truck, Package, FileText, History, DollarSign, MapPin, RefreshCw, Info } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

const TRUCKS = ["TRUCK1", "TRUCK2", "TRUCK3", "TRUCK4"]

interface ShipperData {
  truck_id: string
  origin_city: string
  destination_city: string
  trip_status: string
  distance_covered_km: number
  city_type: string
  base_rate: number
  rate_per_km: number
  calculated_price: number
  backhaul_status: string
  timestamp: string
}

interface BookingRecord {
  id: string
  shipperName: string
  pickup: string
  drop: string
  loadTonnes: number
  bookingDate: string
  bookingTime: string
  goodsType: string
  truckId: string
  status: "pending" | "accepted" | "rejected" | "active" | "completed"
  timestamp: string
  calculatedPrice?: number
}

export const ShipperDashboard = () => {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [shipperData, setShipperData] = useState<Record<string, ShipperData[]>>({})
  const [loading, setLoading] = useState(true)
  const [selectedTruck, setSelectedTruck] = useState(user?.truckId || "TRUCK1")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [bookingRecords, setBookingRecords] = useState<BookingRecord[]>([])
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  useEffect(() => {
    if (!user || user.role !== "shipper") {
      router.push("/login")
      return
    }

    if (user?.truckId && user.truckId !== selectedTruck) {
      setSelectedTruck(user.truckId)
    }

    const fetchShipperData = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `https://kyqqrstyii.execute-api.us-east-1.amazonaws.com/get?truck_id=${selectedTruck}`,
        )
        let data = await response.json()

        if (typeof data === "string") {
          data = JSON.parse(data)
        }
        if (data.body && typeof data.body === "string") {
          data = JSON.parse(data.body)
        }

        if (!Array.isArray(data)) {
          throw new Error("Expected array from Shipper API")
        }

        // Filter and sort data by timestamp (ascending - oldest to newest)
        const filteredData = data
          .filter((item) => item.truck_id === selectedTruck)
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
          .slice(0, 15) // Limit to 15 entries

        setShipperData((prev) => ({ ...prev, [selectedTruck]: filteredData }))
        setLastRefresh(new Date())

        // Reset current index when truck changes
        setCurrentIndex(0)
      } catch (error) {
        console.error("Error fetching shipper data:", error)
        toast({
          title: "Error",
          description: "Failed to fetch shipper data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    // Initial fetch
    fetchShipperData()

    // Refresh data every 2 minutes
    const refreshInterval = setInterval(fetchShipperData, 2 * 60 * 1000)

    // Load booking records from localStorage (Supabase in production)
    const storedBookings = JSON.parse(localStorage.getItem("truckProBookingRecords") || "[]")
    setBookingRecords(storedBookings)

    return () => clearInterval(refreshInterval)
  }, [user, router, selectedTruck, toast])

  // Auto-advance data indices every 10 seconds
  useEffect(() => {
    if (shipperData[selectedTruck] && shipperData[selectedTruck].length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = prevIndex + 1
          // Stop at the last (newest) record, don't loop back
          if (nextIndex >= shipperData[selectedTruck].length) {
            clearInterval(interval)
            return prevIndex
          }
          return nextIndex
        })
      }, 10000) // Every 10 seconds

      return () => clearInterval(interval)
    }
  }, [shipperData, selectedTruck])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
            <p className="text-xl text-gray-700">Loading Shipper Dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!user || user.role !== "shipper") return null

  const currentTruckData = shipperData[selectedTruck]?.[currentIndex]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Shipper Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage shipments and track deliveries</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">Last updated: {lastRefresh.toLocaleTimeString()}</div>
          </div>
        </div>

        {/* Truck Selection */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Truck to View Live Data:
                  </label>
                  <Select
                    value={selectedTruck}
                    onValueChange={(value) => {
                      setSelectedTruck(value)
                      setCurrentIndex(0)
                    }}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TRUCKS.map((truckId) => (
                        <SelectItem key={truckId} value={truckId}>
                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4" />
                            {truckId}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="text-sm text-gray-500">Data cycles every 10 seconds • Refreshes every 2 minutes</div>
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="currentTrip" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="currentTrip" className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Current Trip (Live)
            </TabsTrigger>
            <TabsTrigger value="booking" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Book a Truck
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Trip History
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Billing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="currentTrip">
            {currentTruckData ? (
              <div className="space-y-6">
                {/* Backhaul Discount Banner */}
                {currentTruckData.backhaul_status === "❌ Backhaul Not Utilized" && (
                  <Alert className="border-orange-200 bg-orange-50">
                    <Info className="h-4 w-4 text-orange-600" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-semibold text-orange-800">
                          🛈 10% discount available for trip from {currentTruckData.destination_city} to{" "}
                          {currentTruckData.origin_city} — Book now!
                        </p>
                        <p className="text-sm text-orange-700">
                          This truck has unused backhaul capacity. Take advantage of reduced pricing for your return
                          shipment.
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Live Trip Data */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Truck className="w-5 h-5" />
                          Live Trip Data - {selectedTruck}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          Record {currentIndex + 1} of {shipperData[selectedTruck]?.length || 0}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Route Information */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-700 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Route Information
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Origin</p>
                            <p className="font-semibold">{currentTruckData.origin_city}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Destination</p>
                            <p className="font-semibold">{currentTruckData.destination_city}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Trip Status</p>
                            <Badge variant={currentTruckData.trip_status === "Active" ? "default" : "secondary"}>
                              {currentTruckData.trip_status}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Distance Covered</p>
                            <p className="font-semibold">{currentTruckData.distance_covered_km} km</p>
                          </div>
                        </div>
                      </div>

                      {/* Pricing Details */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-700 flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Pricing Details
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-600">City Type</p>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{currentTruckData.city_type}</p>
                              {currentTruckData.city_type === "Tier-1" && (
                                <Badge variant="secondary" className="text-xs">
                                  Premium
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Base Rate</p>
                            <p className="font-semibold">${currentTruckData.base_rate?.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Rate per KM</p>
                            <p className="font-semibold">${currentTruckData.rate_per_km?.toFixed(2)}</p>
                          </div>
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg col-span-2">
                            <p className="text-sm font-medium text-green-700">Calculated Price</p>
                            <p className="text-2xl font-bold text-green-700">
                              ${currentTruckData.calculated_price?.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 pt-2 border-t">
                        Updated: {new Date(currentTruckData.timestamp).toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Route Map */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Route Map
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <RouteMap
                          origin={currentTruckData.origin_city}
                          destination={currentTruckData.destination_city}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No live data available for {selectedTruck}</p>
                  <p className="text-sm text-gray-500 mt-2">Data will appear here when the truck is active</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="booking">
            <BookingForm
              onBookingSubmit={(booking) => {
                const newBooking: BookingRecord = {
                  ...booking,
                  id: `BK${Date.now()}`,
                  shipperName: user?.username || "Unknown",
                  status: "pending",
                  timestamp: new Date().toISOString(),
                }

                const updatedBookings = [newBooking, ...bookingRecords]
                setBookingRecords(updatedBookings)
                localStorage.setItem("truckProBookingRecords", JSON.stringify(updatedBookings))

                toast({
                  title: "Booking Submitted",
                  description: "Your booking request has been submitted successfully.",
                })
              }}
            />
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Trip History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bookingRecords.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Load</TableHead>
                        <TableHead>Goods Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookingRecords.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{booking.pickup}</span>
                              <span className="text-gray-400">→</span>
                              <span>{booking.drop}</span>
                            </div>
                          </TableCell>
                          <TableCell>{booking.loadTonnes}T</TableCell>
                          <TableCell>{booking.goodsType}</TableCell>
                          <TableCell>{booking.bookingDate}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                booking.status === "pending"
                                  ? "secondary"
                                  : booking.status === "accepted" || booking.status === "active"
                                    ? "default"
                                    : booking.status === "completed"
                                      ? "outline"
                                      : "destructive"
                              }
                            >
                              {booking.status.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {booking.calculatedPrice ? `$${booking.calculatedPrice.toFixed(2)}` : "TBD"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">No trip history found</p>
                    <p className="text-sm text-gray-500 mt-2">Your completed trips will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Billing History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600 italic">
                    Complete billing history with itemized costs and downloadable invoices.
                  </p>

                  <div className="space-y-4">
                    {bookingRecords
                      .filter((booking) => booking.status === "completed")
                      .map((booking) => (
                        <div
                          key={booking.id}
                          className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border"
                        >
                          <div className="space-y-1">
                            <p className="font-semibold">Invoice #{booking.id}</p>
                            <p className="text-sm text-gray-600">
                              {booking.pickup} → {booking.drop} | {booking.goodsType}
                            </p>
                            <p className="text-sm text-gray-500">{booking.bookingDate}</p>
                          </div>
                          <div className="text-right space-y-1">
                            <p className="text-2xl font-bold text-green-600">
                              ${booking.calculatedPrice?.toFixed(2) || "0.00"}
                            </p>
                            <Badge variant="secondary">Paid</Badge>
                            <div>
                              <Button variant="link" size="sm" className="p-0 h-auto">
                                Download Invoice
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}

                    {bookingRecords.filter((booking) => booking.status === "completed").length === 0 && (
                      <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg">No billing history</p>
                        <p className="text-sm text-gray-500 mt-2">Completed trips will generate invoices here</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
