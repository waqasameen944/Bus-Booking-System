import ErrorHandler from "../utils/errorHandler.js";

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorHandler("Access Denied: Insufficient Role", 403));
    }
    next();
  };
};

export default authorizeRoles;
