const express = require("express");
const TimerController = require("../controller/timer-controller");

const router = express.Router();

// Timer routes
router.post("/", TimerController.create);
router.post("/:id/start", TimerController.start);
router.post("/:id/pause", TimerController.pause);
router.post("/:id/end", TimerController.end);
router.post("/:id/pay", TimerController.pay); // Mark timer as paid
router.get("/client/:clientId", TimerController.getTimersByClientId); // Get timers by clientId
router.get("/:id/price", TimerController.calculatePrice);
router.get("/", TimerController.findAll);
router.delete("/:id", TimerController.delete);

module.exports = router;
