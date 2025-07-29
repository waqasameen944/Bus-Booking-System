import express from "express";
import dotenv from "dotenv";
import Booking from "../models/Booking.js";
import BusSchedule from "../models/BusSchedule.js";
import ErrorHandler from "../utils/errorHandler.js";

dotenv.config();

//router object
const router = express.Router();

//Get Dashboard Statistics
export const getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    // 1️⃣ Total bookings (excluding cancelled)
    const totalBookings = await Booking.countDocuments({
      status: { $ne: "cancelled" },
    });

    // 2️⃣ Today's bookings
    const todayBookings = await Booking.countDocuments({
      date: { $gte: today, $lt: tomorrow },
      status: { $ne: "cancelled" },
    });

    // 3️⃣ Total revenue (sum of completed bookings)
    const totalRevenueAgg = await Booking.aggregate([
      { $match: { paymentStatus: "completed", status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    // 4️⃣ Pending payments
    const pendingPayments = await Booking.countDocuments({
      paymentStatus: "pending",
    });

    // 5️⃣ Weekly growth (compare last 7 days vs previous 7 days)
    const currentWeekBookings = await Booking.countDocuments({
      date: { $gte: sevenDaysAgo, $lt: today },
      status: { $ne: "cancelled" },
    });

    const prevWeekStart = new Date(sevenDaysAgo);
    prevWeekStart.setDate(prevWeekStart.getDate() - 7);

    const previousWeekBookings = await Booking.countDocuments({
      date: { $gte: prevWeekStart, $lt: sevenDaysAgo },
      status: { $ne: "cancelled" },
    });

    let weeklyGrowth = 0;
    if (previousWeekBookings > 0) {
      weeklyGrowth = (
        ((currentWeekBookings - previousWeekBookings) / previousWeekBookings) *
        100
      ).toFixed(1);
    }

    // 6️⃣ Average bookings per day (last 30 days)
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const last30DaysBookings = await Booking.countDocuments({
      date: { $gte: thirtyDaysAgo, $lt: today },
      status: { $ne: "cancelled" },
    });

    const averageBookingsPerDay = (last30DaysBookings / 30).toFixed(1);

    // 7️⃣ Occupancy rate (assumes max 15 seats per booking)

    const totalSeatsAvailable = process.env.TotalSeatsAvailable;

    // Find how many seats are occupied across all bookings
    const occupiedSeatsAgg = await Booking.aggregate([
      { $match: { status: "confirmed" } }, // only confirmed bookings
      { $group: { _id: null, total: { $sum: 1 } } }, // sum the booked seats
    ]);

    const occupiedSeats = occupiedSeatsAgg[0]?.total || 0;

    // Find total possible seats (15 seats per booking date & timeSlot)
    const totalSlots =
      (await Booking.distinct("date").length) * 3 * totalSeatsAvailable;

    const occupancyRate = totalSlots
      ? ((occupiedSeats / totalSlots) * 100).toFixed(1)
      : 0;

    // 8️⃣ Revenue growth (compare this month vs last month)
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonthStart = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    const thisMonthRevenueAgg = await Booking.aggregate([
      {
        $match: {
          date: { $gte: thisMonthStart },
          paymentStatus: "completed",
          status: { $ne: "cancelled" },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const thisMonthRevenue = thisMonthRevenueAgg[0]?.total || 0;

    const lastMonthRevenueAgg = await Booking.aggregate([
      {
        $match: {
          date: { $gte: lastMonthStart, $lte: lastMonthEnd },
          paymentStatus: "completed",
          status: { $ne: "cancelled" },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const lastMonthRevenue = lastMonthRevenueAgg[0]?.total || 0;

    let revenueGrowth = 0;
    if (lastMonthRevenue > 0) {
      revenueGrowth = (
        ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) *
        100
      ).toFixed(1);
    }

    // Final Response
    res.json({
      success: true,
      statistics: {
        totalBookings,
        todayBookings,
        totalRevenue,
        pendingPayments,
        weeklyGrowth: parseFloat(weeklyGrowth),
        averageBookingsPerDay: parseFloat(averageBookingsPerDay),
        occupancyRate: parseFloat(occupancyRate),
        revenueGrowth: parseFloat(revenueGrowth),
      },
    });
  } catch (error) {
    next(error);
  }
};

//Get all booking with pagination and filters
export const getBookings = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page) || 1;
    const limit = Number.parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.data) {
      const date = new Date(req.query.date);
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      filter.date = { $gte: date, $lt: nextDay };
    }

    if (req.query.timeSlot) {
      filter.timeSlot = req.query.timeSlot;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.paymentStatus) {
      filter.paymentStatus = req.query.paymentStatus;
    }

    //Get Booking
    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    //Get total count
    const totalCount = await Booking.countDocuments(filter);
    const totalBookings = await Booking.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      success: true,
      bookings,
      pagination: {
        currentPage: page,
        totalPages,
        totalBookings,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get booking details
export const getBookingDetails = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return next(new ErrorHandler("Booking not found", 404));
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// Update booking stats
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["confirmed", "cancelled", "completed"].includes(status)) {
      return next(new ErrorHandler("Invalid status", 400));
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return next(new ErrorHandler("Booking not found", 404));
    }

    booking.status = status;
    await booking.save();

    // If cancelling, release the seat
    if (status === "cancelled") {
      const schedule = await BusSchedule.findOne({
        date: booking.date,
        timeSlot: booking.timeSlot,
      });

      if (schedule) {
        await schedule.releaseSeat(booking.seatNumber);
      }
    }

    res.json({
      success: true,
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// Get schedule overview
export const getScheduleOverview = async (req, res, next) => {
  try {
    const { date } = req.body;

    const filter = {};

    if (date) {
      const requestedDate = new Date(date);
      const nextDay = new Date(requestedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.date = { $gte: requestedDate, $lt: nextDay };
    } else {
      // Default to next 7 days
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      filter.date = { $gte: today, $lt: nextWeek };
    }

    const schedules = await BusSchedule.find(filter)
      .populate(
        "bookedSeats.bookingId",
        "bookingCode passenger.name passenger.email"
      )
      .sort({ date: 1, timeSlot: 1 });

    res.json({
      success: true,
      schedules,
    });
  } catch (error) {
    next(error);
  }
};
