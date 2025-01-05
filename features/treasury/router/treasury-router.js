const express = require('express');
const TreasuryController = require('../controller/treasury-controller');

const router = express.Router();

// Create a new transaction
router.post('/', TreasuryController.createTransaction);

// Get the last transaction
router.get('/info', TreasuryController.getTreasuryInfo);

// Get a transaction by ID
router.get('/:id', TreasuryController.getTransactionById);

// Get all transactions with optional filters
router.get('/', TreasuryController.getAllTransactions);

// Make transactions on cash machine
router.post('/cash', TreasuryController.cashMachineTransaction);



module.exports = router;
