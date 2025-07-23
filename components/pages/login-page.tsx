"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Truck, ArrowLeft, Users, Package } from "lucide-react"
import Link from "next/link"

const TRUCKS = ["TRUCK1", "TRUCK2", "TRUCK3", "TRUCK4"]

export const LoginPage = () => {
  const { login } = useAuth()
  const [role, setRole] = useState<"owner" | "driver" | "shipper">("owner")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [selectedTruck, setSelectedTruck] = useState("TRUCK1")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Simple validation - in production, this would be handled by Supabase Auth
      if (!username || !password) {
        setError("Please enter both username and password.")
        return
      }

      if ((role === "driver" || role === "shipper") && !selectedTruck) {
        setError("Please select a Truck ID.")
        return
      }

      // Simulate login success
      await login(role, username, role === "driver" || role === "shipper" ? selectedTruck : undefined)
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getRoleIcon = () => {
    switch (role) {
      case "owner":
        return <Users className="w-5 h-5 text-blue-600" />
      case "driver":
        return <Truck className="w-5 h-5 text-green-600" />
      case "shipper":
        return <Package className="w-5 h-5 text-purple-600" />
    }
  }

  const getRoleColor = () => {
    switch (role) {
      case "owner":
        return "border-blue-200 bg-blue-50"
      case "driver":
        return "border-green-200 bg-green-50"
      case "shipper":
        return "border-purple-200 bg-purple-50"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">TruckPro</h1>
          </Link>
          <Button asChild variant="ghost">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      <div className="flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold">Welcome to TruckPro</CardTitle>
            <CardDescription className="text-gray-600">Sign in to access your dashboard</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role">Select Your Role</Label>
                <Select
                  value={role}
                  onValueChange={(value: "owner" | "driver" | "shipper") => {
                    setRole(value)
                    setError("")
                  }}
                >
                  <SelectTrigger className={`h-12 ${getRoleColor()}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Fleet Owner</p>
                          <p className="text-xs text-gray-500">Monitor all trucks and fleet operations</p>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="driver">
                      <div className="flex items-center gap-3">
                        <Truck className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium">Driver</p>
                          <p className="text-xs text-gray-500">Access assigned truck and trip details</p>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="shipper">
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="font-medium">Shipper</p>
                          <p className="text-xs text-gray-500">Book trips and track shipments</p>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="h-12"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-12"
                  required
                />
              </div>

              {/* Truck Selection for Driver/Shipper */}
              {(role === "driver" || role === "shipper") && (
                <div className="space-y-2">
                  <Label htmlFor="truck">Select Truck ID</Label>
                  <Select value={selectedTruck} onValueChange={setSelectedTruck}>
                    <SelectTrigger className="h-12">
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
                  <p className="text-xs text-gray-500">
                    {role === "driver" ? "Select your assigned truck" : "Select truck for booking"}
                  </p>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
                {loading ? (
                  "Signing in..."
                ) : (
                  <div className="flex items-center gap-2">
                    {getRoleIcon()}
                    Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}
                  </div>
                )}
              </Button>
            </form>

            {/* Demo Info */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Demo Access:</p>
              <div className="text-xs text-gray-600 space-y-1">
                <p>Use any username/password combination to access the demo</p>
                <p>Select your role and truck (if applicable) to see role-specific features</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
