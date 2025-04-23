const Review = require("../models/reviewModel");
const Booking = require("../models/bookingModel");
const Hotel = require("../models/hotelModel");
const User = require("../models/userModel");

const updateHotelRating = async (hotelId) => {
  const hotelReviews = await Review.find({ hotel: hotelId });

  if (hotelReviews.length === 0) {
    return await Hotel.findByIdAndUpdate(hotelId, { rating: 0 });
  }

  const totalRating = hotelReviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );
  const averageRating = totalRating / hotelReviews.length;

  return await Hotel.findByIdAndUpdate(hotelId, { rating: averageRating });
};

const reviewCtrl = {
  addReview: async (req, res) => {
    try {
      const { hotelId } = req.params;
      const {
        bookingId,
        roomId,
        rating,
        title,
        userId,
        comment,
        evidenceUrls,
        imageUrls,
      } = req.body;

      if (!bookingId || !rating || !title || !comment) {
        return res
          .status(400)
          .json({ message: "Please provide all required fields" });
      }

      const booking = await Booking.findOne({
        _id: bookingId,
        userId,
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

      const hotel = await Hotel.findById(hotelId);
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }

      const user = await User.findById(userId).select("name avatar");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const newReview = new Review({
        user: userId,
        booking: bookingId,
        hotel: hotelId,
        room: roomId || booking.roomId,
        rating: Number(rating),
        title,
        comment,
        evidenceUrls: evidenceUrls || [],
        imageUrls: imageUrls || [],
      });

      try {
        const savedReview = await newReview.save();

        booking.hasReviewed = true;
        booking.reviewId = savedReview._id;
        await booking.save();

        await updateHotelRating(hotelId);

        res.status(201).json({
          message: "Review added successfully",
          review: savedReview,
        });
      } catch (saveError) {
        if (saveError.code === 11000) {
          return res.status(400).json({
            message: "You have already submitted a review for this booking",
          });
        }

        return res.status(500).json({
          message: "Failed to add review",
          error:
            process.env.NODE_ENV === "development"
              ? saveError.message
              : undefined,
          stack:
            process.env.NODE_ENV === "development"
              ? saveError.stack
              : undefined,
        });
      }
    } catch (err) {
      return res.status(500).json({
        message: "Failed to add review",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  },

  getUserReviews: async (req, res) => {
    try {
      const userId = req.headers.userId;

      const reviews = await Review.find({ user: userId })
        .populate("hotel", "name address city imageUrls")
        .populate("booking", "startDate endDate totalDays")
        .populate("room", "name type")
        .sort("-createdAt");

      res.json(reviews);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  updateReview: async (req, res) => {
    try {
      const { reviewId } = req.params;
      const { rating, title, comment, evidenceUrls, imageUrls } = req.body;

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
      if (imageUrls) review.imageUrls = imageUrls;

      const updatedReview = await review.save();

      await updateHotelRating(review.hotel);

      res.json({
        message: "Review updated successfully",
        review: updatedReview,
      });
    } catch (err) {
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

      const hotelId = review.hotel;

      await Review.findByIdAndDelete(reviewId);

      await Booking.findByIdAndUpdate(review.booking, {
        hasReviewed: false,
        reviewId: null,
      });

      await updateHotelRating(hotelId);

      res.json({ message: "Review deleted successfully" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

module.exports = reviewCtrl;
