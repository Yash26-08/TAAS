"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Phone, AlertTriangle, Clock, CheckCircle } from "lucide-react"
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

interface RoadsideAssistancePageProps {
  trucksData: Record<string, TruckData[]>
  currentIndices: Record<string, number>
}

interface AssistanceRequest {
  id: string
  truckId: string
  driver: string
  issueType: string
  description: string
  status: "pending" | "dispatched" | "completed"
  timestamp: string
}

export const RoadsideAssistancePage = ({ trucksData, currentIndices }: RoadsideAssistancePageProps) => {
  const { toast } = useToast()
  const [assistanceRequests, setAssistanceRequests] = useState<AssistanceRequest[]>([
    {
      id: "REQ001",
      truckId: "TRUCK1",
      driver: "John Doe",
      issueType: "Engine Trouble",
      description: "Engine overheating, need immediate assistance",
      status: "dispatched",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
      id: "REQ002",
      truckId: "TRUCK3",
      driver: "Mike Johnson",
      issueType: "Flat Tire",
      description: "Front left tire punctured, need roadside assistance",
      status: "pending",
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
  ])

  const [newRequest, setNewRequest] = useState({
    truckId: "",
    issueType: "",
    description: "",
  })

  const [showRequestDialog, setShowRequestDialog] = useState(false)

  const handleRequestAssistance = () => {
    if (!newRequest.truckId || !newRequest.issueType || !newRequest.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const currentData = trucksData[newRequest.truckId]?.[currentIndices[newRequest.truckId] || 0]

    const request: AssistanceRequest = {
      id: `REQ${String(assistanceRequests.length + 1).padStart(3, "0")}`,
      truckId: newRequest.truckId,
      driver: currentData?.driver_name || "Unknown Driver",
      issueType: newRequest.issueType,
      description: newRequest.description,
      status: "pending",
      timestamp: new Date().toISOString(),
    }

    setAssistanceRequests((prev) => [request, ...prev])
    setNewRequest({ truckId: "", issueType: "", description: "" })
    setShowRequestDialog(false)

    // In production, this would write to Supabase assistance_requests table
    toast({
      title: "Assistance Requested",
      description: `Emergency assistance for ${newRequest.truckId} has been requested.`,
    })
  }

  const updateRequestStatus = (id: string, status: "pending" | "dispatched" | "completed") => {
    setAssistanceRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status } : req)))
    toast({
      title: "Status Updated",
      description: `Request ${id} status updated to ${status}.`,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "dispatched":
        return "default"
      case "completed":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "dispatched":
        return <Phone className="w-4 h-4" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  const truckIds = Object.keys(trucksData).sort()

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-3xl font-bold text-gray-900">{assistanceRequests.length}</p>
              </div>
              <Phone className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-orange-600">
                  {assistanceRequests.filter((req) => req.status === "pending").length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Dispatched</p>
                <p className="text-3xl font-bold text-blue-600">
                  {assistanceRequests.filter((req) => req.status === "dispatched").length}
                </p>
              </div>
              <Phone className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600">
                  {assistanceRequests.filter((req) => req.status === "completed").length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Request Assistance Button */}
      <div className="flex justify-end">
        <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Request Assistance
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Roadside Assistance</DialogTitle>
              <DialogDescription>Submit a roadside assistance request for a specific truck</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="truck">Select Truck</Label>
                <Select
                  value={newRequest.truckId}
                  onValueChange={(value) => setNewRequest((prev) => ({ ...prev, truckId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a truck" />
                  </SelectTrigger>
                  <SelectContent>
                    {truckIds.map((truckId) => {
                      const currentData = trucksData[truckId]?.[currentIndices[truckId] || 0]
                      return (
                        <SelectItem key={truckId} value={truckId}>
                          {truckId} - {currentData?.driver_name || "Unknown Driver"}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="issueType">Issue Type</Label>
                <Select
                  value={newRequest.issueType}
                  onValueChange={(value) => setNewRequest((prev) => ({ ...prev, issueType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engine Trouble">Engine Trouble</SelectItem>
                    <SelectItem value="Flat Tire">Flat Tire</SelectItem>
                    <SelectItem value="Fuel Shortage">Fuel Shortage</SelectItem>
                    <SelectItem value="Accident">Accident</SelectItem>
                    <SelectItem value="Breakdown">Vehicle Breakdown</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newRequest.description}
                  onChange={(e) => setNewRequest((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the issue and location details"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowRequestDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleRequestAssistance}>Submit Request</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Assistance Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Roadside Assistance Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {assistanceRequests.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Truck ID</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Issue Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assistanceRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.id}</TableCell>
                    <TableCell>{request.truckId}</TableCell>
                    <TableCell>{request.driver}</TableCell>
                    <TableCell>{request.issueType}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={request.description}>
                        {request.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(request.status)} className="flex items-center gap-1 w-fit">
                        {getStatusIcon(request.status)}
                        {request.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(request.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {request.status === "pending" && (
                          <Button size="sm" onClick={() => updateRequestStatus(request.id, "dispatched")}>
                            Dispatch
                          </Button>
                        )}
                        {request.status === "dispatched" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateRequestStatus(request.id, "completed")}
                          >
                            Complete
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Phone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No assistance requests</p>
              <p className="text-sm text-gray-500 mt-2">All trucks are operating normally</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
