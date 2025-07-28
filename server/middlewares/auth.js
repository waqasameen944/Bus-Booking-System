import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import ErrorHandler from "../utils/errorHandler.js";

dotenv.config();

const userAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new ErrorHandler("Not authorized to access this route", 401));
    }
    //Grab token
    const token = authHeader.split(" ")[1];

    //verify token
    const payLoad = JWT.verify(token, process.env.JWT_SECRET);

    // Attach user ID to request
    req.user = payLoad;
    next();
  } catch (error) {
    next(error);
  }
};

export default userAuth;
