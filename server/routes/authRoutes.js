import express from "express";
import {
  getUserProfile,
  login,
  logout,
  register,
  updateUserProfile,
} from "../controllers/authController.js";
import { runValidation } from "../middlewares/errorValidations.js";
import {
  userValidate,
  loginValidate,
  updateUserValidate,
} from "../validator/userValidator.js";
import userAuth from "../middlewares/auth.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";

//router object
const router = express.Router();

//✅ routes
//👉 register route
// router.post("/register", userValidate, runValidation, register);

//👉 login route
router.post("/login", loginValidate, runValidation, login);

//👉 log out
router.get("/logout", userAuth, logout);

//👉 Protected Routes
router.get(
  "/profile",
  userAuth,
  authorizeRoles("admin", "user"),
  getUserProfile
);
router.put(
  "/profile",
  userAuth,
  authorizeRoles("admin", "user"),
  updateUserValidate,
  runValidation,
  updateUserProfile
);

export default router;
