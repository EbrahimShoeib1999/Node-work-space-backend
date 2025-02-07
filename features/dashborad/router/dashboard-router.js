const express = require("express");
const DashboardController = require("../controller/dashboard-controller");
const {validateRoles} = require("../../../core/verify-token");

const router = express.Router();

// Get all clients
router.get("/",validateRoles(["ADMIN"]), DashboardController.getDashboardData);


module.exports = router;
