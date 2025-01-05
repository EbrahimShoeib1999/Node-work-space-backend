const express = require("express");
const ClientController = require("../controller/client-controller");

const router = express.Router();

// Define routes for the client resource

// Create a new client
router.post("/", ClientController.create);

// Get all clients
router.get("/", ClientController.getAll);

// Get a specific client by ID
router.get("/:id", ClientController.getById);


router.put("/:id", ClientController.update);

// Delete a client by ID
router.delete("/:id",  ClientController.delete);

module.exports = router;
