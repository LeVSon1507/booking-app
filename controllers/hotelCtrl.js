const Hotel = require("../models/hotelModel");
const Room = require("../models/roomModel");
const Booking = require("../models/bookingModel");
const moment = require("moment");

const hotelCtrl = {
  getAllHotels: async (req, res, next) => {
    try {
      let { search = "", city = "", startDate = "", endDate = "" } = req.query;
      let condition = {};

      if (search) {
        condition.name = new RegExp(search, "i");
      }
      if (city) {
        condition.city = new RegExp(city, "i");
      }

      const hotels = await Hotel.find(condition);

      const hotelsWithReviewInfo = hotels.map((hotel) => {
        const totalReviews = hotel.reviews.length;
        const totalRating = hotel.reviews.reduce(
          (acc, review) => acc + review.rating,
          0
        );
        const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;
        return {
          ...hotel._doc,
          totalReviews,
          averageRating,
        };
      });
      if (!startDate || !endDate) {
        return res.status(200).json(hotels);
      }

      const start = moment(startDate, "DD-MM-YYYY").startOf("day").toDate();
      const end = moment(endDate, "DD-MM-YYYY").endOf("day").toDate();

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({
          message: "Invalid date format. Please use DD-MM-YYYY format",
        });
      }

      if (start >= end) {
        return res.status(400).json({
          message: "Start date must be before end date",
        });
      }

      const bookings = await Booking.find({
        $and: [
          { status: { $ne: "cancelled" } },
          {
            $or: [
              { fromDate: { $gte: start, $lt: end } },
              { toDate: { $gt: start, $lte: end } },
              { fromDate: { $lte: start }, toDate: { $gte: end } },
            ],
          },
        ],
      });

      console.log(`Found ${bookings.length} bookings in the selected period`);

      const bookedRoomIds = bookings.map((booking) =>
        booking.roomId.toString()
      );

      const availableHotels = [];

      for (const hotel of hotels) {
        const hotelRooms = await Room.find({
          hotelId: hotel._id,
          isAvailable: true,
        });

        const availableRooms = hotelRooms.filter(
          (room) => !bookedRoomIds.includes(room._id.toString())
        );

        console.log(
          `Hotel ${hotel.name} has ${availableRooms.length} available rooms out of ${hotelRooms.length} total rooms`
        );

        if (availableRooms.length > 0) {
          const hotelData = hotel.toObject();
          hotelData.availableRoomsCount = availableRooms.length;
          hotelData.availableRooms = availableRooms;
          availableHotels.push(hotelData);
        }
      }

      console.log(
        `Found ${availableHotels.length} hotels with available rooms`
      );

      return res.status(200).json(availableHotels);
    } catch (error) {
      console.error("Error in getAllHotels:", error);
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
