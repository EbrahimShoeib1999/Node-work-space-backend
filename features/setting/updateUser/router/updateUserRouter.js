const express = require('express');
const userController = require('../conrtoller/updateUserController');

const router = express.Router();

router.put('/users/:id', userController.updateUser);
router.get('/users/:id', userController.getUserById);

module.exports = router;