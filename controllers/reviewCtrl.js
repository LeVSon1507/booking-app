const Review = require("../models/reviewModel");
const Booking = require("../models/bookingModel");
const Hotel = require("../models/hotelModel");
const User = require("../models/userModel");

const reviewCtrl = {
  addReview: async (req, res) => {
    try {
      const { hotelId } = req.params;
      const {
        userId,
        bookingId,
        roomId,
        rating,
        title,
        comment,
        evidenceUrls,
      } = req.body;

      console.log("Review request data:", {
        hotelId,
        userId,
        bookingId,
        roomId,
        rating,
        title,
        comment,
      });

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
      });

      console.log("New review object:", newReview);

      try {
        const savedReview = await newReview.save();
        console.log("Review saved successfully:", savedReview);

        booking.hasReviewed = true;
        booking.reviewId = savedReview._id;
        await booking.save();
        console.log("Booking updated with review info");

        const hotelReviews = await Review.find({ hotel: hotelId });
        const totalRating = hotelReviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        const averageRating = totalRating / hotelReviews.length;
        console.log("New average rating:", averageRating);

        const reviewForHotel = {
          userId: user._id,
          userName: user.name,
          rating: Number(rating),
          comment: comment,
          createdAt: savedReview.createdAt,
        };

        if (title) {
          reviewForHotel.title = title;
        }

        await Hotel.findByIdAndUpdate(hotelId, {
          $set: { rating: averageRating },
          $push: { reviews: reviewForHotel },
        });
        console.log("Hotel updated with new review");

        res.status(201).json({
          message: "Review added successfully",
          review: savedReview,
        });
      } catch (saveError) {
        console.error("Error saving review:", saveError);
        if (saveError.code === 11000) {
          return res.status(400).json({
            message: "You have already submitted a review for this booking",
            error: saveError.message,
          });
        }

        console.log("Error saving review:", saveError);
        return res.status(500).json({
          message: "Failed to add review",
          error: saveError.message,
          stack:
            process.env.NODE_ENV === "development"
              ? saveError.stack
              : undefined,
        });
      }
    } catch (err) {
      console.error("Error in addReview:", err);
      return res.status(500).json({
        message: "Failed to add review",
        error: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  },
  getUserReviews: async (req, res) => {
    const { userId } = req.headers;

    try {
      const reviews = await Review.find({ user: userId })
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

      let reviewIndex = -1;

      if (hotel.reviews.length > 0 && hotel.reviews[0].userId) {
        reviewIndex = hotel.reviews.findIndex(
          (r) => r.userId.toString() === req.user.id
        );
      } else {
        reviewIndex = hotel.reviews.findIndex(
          (r) => r._id && r._id.toString() === reviewId
        );
      }

      if (reviewIndex !== -1) {
        if (hotel.reviews[reviewIndex].userId) {
          if (rating) hotel.reviews[reviewIndex].rating = rating;
          if (comment) hotel.reviews[reviewIndex].comment = comment;
          if (title && "title" in hotel.reviews[reviewIndex]) {
            hotel.reviews[reviewIndex].title = title;
          }
        } else {
          if (rating) hotel.reviews[reviewIndex].rating = rating;
          if (title) hotel.reviews[reviewIndex].title = title;
          if (comment) hotel.reviews[reviewIndex].comment = comment;
        }

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

      const hotel = await Hotel.findById(review.hotel);

      if (hotel.reviews.length > 0 && hotel.reviews[0].userId) {
        await Hotel.findByIdAndUpdate(review.hotel, {
          $pull: { reviews: { userId: req.user.id } },
        });
      } else {
        await Hotel.findByIdAndUpdate(review.hotel, {
          $pull: { reviews: { _id: reviewId } },
        });
      }

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
