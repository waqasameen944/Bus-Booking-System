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
  const formatDateToLocal = (date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0"); // months are 0-indexed
    const day = `${date.getDate()}`.padStart(2, "0");

    return `${year}-${month}-${day}`; // "YYYY-MM-DD"
  };

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const formattedDate = formatDateToLocal(selectedDate);
      const response = await fetch(
        `/api/admin/schedule/?date=${formattedDate}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        console.error("Response not OK:", response.status);
        toast.error("Failed to fetch Schedules.");
        return;
      }

      const data = await response.json();
      setSchedules(data.schedules);
      console.log(data);

      
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
