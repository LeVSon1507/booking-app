const mongoose = require("mongoose");

const hotelSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrls: {
      type: Array,
      default: [],
    },
    amenities: {
      type: Array,
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: Array,
      default: [],
    },
    contactInfo: {
      phone: String,
      email: String,
    },
  },
  {
    timestamps: true,
  }
);

const hotelModel = mongoose.model("Hotels", hotelSchema);
module.exports = hotelModel;
