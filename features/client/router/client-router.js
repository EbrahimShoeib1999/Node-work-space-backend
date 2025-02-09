const express = require("express");
const ClientController = require("../controller/client-controller");
const {validateRoles} = require("../../../core/verify-token");
const {exportClientsToExcel} = require("../utils/client-to-excel");

const router = express.Router();

// Define routes for the client resource
router.get('/export', exportClientsToExcel);

// Create a new client
router.post("/",validateRoles(["ADMIN","CASHIER","MANAGER"]), ClientController.create);

// Get all clients
router.get("/",validateRoles(["ADMIN","CASHIER","MANAGER"]), ClientController.getAll);

router.get("/active",validateRoles(["ADMIN","CASHIER","MANAGER"]), ClientController.getAllActiveClients);

router.get("/active/:id",validateRoles(["ADMIN","CASHIER","MANAGER"]), ClientController.getActiveClientById);

router.post("/active/:id/pay",validateRoles(["ADMIN","CASHIER","MANAGER"]), ClientController.payForActiveClientTimersAndOrders);

// Get a specific client by ID
router.get("/:id",validateRoles(["ADMIN","CASHIER","MANAGER"]), ClientController.getById);

router.put("/:id",validateRoles(["ADMIN","CASHIER","MANAGER"]), ClientController.update);

// Delete a client by ID
router.delete("/:id",validateRoles(["ADMIN","CASHIER","MANAGER"]),  ClientController.delete);

module.exports = router;
