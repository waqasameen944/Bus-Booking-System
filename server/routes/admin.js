import express from "express";

import {
  getBookingDetails,
  getBookings,
  getDashboardStats,
  getScheduleOverview,
  updateBookingStatus,
} from "../controllers/adminController.js";
import userAuth from "../middlewares/auth.js";

//router object
const router = express.Router();

//Get Dashboard Statistics
router.get("/dashboard", userAuth, getDashboardStats);

//Get all booking with pagination and filters
router.get("/bookings", userAuth, getBookings);

// Get booking details
router.get("/booking/:id", userAuth, getBookingDetails);

// Update booking stats
router.patch("/booking/:id", userAuth, updateBookingStatus);

// Get schedule overview
router.get("/schedule", userAuth, getScheduleOverview);

export default router;
