const express = require("express");
const router = express.Router();
const HistoryController = require("../controllers/history-controller");

// Routes for Transaction History
router.get("/", HistoryController.getAll); // Get all transaction histories
// router.post("/", HistoryController.create); // Create a new transaction history
router.delete("/:id", HistoryController.delete); // Delete a transaction history by ID

module.exports = router;
