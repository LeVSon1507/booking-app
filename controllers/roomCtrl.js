const Room = require("../models/roomModel");

const roomCtrl = {
  getAllRooms: async (req, res, next) => {
    try {
      let { search = "", type = "" } = req.query;
      let condition = {};
      if (search) {
        condition.name = new RegExp(search, "i");
      }
      if (type) {
        condition.type = new RegExp(type, "i");
      }
      let rooms = await Room.find(condition);

      if (type == "all") {
        // tạo biến rỗng
        let filtered = {};
        if (search) {
          filtered.name = new RegExp(search, "i");
        }
        // ?type=all&search=hotel
        rooms = await Room.find(filtered);
      }
      return res.status(200).json(rooms);
    } catch (error) {
      next(error);
    }
  },
  getRoomById: async (req, res, next) => {
    try {
      const room = await Room.findById(req.params.id);
      if (!room)
        return res.status(400).json({
          message: "Not found id room",
        });
      return res.status(200).json(room);
    } catch (error) {
      next(error);
    }
  },
  getManyRoom: async (req, res, next) => {
    try {
      let { search = "" } = req.query;
      let condition = {};
      if (search) {
        condition.name = new RegExp(search, "i");
      }
      const rooms = await Room.find(condition);

      return res.status(200).json(rooms);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = roomCtrl;
