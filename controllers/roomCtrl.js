const Room = require("../models/roomModel");
const Hotel = require("../models/hotelModel");
const mongoose = require("mongoose");
const moment = require("moment");

const roomCtrl = {
  getAllRooms: async (req, res, next) => {
    try {
      let { search = "", type = "", hotelId = "" } = req.query;
      let condition = {};

      if (search) {
        condition.name = new RegExp(search, "i");
      }
      if (type) {
        condition.type = new RegExp(type, "i");
      }
      if (hotelId) {
        condition.hotelId = hotelId;
      }

      let rooms = await Room.find(condition);

      if (type === "all") {
        let filtered = {};
        if (search) {
          filtered.name = new RegExp(search, "i");
        }
        if (hotelId) {
          filtered.hotelId = hotelId;
        }
        rooms = await Room.find(filtered);
      }

      return res.status(200).json(rooms);
    } catch (error) {
      next(error);
    }
  },

  getRoomById: async (req, res, next) => {
    try {
      const room = await Room.findById(req.params.id);
      if (!room)
        return res.status(400).json({
          message: "Not found id room",
        });

      const hotel = await Hotel.findById(room.hotelId);

      return res.status(200).json({
        room,
        hotel: hotel
          ? {
              name: hotel.name,
              address: hotel.address,
              city: hotel.city,
            }
          : null,
      });
    } catch (error) {
      next(error);
    }
  },

  getRoomsByHotelId: async (req, res, next) => {
    try {
      const { hotelId } = req.params;
      const { startDate, endDate } = req.query;
      console.log("Fetching rooms for hotelId:", hotelId);
      console.log("Date range:", startDate, endDate);

      if (!mongoose.Types.ObjectId.isValid(hotelId)) {
        return res.status(400).json({
          message: "Invalid hotel ID format",
          rooms: [],
        });
      }

      const rooms = await Room.find({ hotelId });
      console.log(`Found ${rooms.length} rooms for hotel ${hotelId}`);

      if (!startDate || !endDate) {
        return res.status(200).json(rooms);
      }

      const start = moment(startDate, "DD-MM-YYYY").toDate();
      const end = moment(endDate, "DD-MM-YYYY").toDate();

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({
          message: "Invalid date format. Please use DD-MM-YYYY format",
          rooms: [],
        });
      }

      if (start >= end) {
        return res.status(400).json({
          message: "Start date must be before end date",
          rooms: [],
        });
      }

      const availableRooms = rooms.filter((room) => {
        if (!room.isAvailable) return false;

        const hasConflictBooking = room.currentBookings.some((booking) => {
          const bookingStart = new Date(booking.startDate);
          const bookingEnd = new Date(booking.endDate);

          return (
            start < bookingEnd &&
            end > bookingStart &&
            booking.status !== "cancelled"
          );
        });

        return !hasConflictBooking;
      });

      console.log(
        `Found ${availableRooms.length} available rooms for the selected dates`
      );

      const result = {
        rooms: availableRooms,
        dateInfo: {
          startDate,
          endDate,
          totalAvailable: availableRooms.length,
        },
      };

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getRoomsByHotelId:", error);
      return res.status(500).json({
        message: "Server error when fetching rooms",
        error: error.message,
        rooms: [],
      });
    }
  },

  getManyRoom: async (req, res, next) => {
    try {
      let { search = "", hotelId = "" } = req.query;
      let condition = {};

      if (search) {
        condition.name = new RegExp(search, "i");
      }
      if (hotelId) {
        condition.hotelId = hotelId;
      }

      const rooms = await Room.find(condition);

      return res.status(200).json(rooms);
    } catch (error) {
      next(error);
    }
  },

  createRoom: async (req, res, next) => {
    try {
      const {
        name,
        hotelId,
        price,
        type,
        description,
        imageUrls,
        capacity,
        amenities,
      } = req.body;

      const hotel = await Hotel.findById(hotelId);
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }

      const newRoom = new Room({
        name,
        hotelId,
        price,
        type,
        description,
        imageUrls: imageUrls || [],
        capacity: capacity || 2,
        amenities: amenities || [],
      });

      const savedRoom = await newRoom.save();

      hotel.rooms.push(savedRoom._id);
      await hotel.save();

      return res.status(201).json({
        message: "Room created successfully",
        room: savedRoom,
      });
    } catch (error) {
      next(error);
    }
  },

  updateRoom: async (req, res, next) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const room = await Room.findById(id);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      const updatedRoom = await Room.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true }
      );

      return res.status(200).json({
        message: "Room updated successfully",
        room: updatedRoom,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteRoom: async (req, res, next) => {
    try {
      const { id } = req.params;

      const room = await Room.findById(id);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      if (room.currentBookings && room.currentBookings.length > 0) {
        return res.status(400).json({
          message: "Cannot delete room with active bookings",
        });
      }

      await Room.findByIdAndDelete(id);

      return res.status(200).json({
        message: "Room deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = roomCtrl;
