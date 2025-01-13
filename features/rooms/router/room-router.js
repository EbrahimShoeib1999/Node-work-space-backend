const express = require("express");
const router = express.Router();
const RoomController = require("../controller/room-controller");

router.post("/", RoomController.create);
router.get("/", RoomController.getAll);
router.get("/:id", RoomController.getById);
router.put("/:id", RoomController.update);
router.delete("/:id", RoomController.delete);

module.exports = router;
