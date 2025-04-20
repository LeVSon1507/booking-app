const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotels",
      required: true,
    },
    hotelName: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rooms",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
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
    paymentMethod: {
      type: String,
      required: true,
      default: "credit_card",
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "booked",
    },
    guestDetails: {
      name: String,
      email: String,
      phone: String,
    },
    specialRequests: {
      type: String,
      default: "",
    },
    hasReviewed: { type: Boolean, default: false },
    reviewId: { type: mongoose.Schema.Types.ObjectId, ref: "Review" },
  },
  {
    timestamps: true,
  }
);

const bookingModel = mongoose.model("Bookings", bookingSchema);
module.exports = bookingModel;
