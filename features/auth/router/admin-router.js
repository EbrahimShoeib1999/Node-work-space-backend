const express = require("express");
const AdminUserController = require("../controller/admin-controller");
const {validateRoles,verifyToken} = require("../../../core/verify-token")

const router = express.Router();

// Login admin user
router.post("/login", AdminUserController.login);

// Create admin user
router.post("/",validateRoles(["ADMIN"]), AdminUserController.create);

// Get all admin users
router.get("/",validateRoles(["ADMIN"]), AdminUserController.getAll);

// Get admin user by ID
router.get("/:id",verifyToken, AdminUserController.getById);

// Delete admin user
router.delete("/:id",validateRoles(["ADMIN"]), AdminUserController.delete);

// update admin user
router.put("/:id",validateRoles(["ADMIN"]), AdminUserController.update);

router.post("/profile/:id",validateRoles(["ADMIN"]), AdminUserController.changePassword);

router.put("/profile/:id",verifyToken, AdminUserController.updateUserProfile);


module.exports = router;
