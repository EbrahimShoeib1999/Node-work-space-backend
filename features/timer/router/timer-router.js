const express = require("express");
const TimerController = require("../controller/timer-controller");
const {validateRoles,verifyToken} = require("../../../core/verify-token")

const router = express.Router();

// Timer routes
router.post("/",validateRoles(["ADMIN","CASHIER","MANAGER"]), TimerController.create);
router.post("/:id/start",validateRoles(["ADMIN","CASHIER","MANAGER"]), TimerController.start);
router.post("/:id/pause",validateRoles(["ADMIN","CASHIER","MANAGER"]), TimerController.pause);
router.post("/:id/end",validateRoles(["ADMIN","CASHIER","MANAGER"]), TimerController.end);
router.post("/:id/pay",validateRoles(["ADMIN","CASHIER","MANAGER"]), TimerController.pay); // Mark timer as paid
router.get("/client/:clientId",validateRoles(["ADMIN","CASHIER","MANAGER"]), TimerController.getTimersByClientId); // Get timers by clientId
router.get("/:id/price",validateRoles(["ADMIN","CASHIER","MANAGER"]), TimerController.calculatePrice);
router.get("/",validateRoles(["ADMIN","CASHIER","MANAGER"]), TimerController.findAll);
router.delete("/:id",validateRoles(["ADMIN","CASHIER","MANAGER"]), TimerController.delete);

module.exports = router;
