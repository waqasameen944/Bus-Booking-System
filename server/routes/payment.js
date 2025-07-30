import express from "express";
import Stripe from "stripe";
import Booking from "../models/Booking.js";
import {
  sendConfirmationEmail,
  sendAdminNotification,
} from "../utils/helpers.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create payment intent
router.post("/create-payment-intent", async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.paymentStatus === "completed") {
      return res.status(400).json({
        success: false,
        message: "Payment already completed",
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.amount * 100), // Convert to cents
      currency: "usd",
      metadata: {
        bookingId: booking._id.toString(),
        bookingCode: booking.bookingCode,
      },
    });

    // Update booking with payment intent ID
    booking.paymentIntentId = paymentIntent.id;
    await booking.save();

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      amount: booking.amount,
    });
  } catch (error) {
    console.error("Payment intent creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment intent",
    });
  }
});

// Confirm payment
router.post("/confirm-payment", async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        success: false,
        message: "Payment not successful",
      });
    }

    // Find booking
    const booking = await Booking.findOne({ paymentIntentId });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Update booking payment status
    booking.paymentStatus = "completed";
    await booking.save();

    // Send confirmation emails
    try {
      await sendConfirmationEmail(booking);
      booking.emailSent = true;

      await sendAdminNotification(booking);
      booking.adminNotified = true;

      await booking.save();
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Don't fail the payment confirmation if email fails
    }

    res.json({
      success: true,
      message: "Payment confirmed successfully",
      booking: {
        bookingCode: booking.bookingCode,
        paymentStatus: booking.paymentStatus,
      },
    });
  } catch (error) {
    console.error("Payment confirmation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to confirm payment",
    });
  }
});

// Stripe webhook endpoint
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log("Payment succeeded:", paymentIntent.id);

        // Update booking status
        const booking = await Booking.findOne({
          paymentIntentId: paymentIntent.id,
        });
        if (booking && booking.paymentStatus !== "completed") {
          booking.paymentStatus = "completed";
          await booking.save();

          // Send emails if not already sent
          if (!booking.emailSent) {
            try {
              await sendConfirmationEmail(booking);
              await sendAdminNotification(booking);
              booking.emailSent = true;
              booking.adminNotified = true;
              await booking.save();
            } catch (emailError) {
              console.error("Email sending error in webhook:", emailError);
            }
          }
        }
        break;

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object;
        console.log("Payment failed:", failedPayment.id);

        // Update booking status
        const failedBooking = await Booking.findOne({
          paymentIntentId: failedPayment.id,
        });
        if (failedBooking) {
          failedBooking.paymentStatus = "failed";
          await failedBooking.save();
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  }
);

export default router;
