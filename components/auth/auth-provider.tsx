"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  role: "owner" | "driver" | "shipper"
  username: string
  truckId?: string
}

interface AuthContextType {
  user: User | null
  login: (role: string, username: string, truckId?: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("truckProUser")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
    }
  }, [])

  const login = async (role: string, username: string, truckId?: string) => {
    const newUser: User = {
      role: role as User["role"],
      username,
      truckId: role === "driver" || role === "shipper" ? truckId : undefined,
    }
    setUser(newUser)
    localStorage.setItem("truckProUser", JSON.stringify(newUser))

    // Redirect based on role
    router.push(`/${role}`)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("truckProUser")
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}
