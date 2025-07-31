import express from "express";
import jwt from "jsonwebtoken";
import userAuth from "../middlewares/auth.js";
import checkUser from "../controllers/checkUserController.js";

const router = express.Router();

router.get("/me", userAuth, checkUser);

export default router;
