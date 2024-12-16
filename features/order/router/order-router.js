const express = require('express');
const OrderController = require("../controller/order-controller");

const router = express.Router();

router.post('/orders', OrderController.createOrder); // Create Order
router.patch('/orders/:id/cancel', OrderController.cancelOrder); // Cancel Order
router.patch('/orders/:id/checkout', OrderController.checkout); // Checkout Order

router.get('/orders/items', OrderController.getOrderItems);
router.post('/orders/:orderId/items', OrderController.addOrderItem); // Add Item to Order
router.put('/orders/items/:orderItemId', OrderController.updateOrderItemQuantity); // Update Order Item Quantity
router.delete('/orders/items/:id', OrderController.deleteOrderItem); // Delete Order Item

module.exports = router;
