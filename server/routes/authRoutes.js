import express from "express";
import {
  getUserProfile,
  login,
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


//router object
const router = express.Router();

//✅ routes
//👉 register route
router.post("/register", userValidate, runValidation, register);

//👉 login route
router.post("/login", loginValidate, runValidation, login);

//👉 Protected Routes
router.get("/profile", userAuth, getUserProfile);
router.put(
  "/profile",
  userAuth,
  updateUserValidate,
  runValidation,
  updateUserProfile
);

export default router;
