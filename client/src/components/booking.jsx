"use client";

import { useState } from "react";
import { Progress } from "@/components/ui/progress";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🚌 Express Bus Booking
            </h1>
            <p className="text-gray-600">
              Book your comfortable journey with us
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-2">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center ${
                    index < steps.length - 1 ? "flex-1" : ""
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      currentStepIndex >= index
                        ? "bg-blue-600 text-white"
                        : step.completed
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step.completed && currentStepIndex > index
                      ? "✓"
                      : index + 1}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      currentStepIndex >= index
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </span>
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-0.5 bg-gray-200 mx-4">
                      <div
                        className={`h-full transition-all duration-300 ${
                          currentStepIndex > index
                            ? "bg-blue-600"
                            : "bg-gray-200"
                        }`}
                        style={{
                          width: currentStepIndex > index ? "100%" : "0%",
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
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
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
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
        </div>
      </footer>
    </div>
  );
}
