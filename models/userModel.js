const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name!"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email!"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password!"],
      trim: true,
    },
    role: {
      type: Number,
      default: 0, // 0 =user,1 admin
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dwgximj2j/image/upload/v1622192495/avatars/bcxeglrzxde9m7byob0x.jpg",
    },
  },
  {
    timestamps: true,
  }
);
const userModel = mongoose.model("Users", userSchema);
module.exports = userModel;
