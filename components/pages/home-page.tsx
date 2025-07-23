"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import { Truck, Package, User, RefreshCw, Wrench, RotateCcw, Gauge, Calendar } from "lucide-react"
import Link from "next/link"

const FeatureCard = ({
  title,
  description,
  icon: Icon,
}: {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}) => (
  <Card className="hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
    <CardHeader className="text-center">
      <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
        <Icon className="w-8 h-8 text-blue-600" />
      </div>
      <CardTitle className="text-xl">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription className="text-center">{description}</CardDescription>
    </CardContent>
  </Card>
)

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      <main className="container mx-auto py-16 px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">
            Complete Fleet Intelligence, All in One Platform
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
            TruckPro is a cloud-powered logistics intelligence system for Truck Owners, Shippers, and Drivers. It
            enables fleet monitoring, predictive maintenance, smart trip pricing, and seamless trip booking.
          </p>

          <div className="flex justify-center mb-16">
            <div className="flex items-center text-gray-400">
              <Truck className="w-16 h-16 animate-pulse text-blue-300" />
              <p className="ml-4 italic">Real-time visibility. Predictive insights. Easy bookings.</p>
            </div>
          </div>
        </div>

        <section className="mb-16">
          <h3 className="text-3xl font-bold text-gray-800 mb-10 text-center">Core Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Owner Portal"
              description="Real-time telemetry & maintenance alerts for your entire fleet."
              icon={User}
            />
            <FeatureCard
              title="Shipper Console"
              description="Dynamic pricing, seamless trip booking & transparent billing."
              icon={Package}
            />
            <FeatureCard
              title="Driver App"
              description="Access trip info, receive maintenance alerts, and request roadside help."
              icon={Truck}
            />
          </div>
        </section>

        <section className="mb-16">
          <h3 className="text-3xl font-bold text-gray-800 mb-10 text-center">Product Highlights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <FeatureCard
              title="Live API Integration"
              description="Direct data fetching from cloud APIs for up-to-date information."
              icon={RefreshCw}
            />
            <FeatureCard
              title="Predictive Maintenance"
              description="Anticipate and address vehicle issues before they cause downtime."
              icon={Wrench}
            />
            <FeatureCard
              title="Backhaul Optimization"
              description="Maximize efficiency by identifying and utilizing return trip opportunities."
              icon={RotateCcw}
            />
            <FeatureCard
              title="Trip & Fuel Analytics"
              description="Gain insights into trip performance and fuel efficiency."
              icon={Gauge}
            />
            <FeatureCard
              title="Booking Management"
              description="Streamlined process for managing trip requests and assignments."
              icon={Calendar}
            />
          </div>
        </section>

        <section className="text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-10">Get Started</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Button asChild size="lg" className="h-16 text-lg">
              <Link href="/login">Login as Owner</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="h-16 text-lg">
              <Link href="/login">Login as Driver</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-16 text-lg bg-transparent">
              <Link href="/login">Login as Shipper</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center space-x-6 mb-4">
            <Link href="#" className="hover:underline">
              About
            </Link>
            <Link href="#" className="hover:underline">
              Contact
            </Link>
            <Link href="#" className="hover:underline">
              Terms of Use
            </Link>
          </div>
          <p>&copy; {new Date().getFullYear()} TruckPro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
