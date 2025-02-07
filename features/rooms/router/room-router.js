const express = require("express");
const router = express.Router();
const RoomController = require("../controller/room-controller");
const {validateRoles} = require("../../../core/verify-token");


router.post("/",validateRoles(["ADMIN","CASHIER","MANAGER"]), RoomController.create);
router.get("/",validateRoles(["ADMIN","CASHIER","MANAGER"]), RoomController.getAll);
router.get("/:id",validateRoles(["ADMIN","CASHIER","MANAGER"]), RoomController.getById);
router.put("/:id",validateRoles(["ADMIN","CASHIER","MANAGER"]), RoomController.update);
router.delete("/:id",validateRoles(["ADMIN","CASHIER","MANAGER"]), RoomController.delete);

module.exports = router;
