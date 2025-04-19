const router = require("express").Router();
const roomCtrl = require("../controllers/roomCtrl");

router.get("/rooms", roomCtrl.getAllRooms);

router.get("/room/:id", roomCtrl.getRoomById);

router.get("/rooms/hotel/:hotelId", roomCtrl.getRoomsByHotelId);

module.exports = router;
