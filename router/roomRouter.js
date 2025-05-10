const router = require("express").Router();
const roomCtrl = require("../controllers/roomCtrl");

router.get("/rooms", roomCtrl.getAllRooms);

router.get("/room/:id", roomCtrl.getRoomById);

router.post("/rooms", roomCtrl.createRoom);

router.get("/rooms/hotel/:hotelId", roomCtrl.getRoomsByHotelId);

router.put("/rooms/:id", roomCtrl.updateRoom);

router.delete("/rooms/:id", roomCtrl.deleteRoom);

module.exports = router;
