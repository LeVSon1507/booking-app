const router = require('express').Router()
const roomCtrl = require('../controllers/roomCtrl')

router.get('/rooms', roomCtrl.getAllRooms)

router.get('/room/:id', roomCtrl.getRoomById)


module.exports = router