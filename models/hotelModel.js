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
    contactInfo: {
      phone: String,
      email: String,
    },
    rooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rooms",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Add indexes for common query patterns
hotelSchema.index({ city: 1 });
hotelSchema.index({ name: 1 });
// For sorting by rating
hotelSchema.index({ rating: -1 });

const hotelModel = mongoose.model("Hotels", hotelSchema);
module.exports = hotelModel;
