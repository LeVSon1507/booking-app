const Hotel = require("../models/hotelModel");
const Room = require("../models/roomModel");
const Booking = require("../models/bookingModel");

const hotelCtrl = {
  getAllHotels: async (req, res, next) => {
    try {
      let { search = "", city = "" } = req.query;
      let condition = {};

      if (search) {
        condition.name = new RegExp(search, "i");
      }
      if (city) {
        condition.city = new RegExp(city, "i");
      }

      const hotels = await Hotel.find(condition);

      return res.status(200).json(hotels);
    } catch (error) {
      next(error);
    }
  },

  getHotelById: async (req, res, next) => {
    try {
      const hotel = await Hotel.findById(req.params.id);

      if (!hotel) {
        return res.status(404).json({
          message: "Hotel not found",
        });
      }

      const rooms = await Room.find({ hotelId: hotel._id });

      return res.status(200).json({
        hotel,
        rooms,
      });
    } catch (error) {
      next(error);
    }
  },

  createHotel: async (req, res, next) => {
    try {
      const {
        name,
        address,
        city,
        description,
        imageUrls,
        amenities,
        contactInfo,
      } = req.body;

      const newHotel = new Hotel({
        name,
        address,
        city,
        description,
        imageUrls: imageUrls || [],
        amenities: amenities || [],
        contactInfo: contactInfo || {},
      });

      const savedHotel = await newHotel.save();

      return res.status(201).json({
        message: "Hotel created successfully",
        hotel: savedHotel,
      });
    } catch (error) {
      next(error);
    }
  },

  updateHotel: async (req, res, next) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const hotel = await Hotel.findById(id);
      if (!hotel) {
        return res.status(404).json({
          message: "Hotel not found",
        });
      }

      const updatedHotel = await Hotel.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true }
      );

      return res.status(200).json({
        message: "Hotel updated successfully",
        hotel: updatedHotel,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteHotel: async (req, res, next) => {
    try {
      const { id } = req.params;

      const hotel = await Hotel.findById(id);
      if (!hotel) {
        return res.status(404).json({
          message: "Hotel not found",
        });
      }

      const rooms = await Room.find({ hotelId: id });
      if (rooms.length > 0) {
        return res.status(400).json({
          message: "Cannot delete hotel with rooms. Delete all rooms first.",
        });
      }

      const bookings = await Booking.find({ hotelId: id });
      if (bookings.length > 0) {
        return res.status(400).json({
          message: "Cannot delete hotel with active bookings",
        });
      }

      await Hotel.findByIdAndDelete(id);

      return res.status(200).json({
        message: "Hotel deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  getHotelsByCity: async (req, res, next) => {
    try {
      const { city } = req.params;

      const hotels = await Hotel.find({ city: new RegExp(city, "i") });

      return res.status(200).json(hotels);
    } catch (error) {
      next(error);
    }
  },

  addReview: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { userId, userName, rating, comment } = req.body;

      const hotel = await Hotel.findById(id);
      if (!hotel) {
        return res.status(404).json({
          message: "Hotel not found",
        });
      }

      const review = {
        userId,
        userName,
        rating,
        comment,
        createdAt: new Date(),
      };

      hotel.reviews.push(review);

      const totalRating = hotel.reviews.reduce(
        (sum, item) => sum + item.rating,
        0
      );
      hotel.rating = totalRating / hotel.reviews.length;

      await hotel.save();

      return res.status(200).json({
        message: "Review added successfully",
        hotel,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = hotelCtrl;
