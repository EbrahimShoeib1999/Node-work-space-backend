const express = require("express");
const AdminUserController = require("../controller/admin-controller");

const router = express.Router();

// Login admin user
router.post("/login", AdminUserController.login);

// Create admin user
router.post("/", AdminUserController.create);

// Get all admin users
router.get("/", AdminUserController.getAll);

// Get admin user by ID
router.get("/:id", AdminUserController.getById);

// Delete admin user
router.delete("/:id", AdminUserController.delete);

// update admin user
router.put("/:id", AdminUserController.update);


module.exports = router;
