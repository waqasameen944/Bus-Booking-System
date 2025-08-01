"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DateSelection({ selectedDate, onDateSelect, onNext }) {
  const [date, setDate] = useState(
    selectedDate ? new Date(selectedDate) : undefined
  );

  const handleDateSelect = (selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);

      // Store the date exactly as selected (no timezone conversion)
      const formattedDate = `${selectedDate.getFullYear()}-${String(
        selectedDate.getMonth() + 1
      ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

      onDateSelect(formattedDate);
    }
  };

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Select Your Travel Date</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            className="rounded-md border w-1/2"
          />
        </CardContent>
      </Card>

      {selectedDate && (
        <div className="text-center">
          <p className="text-lg mb-4">
            Selected Date:{" "}
            <span className="font-semibold">
              {new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </p>
          <Button onClick={onNext} size="lg">
            Continue to Time Selection
          </Button>
        </div>
      )}
    </div>
  );
}
