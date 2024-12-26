const express = require('express');
const InventoryController = require('../controller/inventory-controller');

const router = express.Router();

// Create a new inventory item
router.post('/', InventoryController.createInventoryItem);

// Update inventory stock
router.put('/:inventoryItemId/stock', InventoryController.updateInventoryStock);

// Return inventory stock
router.post('/:inventoryItemId/stock/return', InventoryController.returnInventoryStock);

// Get all inventory items with optional filters
router.get('/', InventoryController.getAllInventoryItems);

// Get a specific inventory item by ID
router.get('/:id', InventoryController.getInventoryItemById);

// Delete an inventory item by ID
router.delete('/:id', InventoryController.deleteInventoryItem);

module.exports = router;
