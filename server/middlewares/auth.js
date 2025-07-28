import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import ErrorHandler from "../utils/errorHandler.js";

dotenv.config();

const userAuth = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // If not in header, check cookies
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    // If token still not found
    if (!token) {
      return next(new ErrorHandler("Not authorized to access this route", 401));
    }

    // Verify token
    const payload = JWT.verify(token, process.env.JWT_SECRET);

    // Attach payload to request
    req.user = payload;
    next();
  } catch (error) {
    return next(new ErrorHandler("Token is invalid or expired", 401));
  }
};

export default userAuth;
