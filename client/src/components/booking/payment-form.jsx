"use client";

import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Shield, MapPin, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const BUS_SEAT_PRICE = parseInt(import.meta.env.VITE_BUS_SEAT_PRICE || 25);

const SERVICE_FEE = parseInt(import.meta.env.VITE_SERVICE_FEE || 0);

// Initialize Stripe
const publishableKey = import.meta.env.VITE_STRIPE_PUBLISH_KEY;
if (!publishableKey) {
  console.error("Stripe publishable key is missing");
}

const stripePromise = loadStripe(publishableKey);

const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  },
  hidePostalCode: false,
};

function CheckoutForm({ bookingData, onPaymentSuccess, onBack }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);

  const timeSlotLabels = {
    morning: "Morning (08:00 AM)",
    noon: "Noon (12:00 PM)",
    evening: "Evening (06:00 PM)",
  };

  // Create booking + payment intent
  useEffect(() => {
    createBookingAndPaymentIntent();
  }, []);

  const createBookingAndPaymentIntent = async () => {
    try {
      // Create booking
      const bookingResponse = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:3000"
        }/api/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: bookingData.date,
            timeSlot: bookingData.timeSlot,
            passenger: {
              name: bookingData.userName,
              email: bookingData.userEmail,
              phone: bookingData.userPhone,
            },
          }),
          credentials: "include",
        }
      );

      if (!bookingResponse.ok) {
        const errorData = await bookingResponse.json();
        throw new Error(errorData.message || "Failed to create booking");
      }

      const bookingResult = await bookingResponse.json();
      // toast.success("Booking created successfully");

      // Create payment intent
      const paymentResponse = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:3000"
        }/api/payments/create-payment-intent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId: bookingResult.booking.id,
          }),
          credentials: "include",
        }
      );

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        throw new Error(errorData.message || "Failed to create payment intent");
      }

      const paymentResult = await paymentResponse.json();
      setClientSecret(paymentResult.clientSecret);
    } catch (error) {
      // console.error("Error creating booking/payment:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to initialize payment"
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      toast.error("Payment system not ready. Please try again.");
      return;
    }

    setProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error("Card information not found");
      setProcessing(false);
      return;
    }

    try {
      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: bookingData.userName,
              email: bookingData.userEmail,
              phone: bookingData.userPhone,
            },
          },
        });

      if (stripeError) throw new Error(stripeError.message || "Payment failed");

      if (paymentIntent?.status === "succeeded") {
        // Confirm payment with backend
        const confirmResponse = await fetch(
          `${
            import.meta.env.VITE_API_URL || "http://localhost:3000"
          }/api/payments/confirm-payment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              paymentIntentId: paymentIntent.id,
            }),
            credentials: "include",
          }
        );

        if (!confirmResponse.ok) {
          const errorData = await confirmResponse.json();
          throw new Error(errorData.message || "Failed to confirm payment");
        }

        const confirmResult = await confirmResponse.json();
        toast.success("Payment successful!");
        onPaymentSuccess(confirmResult.booking.bookingCode);
      } else {
        throw new Error("Payment was not successful");
      }
    } catch (error) {
      // console.error("Payment error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Payment failed. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Booking Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Booking Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">
                  {new Date(bookingData.date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">
                  {timeSlotLabels[bookingData.timeSlot]}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Passenger:</span>
                <span className="font-medium">{bookingData.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{bookingData.userEmail}</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Ticket Price:</span>
                <span className="font-medium">
                  ${BUS_SEAT_PRICE.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service Fee:</span>
                <span className="font-medium">${SERVICE_FEE.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${(BUS_SEAT_PRICE + SERVICE_FEE).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-blue-50">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Secure Payment
                  </span>
                </div>
                <p className="text-sm text-blue-700">
                  Your payment is secured by Stripe. We never store your card
                  details.
                </p>
              </div>

              {/* Stripe Card Element */}
              {clientSecret ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="p-4 border rounded-lg bg-white">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Information
                    </label>
                    <CardElement options={cardElementOptions} />
                  </div>

                  <div className="flex flex-col-reverse md:flex-row gap-2 justify-between pt-4">
                    <Button
                      className={"cursor-pointer"}
                      type="button"
                      variant="outline"
                      onClick={onBack}
                      disabled={processing}
                    >
                      Back to Details
                    </Button>
                    <Button
                      className={"cursor-pointer min-w-[120px]"}
                      type="submit"
                      disabled={!stripe || processing || !clientSecret}
                    >
                      {processing ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Processing...
                        </div>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Pay ${(BUS_SEAT_PRICE + 2).toFixed(2)}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-gray-600">
                    Initializing secure payment...
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function PaymentForm(props) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
}
