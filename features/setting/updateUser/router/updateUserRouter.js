const express = require('express');
const userController = require('../conrtoller/updateUserController');

const router = express.Router();

router.put('/users/:id', userController.updateUser);

module.exports = router;