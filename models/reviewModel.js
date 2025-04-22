const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bookings",
      required: true,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotels",
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rooms",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    comment: {
      type: String,
      required: true,
    },
    evidenceUrls: {
      type: Array,
      default: [],
    },
    imageUrls: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ booking: 1 }, { unique: true });
const reviewModel = mongoose.model("Reviews", reviewSchema);

module.exports = reviewModel;
