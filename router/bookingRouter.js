const router = require("express").Router();
const bookingCtrl = require("../controllers/bookingCtrl");
const auth = require("../middleware/auth");

router.post("/booking", auth, bookingCtrl.createBooking);

router.get("/bookings", auth, bookingCtrl.getAllBooking);

router.get("/booking/:id", auth, bookingCtrl.getBookingById);

router.get("/bookingbyid", auth, bookingCtrl.getBookingByUserId);

router.post("/cancelbooking", auth, bookingCtrl.cancelBooking);

router.delete("/booking/:id",auth, bookingCtrl.deleteBooking);


module.exports = router;
