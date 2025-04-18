const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema(
  {
    room: {
      type: String,
      required: true,
    },
    roomId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    totalDays: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "booked",
    },
  },
  {
    timestamps: true,
  }
);
const bookingModel = mongoose.model("bookings", bookingSchema);

module.exports = bookingModel;
