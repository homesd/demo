"use client";

import { packages as allPackages } from "@/lib/data";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  Download, 
  Mail, 
  Home,
  Calendar,
  Users,
  MapPin,
  Phone
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function PaymentSuccessPage({ params }: { params: { packageId: string } }) {
  const pkg = allPackages.find(p => p.id === Number(params.packageId));
  
  if (!pkg) return notFound();

  const bookingId = `RST${Date.now().toString().slice(-6)}`;
  const bookingDate = new Date().toLocaleDateString();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Successful!</h1>
          <p className="text-gray-600 mt-2">Your booking has been confirmed</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Booking Confirmation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Booking Confirmed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-green-800">Booking ID</h2>
                  <p className="text-3xl font-mono font-bold text-green-600 mt-2">{bookingId}</p>
                  <p className="text-sm text-green-700 mt-2">Save this booking ID for future reference</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking Date</span>
                  <span className="font-medium">{bookingDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="font-medium text-green-600">Confirmed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <span className="font-medium text-green-600">Paid</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="font-semibold">What's Next?</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 text-blue-600 mt-1" />
                    <span>Confirmation email sent to your registered email address</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-blue-600 mt-1" />
                    <span>Our travel coordinator will contact you within 24 hours</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Download className="h-4 w-4 text-blue-600 mt-1" />
                    <span>E-tickets and itinerary will be shared 48 hours before travel</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
                <Button variant="outline" className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Receipt
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Trip Details */}
          <Card>
            <CardHeader>
              <CardTitle>Trip Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Image
                  src={pkg.image}
                  alt={pkg.title}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              
              <div>
                <h3 className="font-bold text-xl">{pkg.title}</h3>
                <div className="flex items-center gap-2 text-gray-600 mt-2">
                  <MapPin className="h-4 w-4" />
                  <span>{pkg.destination}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <Calendar className="h-4 w-4" />
                  <span>{pkg.duration}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold">Package Includes</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Accommodation in 3-4 star hotels</li>
                  <li>• Daily breakfast and select meals</li>
                  <li>• Local transportation</li>
                  <li>• Professional tour guide</li>
                  <li>• All entry fees and permits</li>
                  <li>• Travel insurance</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800">Customer Support</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Need help? Contact us at <strong>+91-8000-123-456</strong> or email 
                  <strong> support@roamsoutheast.com</strong>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/my-trips">
              <Button variant="default" size="lg" className="w-full sm:w-auto">
                <Calendar className="h-5 w-5 mr-2" />
                View My Trips
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Home className="h-5 w-5 mr-2" />
                Book Another Trip
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-gray-500">
            Have questions? Check our <Link href="/faq" className="text-blue-600 hover:underline">FAQ</Link> or 
            contact our support team
          </p>
        </div>
      </div>
    </div>
  );
}
