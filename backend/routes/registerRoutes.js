const express = require('express');
const router = express.Router();

const registerController = require('../controllers/registerController');

// POST route for register page
router.post('/', registerController.register);

module.exports = router;
