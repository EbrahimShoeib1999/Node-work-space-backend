const express = require("express");
const SupplierController = require("../controllers/supplier-controller");
const {validateRoles,verifyToken} = require("../../../core/verify-token")

const router = express.Router();

// Routes for supplier management
router.post("/",validateRoles(["ADMIN","CASHIER","MANAGER"]), SupplierController.create);
router.get("/",validateRoles(["ADMIN","CASHIER","MANAGER"]), SupplierController.getAll);
router.get("/:id",validateRoles(["ADMIN","CASHIER","MANAGER"]), SupplierController.getById);
router.put("/:id",validateRoles(["ADMIN","CASHIER","MANAGER"]), SupplierController.update);
router.delete("/:id",validateRoles(["ADMIN","CASHIER","MANAGER"]), SupplierController.delete);

module.exports = router;
