const express = require("express");
const router = express.Router();
const ReservationController = require("../controller/reservation-controller");

// Create a new reservation
router.post("/", ReservationController.create);

// Get all reservations
router.get("/", ReservationController.getAll);

// Get a reservation by ID
router.get("/:id", ReservationController.getById);

// Pay for a reservation
router.post("/:id/pay", ReservationController.pay);

// Cancel a reservation
router.delete("/:id", ReservationController.cancel);

// Get reservations by client ID
router.get("/client/:clientId", ReservationController.getByClientId);

// Get reservations by room ID
router.get("/room/:roomId", ReservationController.getByRoomId);

module.exports = router;
