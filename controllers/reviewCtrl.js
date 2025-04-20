const Review = require("../models/reviewModel");
const Booking = require("../models/bookingModel");
const Hotel = require("../models/hotelModel");
const User = require("../models/userModel");

const reviewCtrl = {
  addReview: async (req, res) => {
    try {
      const { hotelId } = req.params;
      const { bookingId, roomId, rating, title, comment, evidenceUrls } =
        req.body;

      if (!bookingId || !rating || !title || !comment) {
        return res
          .status(400)
          .json({ message: "Please provide all required fields" });
      }

      const booking = await Booking.findOne({
        _id: bookingId,
        userId: req.user.id,
      });

      if (!booking) {
        return res
          .status(404)
          .json({ message: "Booking not found or you don't have permission" });
      }

      if (booking.hasReviewed) {
        return res
          .status(400)
          .json({ message: "You have already reviewed this booking" });
      }

      const newReview = new Review({
        user: req.user.id,
        booking: bookingId,
        hotel: hotelId,
        room: roomId || booking.roomId,
        rating,
        title,
        comment,
        evidenceUrls: evidenceUrls || [],
      });

      const savedReview = await newReview.save();

      booking.hasReviewed = true;
      booking.reviewId = savedReview._id;
      await booking.save();

      const hotelReviews = await Review.find({ hotel: hotelId });
      const totalRating = hotelReviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const averageRating = totalRating / hotelReviews.length;

      const user = await User.findById(req.user.id).select("name avatar");

      const reviewForHotel = {
        _id: savedReview._id,
        user: {
          _id: user._id,
          name: user.name,
          avatar: user.avatar,
        },
        rating: rating,
        title: title,
        comment: comment,
        createdAt: savedReview.createdAt,
      };

      await Hotel.findByIdAndUpdate(hotelId, {
        $set: { rating: averageRating },
        $push: { reviews: reviewForHotel },
      });

      res.status(201).json({
        message: "Review added successfully",
        review: savedReview,
      });
    } catch (err) {
      console.error("Error adding review:", err);
      return res.status(500).json({ message: err.message });
    }
  },

  getUserReviews: async (req, res) => {
    try {
      const reviews = await Review.find({ user: req.user.id })
        .populate("hotel", "name address city imageUrls")
        .populate("booking", "startDate endDate totalDays")
        .populate("room", "name type")
        .sort("-createdAt");

      res.json(reviews);
    } catch (err) {
      console.error("Error getting user reviews:", err);
      return res.status(500).json({ message: err.message });
    }
  },

  updateReview: async (req, res) => {
    try {
      const { reviewId } = req.params;
      const { rating, title, comment, evidenceUrls } = req.body;

      const review = await Review.findOne({
        _id: reviewId,
        user: req.user.id,
      });

      if (!review) {
        return res
          .status(404)
          .json({ message: "Review not found or you don't have permission" });
      }

      if (rating) review.rating = rating;
      if (title) review.title = title;
      if (comment) review.comment = comment;
      if (evidenceUrls) review.evidenceUrls = evidenceUrls;

      const updatedReview = await review.save();

      const hotelReviews = await Review.find({ hotel: review.hotel });
      const totalRating = hotelReviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const averageRating = totalRating / hotelReviews.length;

      const hotel = await Hotel.findById(review.hotel);
      const reviewIndex = hotel.reviews.findIndex(
        (r) => r._id.toString() === reviewId
      );

      if (reviewIndex !== -1) {
        hotel.reviews[reviewIndex].rating = rating || review.rating;
        hotel.reviews[reviewIndex].title = title || review.title;
        hotel.reviews[reviewIndex].comment = comment || review.comment;
        hotel.rating = averageRating;

        await hotel.save();
      }

      res.json({
        message: "Review updated successfully",
        review: updatedReview,
      });
    } catch (err) {
      console.error("Error updating review:", err);
      return res.status(500).json({ message: err.message });
    }
  },

  deleteReview: async (req, res) => {
    try {
      const { reviewId } = req.params;

      const review = await Review.findOne({
        _id: reviewId,
        user: req.user.id,
      });

      if (!review) {
        return res
          .status(404)
          .json({ message: "Review not found or you don't have permission" });
      }

      await Review.findByIdAndDelete(reviewId);

      await Booking.findByIdAndUpdate(review.booking, {
        hasReviewed: false,
        reviewId: null,
      });

      await Hotel.findByIdAndUpdate(review.hotel, {
        $pull: { reviews: { _id: reviewId } },
      });

      const hotelReviews = await Review.find({ hotel: review.hotel });

      if (hotelReviews.length > 0) {
        const totalRating = hotelReviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        const averageRating = totalRating / hotelReviews.length;

        await Hotel.findByIdAndUpdate(review.hotel, { rating: averageRating });
      } else {
        await Hotel.findByIdAndUpdate(review.hotel, { rating: 0 });
      }

      res.json({ message: "Review deleted successfully" });
    } catch (err) {
      console.error("Error deleting review:", err);
      return res.status(500).json({ message: err.message });
    }
  },
};

module.exports = reviewCtrl;
