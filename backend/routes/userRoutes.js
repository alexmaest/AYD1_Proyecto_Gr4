const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// User
router.get('/:id', userController.main);

module.exports = router;
