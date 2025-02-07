const express = require("express");
const router = express.Router();
const HistoryController = require("../controllers/history-controller");
const {validateRoles} = require("../../../core/verify-token");

// Routes for Transaction History
router.get("/",validateRoles(["ADMIN","CASHIER","MANAGER"]), HistoryController.getAll); // Get all transaction histories
// router.post("/", HistoryController.create); // Create a new transaction history
router.delete("/:id",validateRoles(["ADMIN"]), HistoryController.delete); // Delete a transaction history by ID

module.exports = router;
