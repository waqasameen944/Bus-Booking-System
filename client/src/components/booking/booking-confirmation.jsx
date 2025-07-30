"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Mail, Calendar, Clock, User, Phone } from "lucide-react";

export function BookingConfirmation({ bookingData, onNewBooking }) {
  const timeSlotLabels = {
    morning: "Morning (08:00 AM)",
    noon: "Noon (12:00 PM)",
    evening: "Evening (06:00 PM)",
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-green-700 mb-2">
          Booking Confirmed!
        </h2>
        <p className="text-gray-600">
          Your bus ticket has been successfully booked and paid for.
        </p>
      </div>

      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Booking Details</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Confirmed
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Travel Date</p>
                  <p className="font-medium">
                    {new Date(bookingData.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Clock className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Departure Time</p>
                  <p className="font-medium">
                    {timeSlotLabels[bookingData.timeSlot]}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <User className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Passenger Name</p>
                  <p className="font-medium">{bookingData.userName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-full">
                  <Phone className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="font-medium">{bookingData.userPhone}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Booking Code</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                <span className="text-2xl font-bold text-gray-900">
                  {bookingData.bookingCode}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Please save this code for your records
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">
                Confirmation Emails Sent
              </h4>
              <p className="text-sm text-blue-700">
                We've sent booking confirmation emails to both you (
                {bookingData.userEmail}) and our administrator. Please check
                your inbox for your ticket details.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center space-y-4">
        <div className="text-sm text-gray-600">
          <p>Need help? Contact us at support@expressbus.com</p>
          <p>or call us at +1 (555) 123-4567</p>
        </div>

        <Button onClick={onNewBooking} size="lg" className="w-full md:w-auto">
          Book Another Ticket
        </Button>
      </div>
    </div>
  );
}
