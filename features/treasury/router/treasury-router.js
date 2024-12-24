const express = require('express');
const TreasuryController = require('../controller/treasury-controller');

const router = express.Router();

// Create a new transaction
router.post('/', TreasuryController.createTransaction);

// Make transactions on cash machine
router.post('/cash', TreasuryController.cashMachineTransaction);

// Get the last transaction
router.get('/last', TreasuryController.getLastTransaction);

// Get a transaction by ID
router.get('/:id', TreasuryController.getTransactionById);

// Get all transactions with optional filters
router.get('/', TreasuryController.getAllTransactions);

// Delete a transaction by ID
router.delete('/:id', TreasuryController.deleteTransaction);

module.exports = router;
