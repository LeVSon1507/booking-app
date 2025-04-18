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

      const newBooking = new Booking({
        room: room.name,
        roomId: room._id,
        userId,
        startDate: moment(startDate).format("MM-DD-YYYY"),
        endDate: moment(endDate).format("MM-DD-YYYY"),
        totalAmount,
        totalDays,
        transactionId: v4(),
      });

      const booking = newBooking.save();

      const roomTemp = await Room.findOne({ _id: room._id });

      roomTemp.currentBookings.push({
        bookingId: (await booking)._id,
        startDate: moment(startDate).format("MM-DD-YYYY"),
        endDate: moment(endDate).format("MM-DD-YYYY"),
        userId: userId,
        status: (await booking).status,
      });

      await roomTemp.save();

      res.status(201).json({ message: "Đặt phòng thành công" });
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
  getBookingById: async (req, res, next) => {
    try {
      const booking = await Booking.findById(req.params.id);
      res.status(200).json(booking);
    } catch (error) {
      next(error);
    }
  },
  getBookingByUserId: async (req, res, next) => {
    try {
      const bookings = await Booking.find({ userId: req.user.id });
      // console.log(bookings.length);
      res.status(200).json(bookings);
    } catch (error) {
      next(error);
    }
  },
  cancelBooking: async (req, res, next) => {
    try {
      const { bookedId, roomId } = req.body;
      // trỏ đến id của booking -> chuyển status = cancel
      const bookingItem = await Booking.findOne({ _id: bookedId });
      bookingItem.status = "cancelled";
      await bookingItem.save();

      // trỏ đến id của room -> xét remove() bookingId của room.currentBookings
      const roomItem = await Room.findOne({ _id: roomId });
      const bookings = roomItem.currentBookings;

      const bookingTemp = bookings.filter((booking) => {
        return booking.bookingId.toString() !== bookedId;
      });

      roomItem.currentBookings = bookingTemp;
      await roomItem.save();
      res.status(200).json({
        message: "Hủy bỏ đặt phòng thàng công",
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
          message: "Không có sản phẩm nào cả",
        });
      }
      await booking.remove()

      res.status(200).json({
        message: "Xóa booking thành công.",
      });
    } catch (error) {
      next(error);
    }
  },

  /**  
   * deleteBooking: async (req, res, next) => {
    try {
      // const { bookingId, roomId } = req.body;
      const { bookingId,roomId } = req.body;
      // trỏ đến id của booking
      const bookingItem = await Booking.findOne({ _id: bookingId });
      if (!bookingItem)
        return res.status(400).json({ message: "Không tìm thấy id booking" });

      await bookingItem.remove();

      // trỏ đến id của room -> xét bookingId  -> remove()
      const roomItem = await Room.findOne({ _id: roomId });
      if(!roomItem) return res.status(400).json({message: "Không tìm thấy id phòng"})
      const bookings = roomItem.currentBookings;

      const bookingTemp = bookings.filter((booking) => {
        return booking.bookingId.toString() !== bookingId;
      });

      roomItem.currentBookings = bookingTemp;

      await roomItem.save();

      res.status(200).json({
        message: "Xóa booking thành công.",
        bookingItem,
        roomItem,
      });
    } catch (error) {
      next(error);
    }
  }, */

};

module.exports = bookingCtrl;
