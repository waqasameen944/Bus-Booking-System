import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";

import dbConnect from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import "./config/passport.js";
import googleAuth from "./routes/googleAuthRoute.js";
import { cookie } from "express-validator";
import adminRoutes from "./routes/admin.js";
import bookingRoutes from "./routes/bookingRoutes.js";

//rest object
const app = express();
dotenv.config();
const PORT = process.env.PORT || 8080;

//google
app.use(
  session({
    secret: process.env.JWT_SECRET, // use env in production
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

//db connection
dbConnect();

//middleware
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//routes
app.use("/api/auth", authRoutes);
app.use("/api/v1/auth", googleAuth);
app.use("/api/admin", adminRoutes);
app.use("/api/bookings", bookingRoutes);
// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

//error routes
app.use(errorMiddleware);

//server listen
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

export default app;
