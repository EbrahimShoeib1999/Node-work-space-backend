const express = require("express");
const DashboardController = require("../controller/dashboard-controller");

const router = express.Router();

// Get all clients
router.get("/", DashboardController.getDashboardData);


module.exports = router;
