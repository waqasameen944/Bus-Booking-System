"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Clock, Users, MapPin, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export function ScheduleOverview() {
  const [schedules, setSchedules] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedules();
  }, [selectedDate]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/schedule", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Response not OK:", response.status);
        toast.error("Failed to fetch Schedules.");
        return;
      }

      const data = await response.json();
      console.log(data);

      const mockSchedules = [
        {
          _id: "1",
          date: selectedDate.toISOString().split("T")[0],
          timeSlot: "morning",
          totalSeats: 15,
          availableSeats: 8,
          bookedSeats: [
            {
              seatNumber: 1,
              bookingId: "book1",
              passenger: { name: "John Doe", email: "john@example.com" },
            },
            {
              seatNumber: 3,
              bookingId: "book2",
              passenger: { name: "Jane Smith", email: "jane@example.com" },
            },
            {
              seatNumber: 5,
              bookingId: "book3",
              passenger: { name: "Mike Johnson", email: "mike@example.com" },
            },
            {
              seatNumber: 7,
              bookingId: "book4",
              passenger: { name: "Sarah Wilson", email: "sarah@example.com" },
            },
            {
              seatNumber: 9,
              bookingId: "book5",
              passenger: { name: "Tom Brown", email: "tom@example.com" },
            },
            {
              seatNumber: 11,
              bookingId: "book6",
              passenger: { name: "Lisa Davis", email: "lisa@example.com" },
            },
            {
              seatNumber: 13,
              bookingId: "book7",
              passenger: { name: "Chris Lee", email: "chris@example.com" },
            },
          ],
          price: 25.0,
          status: "active",
        },
        {
          _id: "2",
          date: selectedDate.toISOString().split("T")[0],
          timeSlot: "noon",
          totalSeats: 15,
          availableSeats: 3,
          bookedSeats: [
            {
              seatNumber: 1,
              bookingId: "book8",
              passenger: { name: "Alex Johnson", email: "alex@example.com" },
            },
            {
              seatNumber: 2,
              bookingId: "book9",
              passenger: { name: "Emma Wilson", email: "emma@example.com" },
            },
            {
              seatNumber: 4,
              bookingId: "book10",
              passenger: { name: "David Brown", email: "david@example.com" },
            },
            {
              seatNumber: 6,
              bookingId: "book11",
              passenger: { name: "Sophie Davis", email: "sophie@example.com" },
            },
            {
              seatNumber: 8,
              bookingId: "book12",
              passenger: { name: "Ryan Lee", email: "ryan@example.com" },
            },
            {
              seatNumber: 10,
              bookingId: "book13",
              passenger: { name: "Mia Taylor", email: "mia@example.com" },
            },
            {
              seatNumber: 12,
              bookingId: "book14",
              passenger: { name: "Jake Wilson", email: "jake@example.com" },
            },
            {
              seatNumber: 14,
              bookingId: "book15",
              passenger: { name: "Olivia Moore", email: "olivia@example.com" },
            },
            {
              seatNumber: 15,
              bookingId: "book16",
              passenger: { name: "Ethan Clark", email: "ethan@example.com" },
            },
            {
              seatNumber: 3,
              bookingId: "book17",
              passenger: { name: "Ava Martinez", email: "ava@example.com" },
            },
            {
              seatNumber: 5,
              bookingId: "book18",
              passenger: { name: "Noah Garcia", email: "noah@example.com" },
            },
            {
              seatNumber: 7,
              bookingId: "book19",
              passenger: {
                name: "Isabella Rodriguez",
                email: "isabella@example.com",
              },
            },
          ],
          price: 25.0,
          status: "active",
        },
        {
          _id: "3",
          date: selectedDate.toISOString().split("T")[0],
          timeSlot: "evening",
          totalSeats: 15,
          availableSeats: 15,
          bookedSeats: [],
          price: 25.0,
          status: "active",
        },
      ];

      setSchedules(mockSchedules);
    } catch (error) {
      console.error("Failed to fetch schedules:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeSlotLabel = (timeSlot) => {
    const labels = {
      morning: "Morning (08:00 AM)",
      noon: "Noon (12:00 PM)",
      evening: "Evening (06:00 PM)",
    };
    return labels[timeSlot] || timeSlot;
  };

  const getOccupancyColor = (availableSeats, totalSeats) => {
    const occupancy = ((totalSeats - availableSeats) / totalSeats) * 100;
    if (occupancy >= 90) return "text-red-600 bg-red-50";
    if (occupancy >= 70) return "text-orange-600 bg-orange-50";
    if (occupancy >= 50) return "text-yellow-600 bg-yellow-50";
    return "text-green-600 bg-green-50";
  };

  const renderSeatMap = (schedule) => {
    const seats = Array.from({ length: 15 }, (_, i) => i + 1);
    const bookedSeatNumbers = schedule.bookedSeats.map(
      (seat) => seat.seatNumber
    );

    return (
      <div className="space-y-3">
        <div className="grid grid-cols-5 gap-2 p-4 bg-gray-50 rounded-lg">
          {seats.map((seatNumber) => {
            const isBooked = bookedSeatNumbers.includes(seatNumber);
            const passenger = schedule.bookedSeats.find(
              (seat) => seat.seatNumber === seatNumber
            )?.passenger;

            return (
              <div
                key={seatNumber}
                className={`w-10 h-10 rounded flex items-center justify-center text-xs font-medium cursor-pointer transition-all ${
                  isBooked
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
                title={
                  isBooked
                    ? `Seat ${seatNumber} - ${passenger?.name}`
                    : `Seat ${seatNumber} - Available`
                }
              >
                {seatNumber}
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Available ({schedule.availableSeats})</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>
              Booked ({schedule.totalSeats - schedule.availableSeats})
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>🗓️ Schedule Overview</CardTitle>
          <Button onClick={fetchSchedules} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-6">
          <div className="flex-shrink-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-4">
              Schedule for{" "}
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h3>

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-32 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-4">
                {schedules.map((schedule) => (
                  <Card
                    key={schedule._id}
                    className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-gray-400" />
                          <div>
                            <h4 className="font-semibold">
                              {getTimeSlotLabel(schedule.timeSlot)}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Route: City Center → Airport
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getOccupancyColor(
                              schedule.availableSeats,
                              schedule.totalSeats
                            )}`}
                          >
                            {schedule.totalSeats - schedule.availableSeats}/
                            {schedule.totalSeats} seats
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            ${schedule.price.toFixed(2)} per seat
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 mb-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {schedule.availableSeats} available
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">Bus #001</span>
                        </div>
                        {schedule.availableSeats <= 3 &&
                          schedule.availableSeats > 0 && (
                            <div className="flex items-center gap-2 text-orange-600">
                              <AlertTriangle className="h-4 w-4" />
                              <span className="text-sm font-medium">
                                Almost Full
                              </span>
                            </div>
                          )}
                        {schedule.availableSeats === 0 && (
                          <Badge variant="destructive">Fully Booked</Badge>
                        )}
                      </div>

                      <div>
                        <h5 className="text-sm font-medium mb-2">Seat Map</h5>
                        {renderSeatMap(schedule)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
