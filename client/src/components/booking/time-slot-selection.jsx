"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";

export function TimeSlotSelection({
  selectedDate,
  selectedTimeSlot,
  onTimeSlotSelect,
  onNext,
  onBack,
}) {
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to get available seats for each time slot
    const fetchAvailableSeats = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data - in real app, this would come from your backend
      const mockTimeSlots = [
        {
          id: "morning",
          label: "Morning",
          time: "08:00 AM",
          availableSeats: Math.floor(Math.random() * 15) + 1,
        },
        {
          id: "noon",
          label: "Noon",
          time: "12:00 PM",
          availableSeats: Math.floor(Math.random() * 15) + 1,
        },
        {
          id: "evening",
          label: "Evening",
          time: "06:00 PM",
          availableSeats: Math.floor(Math.random() * 15) + 1,
        },
      ];

      setTimeSlots(mockTimeSlots);
      setLoading(false);
    };

    if (selectedDate) {
      fetchAvailableSeats();
    }
  }, [selectedDate]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading available time slots...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">
          Available Time Slots for {new Date(selectedDate).toLocaleDateString()}
        </h3>
        <p className="text-gray-600">Select your preferred departure time</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {timeSlots.map((slot) => (
          <Card
            key={slot.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedTimeSlot === slot.id
                ? "ring-2 ring-blue-500 bg-blue-50"
                : "hover:bg-gray-50"
            } ${
              slot.availableSeats === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => slot.availableSeats > 0 && onTimeSlotSelect(slot.id)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {slot.label}
                </span>
                {selectedTimeSlot === slot.id && (
                  <Badge variant="default">Selected</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600 mb-2">
                {slot.time}
              </p>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {slot.availableSeats > 0
                    ? `${slot.availableSeats} seats available`
                    : "Fully booked"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Date Selection
        </Button>
        <Button
          onClick={onNext}
          disabled={
            !selectedTimeSlot ||
            timeSlots.find((s) => s.id === selectedTimeSlot)?.availableSeats ===
              0
          }
        >
          Continue to Details
        </Button>
      </div>
    </div>
  );
}
