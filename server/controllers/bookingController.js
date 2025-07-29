import express from "express";
import dotenv from "dotenv";
import Booking from "../models/Booking.js";
import BusSchedule from "../models/BusSchedule.js";
import ErrorHandler from "../utils/errorHandler.js";

dotenv.config();

//router object
const router = express.Router();


// Get available time slots for a specific date
export const getAvailability = async (req, res, next) => {
  try {
    const { date } = req.body;
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
          totalSeats: 15,
          availableSeats: 15,
          bookedSeats: [],
          price: 100, // Default price if required
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

// Helper function
const getTimeSlotTime = (timeSlot) => {
  switch (timeSlot) {
    case "morning":
      return "09:00 AM - 12:00 PM";
    case "noon":
      return "12:00 PM - 03:00 PM";
    case "evening":
      return "03:00 PM - 06:00 PM";
    default:
      return "";
  }
};

// Helper functions
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (phone) => /^[0-9]{10,15}$/.test(phone);

export const createBooking = async (req, res, next) => {
  try {
    const { date, timeSlot, passenger } = req.body;
    const errors = [];

    // Validate date
    if (!date) {
      errors.push({ field: "date", message: "Date is required" });
    }

    // Validate time slot
    if (!timeSlot || !["morning", "noon", "evening"].includes(timeSlot)) {
      errors.push({
        field: "timeSlot",
        message: "Valid time slot is required",
      });
    }

    // Validate passenger
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
      if (!passenger.phone || !isValidPhone(passenger.phone)) {
        errors.push({
          field: "passenger.phone",
          message: "Valid phone number is required",
        });
      }
    }

    // Return validation errors
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    // Check past date
    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (bookingDate < today) {
      return next(new ErrorHandler("Cannot select past dates", 400));
    }

    // Find or create bus schedule
    let schedule = await BusSchedule.findOne({ date, timeSlot });
    if (!schedule) {
      schedule = new BusSchedule({
        date,
        timeSlot,
        totalSeats: 15,
        availableSeats: 15,
        bookedSeats: [],
        price: 100, // set default price
      });
      await schedule.save();
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

    // Find available seat
    const bookedSeatNumbers = schedule.bookedSeats.map(
      (seat) => seat.seatNumber
    );
    let seatNumber = 1;
    while (bookedSeatNumbers.includes(seatNumber) && seatNumber <= 15) {
      seatNumber++;
    }

    if (seatNumber > 15) {
      return res
        .status(400)
        .json({ success: false, message: "No seats available" });
    }

    // Create booking
    const booking = new Booking({
      bookingCode,
      date,
      timeSlot,
      passenger,
      seatNumber,
      amount: schedule.price + 2, // Add service fee
      paymentStatus: "pending",
    });

    await booking.save();

    // Update schedule with booked seat
    await schedule.bookSeat(seatNumber, booking._id);

    // Send response
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

// Get booking by booking code
export const getBooking = async (req, res, next) => {
  try {
    const { bookingCode } = req.params;

    const booking = await Booking.findOne({ bookingCode }).toUpperCase();

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

// Cancel booking
export const cancelBooking = async (req, res, next) => {
  try {
    const { bookingCode } = req.params;

    // Validate booking code
    if (!bookingCode || bookingCode.trim().length < 5) {
      return next(new ErrorHandler("Invalid booking code", 400));
    }

    // Find booking
    const booking = await Booking.findOne({ bookingCode });
    if (!booking) {
      return next(new ErrorHandler("Booking not found", 404));
    }

    // Check status
    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled",
      });
    }

    // Check cancellation window (24 hours before)
    if (
      typeof booking.canBeCancelled === "function" &&
      !booking.canBeCancelled()
    ) {
      return res.status(400).json({
        success: false,
        message: "Booking cannot be cancelled less than 24 hours before travel",
      });
    }

    // Cancel booking
    booking.status = "cancelled";
    await booking.save();

    // Release seat in schedule
    const schedule = await BusSchedule.findOne({
      date: booking.date,
      timeSlot: booking.timeSlot,
    });

    if (schedule) {
      await schedule.releaseSeat(booking.seatNumber);
    }

    // Send response
    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    next(error);
  }
};
