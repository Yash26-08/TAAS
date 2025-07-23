"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { TruckCard } from "@/components/dashboard/truck-card"
import { MaintenancePage } from "@/components/dashboard/maintenance-page"
import { RoadsideAssistancePage } from "@/components/dashboard/roadside-assistance-page"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Truck, Wrench, Phone, RefreshCw, Activity, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
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

export const OwnerDashboard = () => {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [trucksData, setTrucksData] = useState<Record<string, TruckData[]>>({})
  const [loading, setLoading] = useState(true)
  const [currentIndices, setCurrentIndices] = useState<Record<string, number>>({})
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  useEffect(() => {
    if (!user || user.role !== "owner") {
      router.push("/login")
      return
    }

    const fetchOwnerData = async () => {
      setLoading(true)
      try {
        const response = await fetch("https://6l9gzoxjd0.execute-api.us-east-1.amazonaws.com/get")
        let data = await response.json()

        // Handle nested JSON parsing
        if (typeof data === "string") {
          data = JSON.parse(data)
        }
        if (data.body && typeof data.body === "string") {
          data = JSON.parse(data.body)
        }

        // Sort each truck's data by timestamp (ascending - oldest to newest)
        Object.keys(data).forEach((truckId) => {
          data[truckId] = data[truckId]
            .sort((a: TruckData, b: TruckData) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
            .slice(0, 15) // Limit to 15 entries
        })

        setTrucksData(data)
        setLastRefresh(new Date())

        // Reset current indices for each truck to start from beginning
        const indices: Record<string, number> = {}
        Object.keys(data).forEach((truckId) => {
          indices[truckId] = 0
        })
        setCurrentIndices(indices)
      } catch (error) {
        console.error("Error fetching owner data:", error)
        toast({
          title: "Error",
          description: "Failed to fetch fleet data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    // Initial fetch
    fetchOwnerData()

    // Refresh data every 2 minutes
    const refreshInterval = setInterval(fetchOwnerData, 2 * 60 * 1000)

    return () => clearInterval(refreshInterval)
  }, [user, router, toast])

  // Auto-advance data indices every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndices((prev) => {
        const newIndices = { ...prev }
        Object.keys(trucksData).forEach((truckId) => {
          if (trucksData[truckId] && trucksData[truckId].length > 0) {
            const currentIndex = newIndices[truckId] || 0
            const nextIndex = currentIndex + 1
            // Stop at the last (newest) record, don't loop back
            if (nextIndex < trucksData[truckId].length) {
              newIndices[truckId] = nextIndex
            }
          }
        })
        return newIndices
      })
    }, 10000) // Every 10 seconds

    return () => clearInterval(interval)
  }, [trucksData])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-xl text-gray-700">Loading Fleet Dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!user || user.role !== "owner") return null

  const truckIds = Object.keys(trucksData).sort()
  const activeTrucks = truckIds.filter((id) => {
    const currentData = trucksData[id]?.[currentIndices[id] || 0]
    return currentData?.trip_status === "Active"
  }).length

  const maintenanceAlerts = truckIds.filter((id) => {
    const currentData = trucksData[id]?.[currentIndices[id] || 0]
    return (
      currentData?.maintenance_alerts &&
      currentData.maintenance_alerts !== "No maintenance alerts" &&
      currentData.maintenance_alerts !== "None"
    )
  }).length

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Fleet Overview</h1>
            <p className="text-gray-600 mt-1">Monitor and manage your entire fleet</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">Last updated: {lastRefresh.toLocaleTimeString()}</div>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Fleet Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Trucks</p>
                  <p className="text-3xl font-bold text-gray-900">{truckIds.length}</p>
                </div>
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Trips</p>
                  <p className="text-3xl font-bold text-green-600">{activeTrucks}</p>
                </div>
                <Activity className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Maintenance Alerts</p>
                  <p className="text-3xl font-bold text-red-600">{maintenanceAlerts}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Trucks Overview
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              Maintenance
            </TabsTrigger>
            <TabsTrigger value="assistance" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Roadside Assistance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {truckIds.length > 0 ? (
                truckIds.map((truckId) => (
                  <TruckCard
                    key={truckId}
                    truckId={truckId}
                    data={trucksData[truckId]}
                    currentIndex={currentIndices[truckId] || 0}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No fleet data available</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="maintenance">
            <MaintenancePage trucksData={trucksData} currentIndices={currentIndices} />
          </TabsContent>

          <TabsContent value="assistance">
            <RoadsideAssistancePage trucksData={trucksData} currentIndices={currentIndices} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
