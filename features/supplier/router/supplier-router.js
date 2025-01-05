const express = require("express");
const SupplierController = require("../controllers/supplier-controller");

const router = express.Router();

// Routes for supplier management
router.post("/", SupplierController.create);
router.get("/", SupplierController.getAll);
router.get("/:id", SupplierController.getById);
router.put("/:id", SupplierController.update);
router.delete("/:id", SupplierController.delete);

module.exports = router;
