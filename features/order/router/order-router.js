const express = require("express");
const router = express.Router();
const OrderController = require("../controller/order-controller");

// Order routes
router.post("/", OrderController.createOrder); // Create a new order
router.get("/", OrderController.getAllOrders); // Get all orders

router.get("/item", OrderController.findPreparingOrderItems);

router.get("/:id", OrderController.getOrderById); // Get all orders
router.delete("/:id", OrderController.deleteOrder); // Delete a specific order
router.post("/:id/pay", OrderController.payOrder); // Pay for an order
router.get("/client/:clientId", OrderController.getOrdersByClientId); // Get orders by client ID

// Order item routes
router.post("/item", OrderController.addOrderItem); // Add item to a specific order
router.put("/item/:orderItemId", OrderController.markOrderAsReady);
router.delete("/item/:orderItemId", OrderController.removeOrderItem); // Remove item from a specific order

module.exports = router;
