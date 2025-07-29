import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookingCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
      enum: ["morning", "noon", "evening"],
    },
    passenger: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
    },
    seatNumber: {
      type: Number,
      min: 1,
      max: 15,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    paymentIntentId: {
      type: String,
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "completed"],
      default: "confirmed",
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
    adminNotified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


// Index for efficient queries
bookingSchema.index({ date: 1, timeSlot: 1 })
bookingSchema.index({ "passenger.email": 1 })
bookingSchema.index({ bookingCode: 1 })

// Virtual for formatted date
bookingSchema.virtual("formattedDate").get(function () {
  return this.date.toLocaleDateString()
})

// Method to check if booking can be cancelled
bookingSchema.methods.canBeCancelled = function () {
  const now = new Date()
  const bookingDate = new Date(this.date)
  const hoursDifference = (bookingDate - now) / (1000 * 60 * 60)
  return hoursDifference > 24 // Can cancel if more than 24 hours before travel
}

export default mongoose.model("Booking", bookingSchema);
