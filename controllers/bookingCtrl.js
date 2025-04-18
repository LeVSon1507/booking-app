const Booking = require("../models/bookingModel");
const moment = require("moment");
const Room = require("../models/roomModel");
const User = require("../models/userModel");

const { v4 } = require("uuid");

const bookingCtrl = {
  createBooking: async (req, res, next) => {
    try {
      const { room, userId, startDate, endDate, totalAmount, totalDays } =
        req.body;

      const roomDetails = await Room.findOne({ _id: room._id });
      if (!roomDetails) {
        return res.status(404).json({ message: "Room not found" });
      }

      const newBooking = new Booking({
        room: room.name,
        roomId: room._id,
        userId,
        startDate: moment(startDate).format("MM-DD-YYYY"),
        endDate: moment(endDate).format("MM-DD-YYYY"),
        totalAmount,
        totalDays,
        transactionId: v4(),
        imageUrls: roomDetails.imageUrls,
      });

      const booking = await newBooking.save();

      roomDetails.currentBookings.push({
        bookingId: booking._id,
        startDate: moment(startDate).format("MM-DD-YYYY"),
        endDate: moment(endDate).format("MM-DD-YYYY"),
        userId: userId,
        status: booking.status,
      });

      await roomDetails.save();

      res.status(201).json({
        message: "Booking successful",
        booking: booking,
      });
    } catch (error) {
      next(error);
    }
  },

  getBookingById: async (req, res, next) => {
    try {
      const booking = await Booking.findById(req.params.id);

      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      const room = await Room.findOne({ _id: booking.roomId });

      const user = await User.findOne({ _id: booking.userId });

      res.status(200).json({
        booking,
        room: room
          ? {
              name: room.name,
              type: room.type,
              description: room.description,
              imageUrls: room.imageUrls,
            }
          : null,
        user: user
          ? {
              name: user.name,
              email: user.email,
              avatar: user.avatar,
            }
          : null,
      });
    } catch (error) {
      next(error);
    }
  },

  getAllBooking: async (req, res, next) => {
    try {
      const bookings = await Booking.find({});
      res.status(200).json(bookings);
    } catch (error) {
      next(error);
    }
  },

  getBookingByUserId: async (req, res, next) => {
    try {
      const bookings = await Booking.find({ userId: req.user.id });
      res.status(200).json(bookings);
    } catch (error) {
      next(error);
    }
  },

  cancelBooking: async (req, res, next) => {
    try {
      const { bookedId, roomId } = req.body;
      const bookingItem = await Booking.findOne({ _id: bookedId });
      bookingItem.status = "cancelled";
      await bookingItem.save();

      const roomItem = await Room.findOne({ _id: roomId });
      const bookings = roomItem.currentBookings;

      const bookingTemp = bookings.filter((booking) => {
        return booking.bookingId.toString() !== bookedId;
      });

      roomItem.currentBookings = bookingTemp;
      await roomItem.save();
      res.status(200).json({
        message: "Booking cancelled successfully",
        bookingItem,
        roomItem,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteBooking: async (req, res, next) => {
    try {
      const booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      await Booking.deleteOne({ _id: req.params.id });

      res.status(200).json({
        message: "Booking deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = bookingCtrl;
