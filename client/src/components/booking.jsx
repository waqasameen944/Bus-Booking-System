"use client";

import { useState } from "react";
import { DateSelection } from "@/components/booking/date-selection";
import { TimeSlotSelection } from "@/components/booking/time-slot-selection";
import { UserDetailsForm } from "@/components/booking/user-details-form";
import { PaymentForm } from "@/components/booking/payment-form";
import { BookingConfirmation } from "@/components/booking/booking-confirmation";

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState("date");
  const [bookingData, setBookingData] = useState({
    date: "",
    timeSlot: "morning",
    userName: "",
    userEmail: "",
    userPhone: "",
  });

  const steps = [
    { id: "date", label: "Select Date", completed: !!bookingData.date },
    {
      id: "time",
      label: "Choose Time",
      completed: !!bookingData.timeSlot && !!bookingData.date,
    },
    {
      id: "details",
      label: "Your Details",
      completed: !!bookingData.userName && !!bookingData.userEmail,
    },
    { id: "payment", label: "Payment", completed: !!bookingData.bookingCode },
    { id: "confirmation", label: "Confirmation", completed: false },
  ];

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleDateSelect = (date) => {
    setBookingData((prev) => ({ ...prev, date }));
  };

  const handleTimeSlotSelect = (timeSlot) => {
    setBookingData((prev) => ({ ...prev, timeSlot }));
  };

  const handleDetailsSubmit = (details) => {
    setBookingData((prev) => ({ ...prev, ...details }));
    setCurrentStep("payment");
  };

  const handlePaymentSuccess = (bookingCode) => {
    setBookingData((prev) => ({ ...prev, bookingCode }));
    setCurrentStep("confirmation");
  };

  const handleNewBooking = () => {
    setBookingData({
      date: "",
      timeSlot: "morning",
      userName: "",
      userEmail: "",
      userPhone: "",
    });
    setCurrentStep("date");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 font-sans">
      {/* Header */}

      <div className="max-w-4xl mx-auto px-4 pt-24 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
          🚌 Express Bus Booking
        </h1>
        <p className="text-gray-600 text-lg">
          Book your comfortable journey with us
        </p>
      </div>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-10   rounded-xl mt-8">
        {/* Step Header + Progress */}
        <div className="text-center mb-8">
          <h2 className="text-lg font-semibold text-gray-800">
            Step {currentStepIndex + 1} of {steps.length}:{" "}
            {steps[currentStepIndex].label}
          </h2>
          <div className="mt-3 h-3 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Booking Steps */}
        {currentStep === "date" && (
          <DateSelection
            selectedDate={bookingData.date}
            onDateSelect={handleDateSelect}
            onNext={() => setCurrentStep("time")}
          />
        )}
        {currentStep === "time" && (
          <TimeSlotSelection
            selectedDate={bookingData.date}
            selectedTimeSlot={bookingData.timeSlot}
            onTimeSlotSelect={handleTimeSlotSelect}
            onNext={() => setCurrentStep("details")}
            onBack={() => setCurrentStep("date")}
          />
        )}
        {currentStep === "details" && (
          <UserDetailsForm
            userEmail={bookingData.userEmail}
            userName={bookingData.userName}
            userPhone={bookingData.userPhone}
            onDetailsSubmit={handleDetailsSubmit}
            onBack={() => setCurrentStep("time")}
          />
        )}
        {currentStep === "payment" && (
          <PaymentForm
            bookingData={bookingData}
            onPaymentSuccess={handlePaymentSuccess}
            onBack={() => setCurrentStep("details")}
          />
        )}
        {currentStep === "confirmation" && (
          <BookingConfirmation
            bookingData={bookingData}
            onNewBooking={handleNewBooking}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center text-gray-600">
          <p className="mb-2">
            🚌 Express Bus Service - Your Comfort, Our Priority
          </p>
          <p className="text-sm">
            Need help? Contact us at{" "}
            <a
              href="mailto:support@expressbus.com"
              className="text-blue-600 hover:underline"
            >
              support@expressbus.com
            </a>{" "}
            or call{" "}
            <a
              href="tel:+15551234567"
              className="text-blue-600 hover:underline"
            >
              +1 (555) 123-4567
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
