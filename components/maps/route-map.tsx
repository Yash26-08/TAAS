"use client"

import { useEffect, useRef } from "react"
import { MapPin } from "lucide-react"

interface RouteMapProps {
  origin: string
  destination: string
}

export const RouteMap = ({ origin, destination }: RouteMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // In a real implementation, this would integrate with Google Maps, Mapbox, or similar
    // For now, we'll show a placeholder with route information
  }, [origin, destination])

  return (
    <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
      {/* Map Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100"></div>

      {/* Route Information Overlay */}
      <div className="relative z-10 text-center space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow">
            <MapPin className="w-5 h-5 text-green-600" />
            <span className="font-medium">{origin}</span>
          </div>
          <div className="w-8 h-0.5 bg-gray-400"></div>
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow">
            <MapPin className="w-5 h-5 text-red-600" />
            <span className="font-medium">{destination}</span>
          </div>
        </div>

        <div className="bg-white px-4 py-2 rounded-lg shadow">
          <p className="text-sm text-gray-600">
            Interactive map showing route from {origin} to {destination}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Map integration with Google Maps/Mapbox would be implemented here
          </p>
        </div>
      </div>

      {/* Simulated Route Line */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
        <path d="M 50 150 Q 200 100 350 150" stroke="#3B82F6" strokeWidth="3" fill="none" strokeDasharray="5,5" />
        <circle cx="50" cy="150" r="6" fill="#10B981" />
        <circle cx="350" cy="150" r="6" fill="#EF4444" />
      </svg>
    </div>
  )
}
