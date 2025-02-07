const express = require("express");
const router = express.Router();
const OrderController = require("../controller/order-controller");
const {validateRoles} = require("../../../core/verify-token");

// Order routes
router.post("/",validateRoles(["ADMIN","CASHIER","MANAGER"]), OrderController.createOrder); // Create a new order
router.get("/",validateRoles(["ADMIN","CASHIER","MANAGER"]), OrderController.getAllOrders); // Get all orders

router.get("/item",validateRoles(["ADMIN","CASHIER","MANAGER","CHIEF"]), OrderController.findPreparingOrderItems);

router.get("/:id",validateRoles(["ADMIN","CASHIER","MANAGER"]), OrderController.getOrderById); // Get all orders
router.delete("/:id",validateRoles(["ADMIN","CASHIER","MANAGER"]), OrderController.deleteOrder); // Delete a specific order
router.post("/:id/pay",validateRoles(["ADMIN","CASHIER","MANAGER"]), OrderController.payOrder); // Pay for an order
router.get("/client/:clientId",validateRoles(["ADMIN","CASHIER","MANAGER"]), OrderController.getOrdersByClientId); // Get orders by client ID

// Order item routes
router.post("/item",validateRoles(["ADMIN","CASHIER","MANAGER","CHIEF"]), OrderController.addOrderItem); // Add item to a specific order
router.put("/item/:orderItemId",validateRoles(["ADMIN","CASHIER","MANAGER","CHIEF"]), OrderController.markOrderAsReady);
router.delete("/item/:orderItemId",validateRoles(["ADMIN","CASHIER","MANAGER","CHIEF"]), OrderController.removeOrderItem); // Remove item from a specific order

module.exports = router;
