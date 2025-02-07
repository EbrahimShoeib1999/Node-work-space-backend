const express = require("express");
const router = express.Router();
const ReservationController = require("../controller/reservation-controller");
const {validateRoles} = require("../../../core/verify-token");

// Create a new reservation
router.post("/",validateRoles(["ADMIN","CASHIER","MANAGER"]), ReservationController.create);

// Get all reservations
router.get("/",validateRoles(["ADMIN","CASHIER","MANAGER"]), ReservationController.getAll);

// Get a reservation by ID
router.get("/:id",validateRoles(["ADMIN","CASHIER","MANAGER"]), ReservationController.getById);

// Pay for a reservation
router.post("/:id/pay",validateRoles(["ADMIN","CASHIER","MANAGER"]), ReservationController.pay);

// Cancel a reservation
router.delete("/:id",validateRoles(["ADMIN","CASHIER","MANAGER"]), ReservationController.cancel);

// Get reservations by client ID
router.get("/client/:clientId",validateRoles(["ADMIN","CASHIER","MANAGER"]), ReservationController.getByClientId);

// Get reservations by room ID
router.get("/room/:roomId",validateRoles(["ADMIN","CASHIER","MANAGER"]), ReservationController.getByRoomId);

module.exports = router;
