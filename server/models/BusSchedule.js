import mongoose from "mongoose";

const busScheduleSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
      enum: ["morning", "noon", "evening"],
    },
    totalSeats: {
      type: Number,
      default: 15,
    },
    bookedSeats: [
      {
        seatNumber: Number,
        bookingId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Booking",
        },
      },
    ],
    availableSeats: {
      type: Number,
      default: 15,
    },
    price: {
      type: Number,
      default: 25.0,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "completed"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for unique date-timeSlot combination
busScheduleSchema.index({ date: 1, timeSlot: 1 }, { unique: true });

// Method to book a seat
busScheduleSchema.methods.bookSeat = function (seatNumber, bookingId) {
  if (this.availableSeats <= 0) {
    throw new Error("No seats available");
  }

  const seatExists = this.bookedSeats.some(
    (seat) => seat.seatNumber === seatNumber
  );
  if (seatExists) {
    throw new Error("Seat already booked");
  }

  this.bookedSeats.push({ seatNumber, bookingId });
  this.availableSeats = this.totalSeats - this.bookedSeats.length;

  return this.save();
};

// Method to release a seat
busScheduleSchema.methods.releaseSeat = function (seatNumber) {
  this.bookedSeats = this.bookedSeats.filter(
    (seat) => seat.seatNumber !== seatNumber
  );
  this.availableSeats = this.totalSeats - this.bookedSeats.length;

  return this.save();
};

export default mongoose.model("BusSchedule", busScheduleSchema);
