import express from "express";

import {
  getBookingDetails,
  getBookings,
  getDashboardStats,
  getScheduleOverview,
  updateBookingStatus,
} from "../controllers/adminController.js";
import userAuth from "../middlewares/auth.js";
import  authorizeRoles  from "../middlewares/authorizeRoles.js";

//router object
const router = express.Router();

//Get Dashboard Statistics
router.get("/dashboard", userAuth, authorizeRoles("admin"), getDashboardStats);

//Get all booking with pagination and filters
router.get("/bookings", userAuth, authorizeRoles("admin"), getBookings);

// Get booking details
router.get(
  "/booking/:id",
  userAuth,
  authorizeRoles("admin"),
  getBookingDetails
);

// Update booking stats
router.patch(
  "/booking/:id",
  userAuth,
  authorizeRoles("admin"),
  updateBookingStatus
);

// Get schedule overview
router.get("/schedule", userAuth, authorizeRoles("admin"), getScheduleOverview);

export default router;
