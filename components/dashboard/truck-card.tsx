"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RouteMap } from "@/components/maps/route-map"
import { Truck, AlertTriangle, Wrench, MapPin, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TruckData {
  truck_id: string
  driver_name: string
  trip_status: string
  origin_city: string
  destination_city: string
  distance_covered_km: number
  city_type: string
  engine_temp_c: number
  oil_level_percent: number
  coolant_level_percent: number
  battery_voltage_v: number
  brake_pad_health: number
  maintenance_alerts: string
  suggested_actions: string
  timestamp: string
}

interface TruckCardProps {
  truckId: string
  data: TruckData[]
  currentIndex: number
}

export const TruckCard = ({ truckId, data, currentIndex }: TruckCardProps) => {
  const { toast } = useToast()

  const currentRecord = data?.[currentIndex]

  const suggestedActions = useMemo(() => {
    const actions = []
    if (!currentRecord) return actions

    // Check for critical conditions with emojis
    if (currentRecord.engine_temp_c > 110) {
      actions.push("🛠️ Schedule preventive maintenance at nearest service station (High Engine Temp)")
    }
    if (currentRecord.battery_voltage_v < 11.5) {
      actions.push("🔋 Schedule battery service (Low Battery Voltage)")
    }
    if (currentRecord.coolant_level_percent < 45) {
      actions.push("💧 Refill coolant at next stop (Low Coolant Level)")
    }
    if (currentRecord.brake_pad_health < 60) {
      actions.push("🚨 Replace brake pads soon (Low Brake Pad Health)")
    }
    if (currentRecord.oil_level_percent < 50) {
      actions.push("🛢️ Check oil level at next service (Low Oil Level)")
    }
    if (currentRecord.suggested_actions && currentRecord.suggested_actions !== "None") {
      actions.push(currentRecord.suggested_actions)
    }

    return actions.length > 0 ? actions : ["No actions required"]
  }, [currentRecord])

  const handleScheduleMaintenance = () => {
    // In production, this would write to Supabase maintenance_requests table
    toast({
      title: "Maintenance Scheduled",
      description: `Maintenance for ${truckId} has been scheduled successfully.`,
    })
  }

  const handleRequestAssistance = () => {
    // In production, this would write to Supabase assistance_requests table
    toast({
      title: "Roadside Assistance Requested",
      description: `Emergency assistance for ${truckId} has been requested.`,
    })
  }

  if (!currentRecord) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-600">
          <Truck className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          No data available for {truckId}
        </CardContent>
      </Card>
    )
  }

  const hasMaintenanceAlert =
    currentRecord.maintenance_alerts &&
    currentRecord.maintenance_alerts !== "No maintenance alerts" &&
    currentRecord.maintenance_alerts !== "None"

  const needsAttention =
    hasMaintenanceAlert ||
    suggestedActions.some(
      (action) => action.includes("Schedule") || action.includes("Replace") || action.includes("Check"),
    )

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" />
            {truckId}
          </div>
          {needsAttention && <AlertTriangle className="w-5 h-5 text-red-600" />}
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          {new Date(currentRecord.timestamp).toLocaleString()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Trip Information */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Driver:</span>
            <span className="text-sm">{currentRecord.driver_name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Status:</span>
            <Badge variant={currentRecord.trip_status === "Active" ? "default" : "secondary"}>
              {currentRecord.trip_status}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>
              {currentRecord.origin_city} → {currentRecord.destination_city}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Distance:</span>
            <span className="text-sm">{currentRecord.distance_covered_km} km</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">City Type:</span>
            <span className="text-sm">{currentRecord.city_type}</span>
          </div>
        </div>

        {/* Vehicle Health */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className={currentRecord.engine_temp_c > 110 ? "text-red-600 font-bold" : ""}>
            Engine: {currentRecord.engine_temp_c}°C
          </div>
          <div className={currentRecord.oil_level_percent < 50 ? "text-red-600 font-bold" : ""}>
            Oil: {currentRecord.oil_level_percent}%
          </div>
          <div className={currentRecord.coolant_level_percent < 45 ? "text-red-600 font-bold" : ""}>
            Coolant: {currentRecord.coolant_level_percent}%
          </div>
          <div className={currentRecord.battery_voltage_v < 11.5 ? "text-red-600 font-bold" : ""}>
            Battery: {currentRecord.battery_voltage_v}V
          </div>
          <div className={currentRecord.brake_pad_health < 60 ? "text-red-600 font-bold" : ""}>
            Brakes: {currentRecord.brake_pad_health}%
          </div>
        </div>

        {/* Maintenance Alerts */}
        {hasMaintenanceAlert && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 font-medium">
              <AlertTriangle className="w-4 h-4" />
              Maintenance Alert
            </div>
            <p className="text-sm text-red-600 mt-1">{currentRecord.maintenance_alerts}</p>
          </div>
        )}

        {/* Suggested Actions */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Suggested Actions:</p>
          <ul className="text-xs space-y-1">
            {suggestedActions.map((action, idx) => (
              <li
                key={idx}
                className={
                  action.includes("Schedule") || action.includes("Replace") || action.includes("Check")
                    ? "text-red-600 font-semibold"
                    : "text-gray-600"
                }
              >
                • {action}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {needsAttention && (
            <Button size="sm" variant="outline" onClick={handleScheduleMaintenance} className="flex-1 bg-transparent">
              <Wrench className="w-4 h-4 mr-1" />
              Schedule Maintenance
            </Button>
          )}

          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="ghost" className="flex-1">
                <MapPin className="w-4 h-4 mr-1" />
                View Route
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{truckId} - Route Map</DialogTitle>
                <DialogDescription>
                  Current route from {currentRecord.origin_city} to {currentRecord.destination_city}
                </DialogDescription>
              </DialogHeader>
              <div className="h-96">
                <RouteMap origin={currentRecord.origin_city} destination={currentRecord.destination_city} />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Emergency Assistance Button */}
        {(currentRecord.engine_temp_c > 120 || currentRecord.battery_voltage_v < 11) && (
          <Button onClick={handleRequestAssistance} className="w-full bg-red-600 hover:bg-red-700" size="sm">
            🚨 Request Emergency Assistance
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
