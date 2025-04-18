const mongoose = require("mongoose");

const roomSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      require: true,
    },
    imageUrls: [],
    currentBookings: [],
    type: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);
const roomModel = mongoose.model("Rooms", roomSchema);

module.exports = roomModel;