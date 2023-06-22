const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// User
router.get('/:id', userController.main);
router.get('/dashboard/categories', userController.categories);


module.exports = router;
