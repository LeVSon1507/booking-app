const express = require("express");
const router = express.Router();
const reviewCtrl = require("../controllers/reviewCtrl");
const auth = require("../middleware/auth");

router.post("/hotels/:hotelId/reviews", auth, reviewCtrl.addReview);
router.get("/user/reviews", auth, reviewCtrl.getUserReviews);
router.put("/reviews/:reviewId", auth, reviewCtrl.updateReview);
router.delete("/reviews/:reviewId", auth, reviewCtrl.deleteReview);

module.exports = router;
