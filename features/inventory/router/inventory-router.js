const express = require('express');
const InventoryController = require('../controller/inventory-controller');
const {validateRoles} = require("../../../core/verify-token");

const router = express.Router();

// Create a new inventory item
router.post('/',validateRoles(["ADMIN","CASHIER","MANAGER"]), InventoryController.createInventoryItem);

// Update inventory stock
router.put('/:inventoryItemId/stock',validateRoles(["ADMIN","CASHIER","MANAGER"]), InventoryController.updateInventoryStock);

// Return inventory stock
router.post('/:inventoryItemId/stock/return',validateRoles(["ADMIN","CASHIER","MANAGER"]), InventoryController.returnInventoryStock);

// Get all inventory items with optional filters
router.get('/',validateRoles(["ADMIN","CASHIER","MANAGER","CHIEF"]), InventoryController.getAllInventoryItems);

// Get a specific inventory item by ID
router.get('/:id',validateRoles(["ADMIN","CASHIER","MANAGER","CHIEF"]), InventoryController.getInventoryItemById);

// Delete an inventory item by ID
router.delete('/:id',validateRoles(["ADMIN","CASHIER","MANAGER"]), InventoryController.deleteInventoryItem);

module.exports = router;
