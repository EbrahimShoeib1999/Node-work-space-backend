const express = require('express');
const TreasuryController = require('../controller/treasury-controller');
const {validateRoles,verifyToken} = require("../../../core/verify-token")

const router = express.Router();

// Create a new transaction
router.post('/',validateRoles(["ADMIN","CASHIER","MANAGER"]), TreasuryController.createTransaction);

// Get the last transaction
router.get('/info',validateRoles(["ADMIN","CASHIER","MANAGER"]), TreasuryController.getTreasuryInfo);

// analyze all transactions with optional filters
router.get('/analyze',validateRoles(["ADMIN"]), TreasuryController.analyzeTransaction);

// Get a transaction by ID
router.get('/:id',validateRoles(["ADMIN","CASHIER","MANAGER"]), TreasuryController.getTransactionById);

// Get all transactions with optional filters
router.get('/',validateRoles(["ADMIN","CASHIER","MANAGER"]), TreasuryController.getAllTransactions);

// Make transactions on cash machine
router.post('/cash',validateRoles(["ADMIN",]), TreasuryController.cashMachineTransaction);



module.exports = router;
