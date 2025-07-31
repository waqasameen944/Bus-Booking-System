import express from "express";
import dotenv from "dotenv";
import Booking from "../models/Booking.js";
import BusSchedule from "../models/BusSchedule.js";
import ErrorHandler from "../utils/errorHandler.js";

dotenv.config();

const router = express.Router();

// Config values from .env
const BASE_PRICE = parseFloat(process.env.BUS_SEAT_PRICE || 25);;
if (!BASE_PRICE) console.log("Please set BASE_PRICE in .env");
const SERVICE_FEE = parseFloat(process.env.SERVICE_FEE || 2);
if (!SERVICE_FEE) console.log("Please set SERVICE_FEE in .env");
const TOTAL_SEATS = parseInt(process.env.TOTAL_SEATS_AVAILABLE || 15);
if (!TOTAL_SEATS) console.log("Please set TOTAL_SEATS in .env");

// Helper: validate email
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Helper: time slot labels
const getTimeSlotTime = (timeSlot) => {
  switch (timeSlot) {
    case "morning":
      return "09:00 AM";
    case "noon":
      return "12:00 PM";
    case "evening":
      return "03:00 PM";
    default:
      return "";
  }
};

/**
 * Get available time slots for a date
 */
export const getAvailability = async (req, res, next) => {
  try {
    const { date } = req.params;
    const requestedDate = new Date(date);

    // Validate date
    if (!requestedDate || isNaN(requestedDate.getTime())) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid date format" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (requestedDate < today) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot select past dates" });
    }

    const timeSlots = ["morning", "noon", "evening"];
    const availability = [];

    for (const timeSlot of timeSlots) {
      let schedule = await BusSchedule.findOne({ date, timeSlot });

      if (!schedule) {
        // Create schedule if it doesn't exist
        schedule = new BusSchedule({
          date,
          timeSlot,
          totalSeats: TOTAL_SEATS,
          availableSeats: TOTAL_SEATS,
          bookedSeats: [],
          price: BASE_PRICE,
        });
        await schedule.save();
      }

      availability.push({
        timeSlot,
        label: timeSlot.charAt(0).toUpperCase() + timeSlot.slice(1),
        time: getTimeSlotTime(timeSlot),
        availableSeats: schedule.availableSeats,
        totalSeats: schedule.totalSeats,
        price: schedule.price,
      });
    }

    res.status(200).json({
      success: true,
      date: requestedDate.toISOString().split("T")[0],
      availability,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create booking
 */
export const createBooking = async (req, res, next) => {
  try {
    const { date, timeSlot, passenger } = req.body;
    const errors = [];

    // Validation
    if (!date) {
      errors.push({ field: "date", message: "Date is required" });
    }
    if (!timeSlot || !["morning", "noon", "evening"].includes(timeSlot)) {
      errors.push({
        field: "timeSlot",
        message: "Valid time slot is required",
      });
    }
    if (!passenger) {
      errors.push({
        field: "passenger",
        message: "Passenger info is required",
      });
    } else {
      if (!passenger.name || passenger.name.trim().length < 2) {
        errors.push({
          field: "passenger.name",
          message: "Name must be at least 2 characters",
        });
      }
      if (!passenger.email || !isValidEmail(passenger.email)) {
        errors.push({
          field: "passenger.email",
          message: "Valid email is required",
        });
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (bookingDate < today) {
      return next(new ErrorHandler("Cannot select past dates", 400));
    }

    // Find or create schedule
    let schedule = await BusSchedule.findOne({ date, timeSlot });
    if (!schedule) {
      schedule = new BusSchedule({
        date,
        timeSlot,
        totalSeats: TOTAL_SEATS,
        availableSeats: TOTAL_SEATS,
        bookedSeats: [],
        price: BASE_PRICE,
      });
      // console.log(schedule);
      await schedule.save();
    } else {
      console.log("Existing schedule price:", schedule.price);
    }

    // Check availability
    if (schedule.availableSeats <= 0) {
      return res.status(400).json({
        success: false,
        message: "No seats available for this time slot",
      });
    }

    // Generate booking code
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 3).toUpperCase();
    const bookingCode = `BUS${timestamp}${random}`;

    // Assign seat
    const bookedSeatNumbers = schedule.bookedSeats.map(
      (seat) => seat.seatNumber
    );
    let seatNumber = 1;
    while (
      bookedSeatNumbers.includes(seatNumber) &&
      seatNumber <= TOTAL_SEATS
    ) {
      seatNumber++;
    }

    if (seatNumber > TOTAL_SEATS) {
      return res.status(400).json({
        success: false,
        message: "No seats available",
      });
    }

    // Final price = schedule price + service fee
    const finalAmount = schedule.price + SERVICE_FEE;

    // Save booking
    // *******************************************************************************************************
    // *******************************************************************************************************
    const booking = new Booking({
      bookingCode,
      date,
      timeSlot,
      passenger,
      seatNumber,
      amount: finalAmount,
      paymentStatus: "pending",
    });
    await booking.save();

    // Reserve seat
    await schedule.bookSeat(seatNumber, booking._id);

    return res.status(200).json({
      success: true,
      message: "Booking created successfully",
      booking: {
        id: booking._id,
        bookingCode: booking.bookingCode,
        date: booking.date,
        timeSlot: booking.timeSlot,
        seatNumber: booking.seatNumber,
        amount: booking.amount,
        passenger: booking.passenger,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get booking by booking code
 */
export const getBooking = async (req, res, next) => {
  try {
    const { bookingCode } = req.params;
    const booking = await Booking.findOne({ bookingCode });

    if (!booking) {
      return next(new ErrorHandler("Booking not found", 404));
    }

    res.status(200).json({
      success: true,
      booking: {
        id: booking._id,
        bookingCode: booking.bookingCode,
        date: booking.date,
        timeSlot: booking.timeSlot,
        seatNumber: booking.seatNumber,
        amount: booking.amount,
        passenger: booking.passenger,
        paymentStatus: booking.paymentStatus,
        status: booking.status,
        createdAt: booking.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel booking
 */
export const cancelBooking = async (req, res, next) => {
  try {
    const { bookingCode } = req.params;

    if (!bookingCode || bookingCode.trim().length < 5) {
      return next(new ErrorHandler("Invalid booking code", 400));
    }

    const booking = await Booking.findOne({ bookingCode });
    if (!booking) {
      return next(new ErrorHandler("Booking not found", 404));
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled",
      });
    }

    // Check cancellation window (24 hrs)
    if (
      typeof booking.canBeCancelled === "function" &&
      !booking.canBeCancelled()
    ) {
      return res.status(400).json({
        success: false,
        message: "Booking cannot be cancelled less than 24 hours before travel",
      });
    }

    booking.status = "cancelled";
    await booking.save();

    const schedule = await BusSchedule.findOne({
      date: booking.date,
      timeSlot: booking.timeSlot,
    });

    if (schedule) {
      await schedule.releaseSeat(booking.seatNumber);
    }

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    next(error);
  }
};
