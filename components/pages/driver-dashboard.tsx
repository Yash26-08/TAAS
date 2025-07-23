"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RouteMap } from "@/components/maps/route-map"
import {
  Truck,
  RefreshCw,
  AlertTriangle,
  Phone,
  Award,
  History,
  MapPin,
  Gauge,
  Battery,
  Thermometer,
  Activity,
  Clock,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface DriverData {
  truck_id: string
  trip_id: string
  driver_name: string
  trip_status: string
  location?: {
    origin_city: string
    destination_city: string
  }
  origin_city?: string
  destination_city?: string
  distance_covered_km: number
  engine_temp_c: number
  oil_level_percent: number
  coolant_level_percent: number
  battery_voltage_v: number
  brake_pad_health: number
  maintenance_alerts: string
  suggested_actions: string
  timestamp: string
}

export const DriverDashboard = () => {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [driverData, setDriverData] = useState<DriverData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [showMaintenanceAlert, setShowMaintenanceAlert] = useState(false)

  // Roadside assistance state
  const [assistanceForm, setAssistanceForm] = useState({
    issueType: "",
    description: "",
  })
  const [assistanceStatus, setAssistanceStatus] = useState<"idle" | "pending" | "dispatched" | "complete">("idle")

  const assignedTruckId = user?.truckId

  // Calculate warnings based on current data
  const warnings = useMemo(() => {
    if (!driverData) return {}
    return {
      engineTemp: driverData.engine_temp_c > 110,
      brakePad: driverData.brake_pad_health < 60,
      batteryVoltage: driverData.battery_voltage_v < 11.5,
      coolantLevel: driverData.coolant_level_percent < 45,
      oilLevel: driverData.oil_level_percent < 50,
    }
  }, [driverData])

  const suggestedActions = useMemo(() => {
    const actions = []
    if (!driverData) return ["None"]

    if (warnings.engineTemp) actions.push("🧯 Stop vehicle: engine overheating")
    if (warnings.coolantLevel) actions.push("💧 Schedule coolant refill at next stop")
    if (warnings.batteryVoltage) actions.push("🔋 Schedule battery service soon")
    if (warnings.brakePad) actions.push("🚨 Replace brake pads soon")
    if (warnings.oilLevel) actions.push("🛢️ Check oil level: low oil")

    if (driverData.suggested_actions && driverData.suggested_actions !== "None") {
      actions.push(driverData.suggested_actions)
    }

    return actions.length > 0 ? actions : ["None"]
  }, [driverData, warnings])

  const fetchDriverData = async () => {
    if (!assignedTruckId) return

    setLoading(true)
    try {
      const response = await fetch(
        `https://81qq3iprs5.execute-api.us-east-1.amazonaws.com/get?truck_id=${assignedTruckId}`,
      )
      let data = await response.json()

      if (typeof data === "string") {
        data = JSON.parse(data)
      }
      if (data.body && typeof data.body === "string") {
        data = JSON.parse(data.body)
      }

      let processedData: DriverData
      if (Array.isArray(data) && data.length > 0) {
        processedData = data[0] // Get latest record
      } else if (typeof data === "object" && data !== null) {
        processedData = data
      } else {
        throw new Error("Invalid data format")
      }

      // Handle nested location data - extract values directly
      if (processedData.location) {
        processedData.origin_city = processedData.location.origin_city
        processedData.destination_city = processedData.location.destination_city
      }

      setDriverData(processedData)
      setLastRefresh(new Date())
    } catch (error) {
      console.error("Error fetching driver data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch driver data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user || user.role !== "driver") {
      router.push("/login")
      return
    }

    // Initial fetch
    fetchDriverData()

    // Refresh data every 2 minutes
    const refreshInterval = setInterval(fetchDriverData, 2 * 60 * 1000)

    return () => clearInterval(refreshInterval)
  }, [user, router, assignedTruckId])

  useEffect(() => {
    if (
      driverData?.maintenance_alerts &&
      driverData.maintenance_alerts !== "No maintenance alerts" &&
      driverData.maintenance_alerts !== "None"
    ) {
      setShowMaintenanceAlert(true)
    }
  }, [driverData])

  const handleAssistanceRequest = (e: React.FormEvent) => {
    e.preventDefault()
    setAssistanceStatus("pending")

    // In production, this would write to Supabase assistance_requests table
    toast({
      title: "Assistance Requested",
      description: "Your roadside assistance request has been submitted.",
    })

    // Simulate assistance workflow
    setTimeout(() => setAssistanceStatus("dispatched"), 3000)
    setTimeout(() => setAssistanceStatus("complete"), 8000)
  }

  const calculateDrivingScore = () => {
    if (!driverData) return 0

    const brakeScore = driverData.brake_pad_health
    const oilScore = driverData.oil_level_percent
    const engineScore = Math.max(0, 150 - driverData.engine_temp_c)
    const rawScore = brakeScore + oilScore + engineScore
    const maxRawScore = 100 + 100 + 70

    return Math.round((rawScore / maxRawScore) * 100)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-green-600" />
            <p className="text-xl text-gray-700">Loading Driver Dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!user || user.role !== "driver") return null

  const drivingScore = calculateDrivingScore()
  let scoreBadge = "🥉 Needs Improvement"
  let scoreColor = "bg-red-100 text-red-800"

  if (drivingScore >= 90) {
    scoreBadge = "🥇 Excellent"
    scoreColor = "bg-yellow-100 text-yellow-800"
  } else if (drivingScore >= 75) {
    scoreBadge = "🥈 Good"
    scoreColor = "bg-green-100 text-green-800"
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Driver Dashboard</h1>
            <p className="text-gray-600 mt-1">Truck: {assignedTruckId}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">Last updated: {lastRefresh.toLocaleTimeString()}</div>
            <Button onClick={fetchDriverData} variant="outline" className="flex items-center gap-2 bg-transparent">
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Current Status Overview */}
        {driverData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Engine Temp</p>
                    <p className={`text-2xl font-bold ${warnings.engineTemp ? "text-red-600" : "text-gray-900"}`}>
                      {driverData.engine_temp_c}°C
                    </p>
                  </div>
                  <Thermometer className={`w-8 h-8 ${warnings.engineTemp ? "text-red-600" : "text-blue-600"}`} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Battery</p>
                    <p className={`text-2xl font-bold ${warnings.batteryVoltage ? "text-red-600" : "text-gray-900"}`}>
                      {driverData.battery_voltage_v}V
                    </p>
                  </div>
                  <Battery className={`w-8 h-8 ${warnings.batteryVoltage ? "text-red-600" : "text-green-600"}`} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Oil Level</p>
                    <p className={`text-2xl font-bold ${warnings.oilLevel ? "text-red-600" : "text-gray-900"}`}>
                      {driverData.oil_level_percent}%
                    </p>
                  </div>
                  <Gauge className={`w-8 h-8 ${warnings.oilLevel ? "text-red-600" : "text-blue-600"}`} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Brake Health</p>
                    <p className={`text-2xl font-bold ${warnings.brakePad ? "text-red-600" : "text-gray-900"}`}>
                      {driverData.brake_pad_health}%
                    </p>
                  </div>
                  <Activity className={`w-8 h-8 ${warnings.brakePad ? "text-red-600" : "text-green-600"}`} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="currentTrip" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="currentTrip" className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Current Trip
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Trip History
            </TabsTrigger>
            <TabsTrigger value="score" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Driving Score
            </TabsTrigger>
            <TabsTrigger value="assistance" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Roadside Assistance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="currentTrip">
            {driverData ? (
              <div className="space-y-6">
                {/* Maintenance Alert */}
                {showMaintenanceAlert && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-semibold">Maintenance Alert: {driverData.maintenance_alerts}</p>
                        <Button
                          size="sm"
                          onClick={() => setShowMaintenanceAlert(false)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Acknowledge Alert
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Trip Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Truck className="w-5 h-5" />
                        Current Trip Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Trip ID</p>
                          <p className="font-semibold">{driverData.trip_id || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Driver</p>
                          <p className="font-semibold">{driverData.driver_name}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Trip Status</p>
                          <Badge variant={driverData.trip_status === "Active" ? "default" : "secondary"}>
                            {driverData.trip_status}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Distance Covered</p>
                          <p className="font-semibold">{driverData.distance_covered_km} km</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Route
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{driverData.origin_city || "Unknown"}</span>
                          <span className="text-gray-400">→</span>
                          <span className="font-semibold">{driverData.destination_city || "Unknown"}</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <p className="text-sm font-medium text-gray-600 mb-2">Vehicle Health Summary</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className={warnings.engineTemp ? "text-red-600 font-bold" : ""}>
                            Engine: {driverData.engine_temp_c}°C
                          </div>
                          <div className={warnings.oilLevel ? "text-red-600 font-bold" : ""}>
                            Oil: {driverData.oil_level_percent}%
                          </div>
                          <div className={warnings.coolantLevel ? "text-red-600 font-bold" : ""}>
                            Coolant: {driverData.coolant_level_percent}%
                          </div>
                          <div className={warnings.batteryVoltage ? "text-red-600 font-bold" : ""}>
                            Battery: {driverData.battery_voltage_v}V
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 pt-2 border-t flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        Last updated: {new Date(driverData.timestamp).toLocaleString()}
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
                          origin={driverData.origin_city || "Unknown"}
                          destination={driverData.destination_city || "Unknown"}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Suggested Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Suggested Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {suggestedActions.map((action, idx) => (
                        <li
                          key={idx}
                          className={`flex items-start gap-2 ${
                            action.includes("Stop") || action.includes("Replace") || action.includes("Schedule")
                              ? "text-red-600 font-semibold"
                              : "text-gray-700"
                          }`}
                        >
                          <span className="text-sm">•</span>
                          <span className="text-sm">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No trip data available</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Trip information will appear when you're assigned to a truck
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Trip & Performance History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">Trip history coming soon</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Your completed trips and performance metrics will be displayed here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="score">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Driving Score
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-green-100 mb-4">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-gray-800">{drivingScore}</p>
                      <p className="text-sm text-gray-600">out of 100</p>
                    </div>
                  </div>
                  <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${scoreColor}`}>
                    {scoreBadge}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{driverData?.brake_pad_health || 0}%</p>
                    <p className="text-sm text-gray-600">Brake Management</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{driverData?.oil_level_percent || 0}%</p>
                    <p className="text-sm text-gray-600">Vehicle Care</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.max(0, 150 - (driverData?.engine_temp_c || 0))}
                    </p>
                    <p className="text-sm text-gray-600">Engine Efficiency</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">Improvement Tips:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Maintain steady speeds to improve fuel efficiency</li>
                    <li>• Perform regular vehicle inspections</li>
                    <li>• Avoid harsh braking and acceleration</li>
                    <li>• Monitor engine temperature regularly</li>
                    <li>• Keep up with scheduled maintenance</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assistance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Roadside Assistance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {assistanceStatus === "idle" && (
                  <form onSubmit={handleAssistanceRequest} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="issueType">Issue Type</Label>
                      <Select
                        value={assistanceForm.issueType}
                        onValueChange={(value) => setAssistanceForm((prev) => ({ ...prev, issueType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select issue type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="engine">Engine Trouble</SelectItem>
                          <SelectItem value="tire">Flat Tire</SelectItem>
                          <SelectItem value="fuel">Fuel Shortage</SelectItem>
                          <SelectItem value="accident">Accident</SelectItem>
                          <SelectItem value="breakdown">Vehicle Breakdown</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={assistanceForm.description}
                        onChange={(e) => setAssistanceForm((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the issue and your current location"
                        rows={3}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-red-600 hover:bg-red-700"
                      disabled={!assistanceForm.issueType || !assistanceForm.description}
                    >
                      🚨 Request Emergency Assistance
                    </Button>
                  </form>
                )}

                {assistanceStatus === "pending" && (
                  <div className="text-center py-8">
                    <div className="animate-pulse">
                      <Phone className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                    </div>
                    <p className="text-lg font-semibold text-orange-600">Assistance Request Submitted</p>
                    <p className="text-sm text-gray-600 mt-2">We're processing your request...</p>
                  </div>
                )}

                {assistanceStatus === "dispatched" && (
                  <div className="text-center py-8">
                    <Phone className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-blue-600">Help is on the way!</p>
                    <p className="text-sm text-gray-600 mt-2">Estimated arrival: 15-20 minutes</p>
                    <p className="text-xs text-gray-500 mt-1">Contact: +91 98765 43210</p>
                  </div>
                )}

                {assistanceStatus === "complete" && (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-lg font-semibold text-green-600">Assistance Complete</p>
                    <p className="text-sm text-gray-600 mt-2">Thank you for using TruckPro assistance</p>
                    <Button onClick={() => setAssistanceStatus("idle")} variant="outline" className="mt-4">
                      Request New Assistance
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Maintenance Alert Dialog */}
      <Dialog open={showMaintenanceAlert} onOpenChange={setShowMaintenanceAlert}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Maintenance Alert
            </DialogTitle>
            <DialogDescription>Your vehicle requires immediate attention</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>{driverData?.maintenance_alerts}</AlertDescription>
            </Alert>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowMaintenanceAlert(false)}>
                Acknowledge
              </Button>
              <Button className="bg-red-600 hover:bg-red-700">Contact Support</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
