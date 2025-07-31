import User from "../models/User.js";
import ErrorHandler from "../utils/errorHandler.js";
const checkUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select("-password"); // exclude password
    if (!user) return next(new ErrorHandler("User not found", 404));

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export default checkUser;
