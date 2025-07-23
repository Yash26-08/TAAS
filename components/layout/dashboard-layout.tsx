"use client"

import type React from "react"

import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Truck, LogOut, User, Package, Home } from "lucide-react"
import Link from "next/link"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth()

  const getRoleIcon = () => {
    switch (user?.role) {
      case "owner":
        return <User className="w-5 h-5" />
      case "driver":
        return <Truck className="w-5 h-5" />
      case "shipper":
        return <Package className="w-5 h-5" />
      default:
        return <User className="w-5 h-5" />
    }
  }

  const getRoleColor = () => {
    switch (user?.role) {
      case "owner":
        return "from-blue-600 to-blue-700"
      case "driver":
        return "from-green-600 to-green-700"
      case "shipper":
        return "from-purple-600 to-purple-700"
      default:
        return "from-gray-600 to-gray-700"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 bg-gradient-to-br ${getRoleColor()} rounded-lg flex items-center justify-center`}
            >
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">TruckPro</h1>
              <p className="text-sm text-gray-500 capitalize">{user?.role} Dashboard</p>
            </div>
          </Link>

          <nav className="flex items-center space-x-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Home
              </Link>
            </Button>

            {user && (
              <>
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                  {getRoleIcon()}
                  <span className="text-sm font-medium">
                    {user.username} {user.truckId && `(${user.truckId})`}
                  </span>
                </div>
                <Button onClick={logout} variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">{children}</main>
    </div>
  )
}
