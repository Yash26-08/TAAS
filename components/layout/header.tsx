"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Truck } from "lucide-react"
import Link from "next/link"

export const Header = () => {
  const { user, logout } = useAuth()

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Truck className="h-8 w-8" />
          <h1 className="text-2xl font-bold">TruckPro</h1>
        </Link>

        <nav className="flex items-center space-x-4">
          {user && (
            <>
              <span className="text-sm hidden sm:block">
                {user.username} ({user.role})
              </span>
              <Button onClick={logout} variant="destructive">
                Logout
              </Button>
            </>
          )}
          {!user && (
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}
