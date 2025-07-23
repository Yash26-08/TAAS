export interface User {
  role: "owner" | "driver" | "shipper"
  username: string
  truckId?: string
}

export interface TruckData {
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
  calculated_price?: number
  base_rate?: number
  rate_per_km?: number
  backhaul_status?: string
}

export interface BookingRecord {
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

export interface MaintenanceRequest {
  id: string
  truckId: string
  issue: string
  scheduledDate: string
  status: "pending" | "scheduled" | "completed"
  createdAt: string
}

export interface AssistanceRequest {
  id: string
  truckId: string
  driverId: string
  issueType: string
  description: string
  status: "pending" | "dispatched" | "completed"
  createdAt: string
}
