"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Users, Package, MapPin, Clock, Shield, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">TruckPro</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">
              About
            </a>
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
              Features
            </a>
            <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">
              Contact
            </a>
            <Button asChild>
              <Link href="/login">Login / Register</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl sm:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                Comprehensive Fleet, Shipper, and Driver Management{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  in One Place
                </span>
              </h2>
              <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
                TruckPro streamlines logistics operations with real-time tracking, automated maintenance alerts, instant
                bookings, and comprehensive fleet management tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Button asChild size="lg" className="text-lg px-8 py-4">
                  <Link href="/login">Get Started Today</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8 py-4 bg-transparent">
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Who is TruckPro For */}
        <section id="about" className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <h3 className="text-4xl font-bold text-gray-800 mb-12 text-center">Who is TruckPro For?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-bold">Fleet Owners</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600 mb-4">
                    Monitor trucks, schedule maintenance, keep your vehicles healthy and profitable.
                  </CardDescription>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Real-time fleet monitoring
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Automated maintenance alerts
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Vehicle health tracking
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-green-200">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-xl font-bold">Shippers</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600 mb-4">
                    Book reliable transport, get live rates and tracking, manage costs effectively.
                  </CardDescription>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Instant trip bookings
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Dynamic pricing
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Live tracking & updates
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-purple-200">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck className="w-8 h-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl font-bold">Drivers</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600 mb-4">
                    Receive trip assignments, see vehicle health, log performance and get support.
                  </CardDescription>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Trip assignments
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Vehicle health alerts
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Performance tracking
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <h3 className="text-4xl font-bold text-gray-800 mb-12 text-center">How It Works</h3>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                    1
                  </div>
                  <h4 className="font-semibold mb-2">Sign Up</h4>
                  <p className="text-sm text-gray-600">Create your account with basic information</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                    2
                  </div>
                  <h4 className="font-semibold mb-2">Login</h4>
                  <p className="text-sm text-gray-600">Access your personalized dashboard</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                    3
                  </div>
                  <h4 className="font-semibold mb-2">Choose Role</h4>
                  <p className="text-sm text-gray-600">Select Owner, Shipper, or Driver</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                    4
                  </div>
                  <h4 className="font-semibold mb-2">Access Dashboard</h4>
                  <p className="text-sm text-gray-600">Start managing your operations</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section id="features" className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <h3 className="text-4xl font-bold text-gray-800 mb-12 text-center">Feature Highlights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <Card className="text-center p-6">
                <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Real-time Tracking</h4>
                <p className="text-sm text-gray-600">Live vehicle tracking and route monitoring</p>
              </Card>
              <Card className="text-center p-6">
                <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Maintenance Alerts</h4>
                <p className="text-sm text-gray-600">Automated alerts for vehicle maintenance</p>
              </Card>
              <Card className="text-center p-6">
                <Clock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Instant Bookings</h4>
                <p className="text-sm text-gray-600">Quick trip booking with dynamic pricing</p>
              </Card>
              <Card className="text-center p-6">
                <Users className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Support System</h4>
                <p className="text-sm text-gray-600">Built-in assistance and support features</p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-700">
          <div className="container mx-auto text-center">
            <h3 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Operations?</h3>
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
              Join thousands of fleet operators, shippers, and drivers who trust TruckPro.
            </p>
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-4 px-8">
              <Link href="/login" className="flex items-center gap-2">
                Get Started Now <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto text-center">
            <h3 className="text-3xl font-bold text-gray-800 mb-8">Contact & Support</h3>
            <div className="max-w-2xl mx-auto">
              <p className="text-gray-600 mb-8">Need help getting started? Our support team is here to assist you.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Email Support</h4>
                  <p className="text-sm text-gray-600">support@truckpro.com</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Phone Support</h4>
                  <p className="text-sm text-gray-600">1-800-TRUCKPRO</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Live Chat</h4>
                  <p className="text-sm text-gray-600">Available 24/7</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-xl font-bold">TruckPro</h4>
              </div>
              <p className="text-gray-400">Comprehensive fleet management platform for modern logistics.</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Product</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#about" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Legal</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} TruckPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
