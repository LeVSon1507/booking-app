const Booking = require("../models/bookingModel");
const moment = require("moment");
const Room = require("../models/roomModel");
const User = require("../models/userModel");
const Hotel = require("../models/hotelModel");

const { v4 } = require("uuid");
const { sendBookingConfirmationEmail } = require("./sendMailSendgrid");

const bookingCtrl = {
  createBooking: async (req, res, next) => {
    try {
      const {
        room,
        hotelId,
        userId,
        startDate,
        endDate,
        totalAmount,
        paymentMethod,
        totalDays,
        guestDetails,
        specialRequests,
      } = req.body;

      const roomDetails = await Room.findOne({ _id: room._id });
      if (!roomDetails) {
        return res.status(404).json({ message: "Room not found" });
      }

      const hotel = await Hotel.findOne({ _id: hotelId });
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }

      const user = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const newBooking = new Booking({
        hotelId: hotel._id,
        hotelName: hotel.name,
        room: room.name,
        roomId: room._id,
        userId,
        startDate: moment(startDate).format("MM-DD-YYYY"),
        endDate: moment(endDate).format("MM-DD-YYYY"),
        totalAmount,
        totalDays,
        paymentMethod,
        transactionId: v4(),
        imageUrls: roomDetails.imageUrls,
        guestDetails: guestDetails || {
          name: user.name,
          email: user.email,
        },
        specialRequests: specialRequests || "",
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

      try {
        await sendBookingConfirmationEmail(booking, roomDetails, user, hotel);
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
      }

      res.status(201).json({
        message: "Booking successful",
        booking: booking,
      });
    } catch (error) {
      next(error);
    }
  },

  uploadBookingEvidence: async (req, res) => {
    try {
      const bookingId = req.params.id;

      const booking = await Booking.findOne({
        _id: bookingId,
        userId: req.user.id,
      });

      if (!booking) {
        return res
          .status(404)
          .json({ message: "Booking not found or you don't have permission" });
      }

      if (!req.files || !req.files.evidence) {
        return res.status(400).json({ message: "No files were uploaded." });
      }

      const files = req.files.evidence;
      const fileArray = Array.isArray(files) ? files : [files];

      if (fileArray.length > 3) {
        return res.status(400).json({ message: "Maximum 3 files allowed" });
      }

      const uploadPromises = fileArray.map((file) => {
        return new Promise((resolve, reject) => {
          if (!file.mimetype.match(/image.*/)) {
            return reject("Only images are allowed");
          }

          if (file.size > 5 * 1024 * 1024) {
            return reject("File size too large (max 5MB)");
          }

          cloudinary.v2.uploader.upload(
            file.tempFilePath,
            {
              folder: `evidence/${bookingId}`,
              width: 1024,
              crop: "limit",
            },
            (err, result) => {
              if (err) return reject(err);

              removeTmp(file.tempFilePath);
              resolve(result.secure_url);
            }
          );
        });
      });

      const evidenceUrls = await Promise.all(uploadPromises).catch((err) => {
        console.log("Error  :", err);
      });

      res.json({
        message: "Evidence uploaded successfully",
        evidenceUrls,
      });
    } catch (err) {
      console.error("Error uploading evidence:", err);
      return res.status(500).json({ message: err.message });
    }
  },
  getBookingById: async (req, res, next) => {
    try {
      const booking = await Booking.findById(req.params.id);

      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      const room = await Room.findOne({ _id: booking.roomId });
      const hotel = await Hotel.findOne({ _id: booking.hotelId });
      const user = await User.findOne({ _id: booking.userId });

      res.status(200).json({
        booking,
        hotel: hotel
          ? {
              name: hotel.name,
              address: hotel.address,
              city: hotel.city,
              imageUrls: hotel.imageUrls,
            }
          : null,
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

  getBookingsByHotelId: async (req, res, next) => {
    try {
      const bookings = await Booking.find({ hotelId: req.params.hotelId });
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

      const user = await User.findOne({ _id: bookingItem.userId });
      const hotel = await Hotel.findOne({ _id: bookingItem.hotelId });

      if (user && hotel) {
        try {
          await sendBookingConfirmationEmail(
            bookingItem,
            roomItem,
            user,
            hotel
          );
        } catch (emailError) {
          console.error("Failed to send cancellation email:", emailError);
        }
      }

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
