const express = require('express');
const router = express.Router();
const orderController = require('./controller');

// Create a new order
router.post('/order', orderController.createOrder);

// Get all orders
router.get('/orders', orderController.getAllOrders);

// Get an order by ID
router.get('/orders/:id', orderController.getOrderById);

// Update an order
router.put('/orders/:id', orderController.updateOrder);

// Delete an order
router.delete('/orders/:id', orderController.deleteOrder);

module.exports = router;