"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Wrench, AlertTriangle, CheckCircle } from "lucide-react"
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

interface MaintenancePageProps {
  trucksData: Record<string, TruckData[]>
  currentIndices: Record<string, number>
}

export const MaintenancePage = ({ trucksData, currentIndices }: MaintenancePageProps) => {
  const { toast } = useToast()

  const handleScheduleMaintenance = (truckId: string, issue: string) => {
    // In production, this would write to Supabase maintenance_requests table
    toast({
      title: "Maintenance Scheduled",
      description: `Maintenance for ${truckId} scheduled for: ${issue}`,
    })
  }

  const getMaintenanceData = () => {
    const maintenanceItems: Array<{
      truckId: string
      driver: string
      alert: string
      suggestedAction: string
      priority: "high" | "medium" | "low"
      timestamp: string
    }> = []

    Object.keys(trucksData).forEach((truckId) => {
      const currentData = trucksData[truckId]?.[currentIndices[truckId] || 0]
      if (currentData) {
        const hasAlert =
          currentData.maintenance_alerts &&
          currentData.maintenance_alerts !== "No maintenance alerts" &&
          currentData.maintenance_alerts !== "None"

        const hasAction = currentData.suggested_actions && currentData.suggested_actions !== "None"

        if (hasAlert || hasAction) {
          let priority: "high" | "medium" | "low" = "low"

          // Determine priority based on conditions
          if (currentData.engine_temp_c > 120 || currentData.battery_voltage_v < 11) {
            priority = "high"
          } else if (
            currentData.engine_temp_c > 110 ||
            currentData.coolant_level_percent < 30 ||
            currentData.brake_pad_health < 40
          ) {
            priority = "medium"
          }

          maintenanceItems.push({
            truckId,
            driver: currentData.driver_name,
            alert: hasAlert ? currentData.maintenance_alerts : "Preventive maintenance recommended",
            suggestedAction: hasAction ? currentData.suggested_actions : "Schedule routine check",
            priority,
            timestamp: currentData.timestamp,
          })
        }
      }
    })

    return maintenanceItems.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }

  const maintenanceData = getMaintenanceData()

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Alerts</p>
                <p className="text-3xl font-bold text-red-600">{maintenanceData.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-3xl font-bold text-red-600">
                  {maintenanceData.filter((item) => item.priority === "high").length}
                </p>
              </div>
              <Wrench className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-3xl font-bold text-green-600">0</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            Maintenance Alerts & Scheduling
          </CardTitle>
        </CardHeader>
        <CardContent>
          {maintenanceData.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Truck ID</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Alert</TableHead>
                  <TableHead>Suggested Action</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenanceData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.truckId}</TableCell>
                    <TableCell>{item.driver}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={item.alert}>
                        {item.alert}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={item.suggestedAction}>
                        {item.suggestedAction}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.priority === "high"
                            ? "destructive"
                            : item.priority === "medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {item.priority.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">{new Date(item.timestamp).toLocaleString()}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => handleScheduleMaintenance(item.truckId, item.alert)}
                        className="flex items-center gap-1"
                      >
                        <Wrench className="w-3 h-3" />
                        Schedule
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No maintenance alerts</p>
              <p className="text-sm text-gray-500 mt-2">All trucks are in good condition</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
