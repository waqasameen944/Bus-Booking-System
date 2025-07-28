import bcrypt from "bcrypt";
import ErrorHandler from "../utils/errorHandler.js";
import User from "../models/User.js";

//register controller
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role = "user" } = req.body;

    // check if user already exists
    const user = await User.findOne({ email });
    if (user) return next(new ErrorHandler("User already exists", 400));

    //save user
    const result = await User({ name, email, password, role });
    await result.save();

    // Generate Token
    const token = result.createJWT();

    res.status(201).json({
      success: true,
      message: "User created Successfully",
      token,
    });
  } catch (error) {
    next(error);
  }
};

//login controller

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const checkEmail = await User.findOne({ email });
    if (!checkEmail) {
      return next(new ErrorHandler("Incorrect Email or Password", 404));
    }
    const isMatchPassword = await checkEmail.matchPassword(password);
    if (!isMatchPassword) {
      return next(new ErrorHandler("Incorrect Email or Password", 400));
    }

    //create token
    const token = checkEmail.createJWT();

    res.status(200).json({
      success: true,
      message: "Login successfully",
      user: {
        _id: checkEmail._id,
        name: checkEmail.name,
        email: checkEmail.email,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

//get user profile
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select("-password"); // exclude password

    if (!user) return next(new ErrorHandler("User not found", 404));

    res.status(200).json({
      success: true,
      message: "User found successfully",
      user,
    });

    console.log(user);
  } catch (error) {
    next(error);
  }
};

//update profile
export const updateUserProfile = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const updateFields = {};

    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (role) updateFields.role = role;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    const updateUser = await User.findByIdAndUpdate(
      req.user.userId,
      updateFields,
      { new: true }
    ).select("-password"); // exclude password

    if (!updateUser) return next(new ErrorHandler("User not found", 404));

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updateUser,
    });
  } catch (error) {
    next(error);
  }
};
