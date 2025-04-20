const Hotel = require("../models/hotelModel");
const Booking = require("../models/bookingModel");

const reviewCtrl = {
  addReview: async (req, res, next) => {
    try {
      const { hotelId } = req.params;
      const userId = req.user.id;
      const { rating, comment } = req.body;

      const bookings = await Booking.find({
        userId,
        hotelId,
        status: "completed",
        hasReviewed: false,
      });

      if (bookings.length === 0) {
        return res.status(403).json({
          message: "You can only review hotels you have stayed at",
        });
      }

      const hotel = await Hotel.findById(hotelId);
      if (!hotel) {
        return res.status(404).json({
          message: "Hotel not found",
        });
      }

      const review = {
        userId,
        userName: req.user.name,
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

      await Booking.updateMany(
        { userId, hotelId, status: "completed" },
        { hasReviewed: true }
      );

      return res.status(201).json({
        message: "Review added successfully",
        review,
      });
    } catch (error) {
      next(error);
    }
  },

  getUserReviews: async (req, res, next) => {
    try {
      const userId = req.user.id;

      const hotels = await Hotel.find({
        "reviews.userId": userId,
      });

      const reviews = [];

      hotels.forEach((hotel) => {
        const userReviews = hotel.reviews.filter(
          (review) => review.userId.toString() === userId.toString()
        );

        userReviews.forEach((review) => {
          reviews.push({
            reviewId: review._id,
            hotelId: hotel._id,
            hotelName: hotel.name,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt,
          });
        });
      });

      return res.status(200).json(reviews);
    } catch (error) {
      next(error);
    }
  },

  updateReview: async (req, res, next) => {
    try {
      const { reviewId } = req.params;
      const userId = req.user.id;
      const { rating, comment } = req.body;

      const hotel = await Hotel.findOne({
        "reviews._id": reviewId,
        "reviews.userId": userId,
      });

      if (!hotel) {
        return res.status(404).json({
          message: "Review not found or you don't have permission to update it",
        });
      }

      const reviewIndex = hotel.reviews.findIndex(
        (review) => review._id.toString() === reviewId
      );

      hotel.reviews[reviewIndex].rating = rating;
      hotel.reviews[reviewIndex].comment = comment;
      hotel.reviews[reviewIndex].updatedAt = new Date();

      const totalRating = hotel.reviews.reduce(
        (sum, item) => sum + item.rating,
        0
      );
      hotel.rating = totalRating / hotel.reviews.length;

      await hotel.save();

      return res.status(200).json({
        message: "Review updated successfully",
        review: hotel.reviews[reviewIndex],
      });
    } catch (error) {
      next(error);
    }
  },

  deleteReview: async (req, res, next) => {
    try {
      const { reviewId } = req.params;
      const userId = req.user.id;

      const hotel = await Hotel.findOne({
        "reviews._id": reviewId,
        "reviews.userId": userId,
      });

      if (!hotel) {
        return res.status(404).json({
          message: "Review not found or you don't have permission to delete it",
        });
      }

      const reviewIndex = hotel.reviews.findIndex(
        (review) => review._id.toString() === reviewId
      );

      hotel.reviews.splice(reviewIndex, 1);

      if (hotel.reviews.length > 0) {
        const totalRating = hotel.reviews.reduce(
          (sum, item) => sum + item.rating,
          0
        );
        hotel.rating = totalRating / hotel.reviews.length;
      } else {
        hotel.rating = 0;
      }

      await hotel.save();

      await Booking.updateOne(
        { userId, hotelId: hotel._id, hasReviewed: true },
        { hasReviewed: false }
      );

      return res.status(200).json({
        message: "Review deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = reviewCtrl;
