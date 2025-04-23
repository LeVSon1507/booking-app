const router = require("express").Router();
const hotelCtrl = require("../controllers/hotelCtrl");

router.get("/hotels", hotelCtrl.getAllHotels);

router.get("/hotels/:id", hotelCtrl.getHotelById);

router.get("/hotels/city/:city", hotelCtrl.getHotelsByCity);

router.post("/hotels", hotelCtrl.createHotel);

router.put("/hotels/:id", hotelCtrl.updateHotel);

router.delete("/hotels/:id", hotelCtrl.deleteHotel);

module.exports = router;
