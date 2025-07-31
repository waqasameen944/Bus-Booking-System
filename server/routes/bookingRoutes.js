import express from "express";
import { body } from "express-validator";
import {
  getAvailability,
  createBooking,
  getBooking,
  cancelBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

// Validation middleware
const validateBooking = [
  body("date").isISO8601().withMessage("Valid date is required"),
  body("timeSlot")
    .isIn(["morning", "noon", "evening"])
    .withMessage("Valid time slot is required"),
  body("passenger.name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("passenger.email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("passenger.phone")
    .isMobilePhone()
    .withMessage("Valid phone number is required"),
];

// Routes
router.get("/availability/:date",   getAvailability);
router.post("/", validateBooking, createBooking);
router.get("/:bookingCode", getBooking);
router.delete("/:bookingCode", cancelBooking);

export default router;
