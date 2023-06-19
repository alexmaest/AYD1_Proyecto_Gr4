const express = require('express');
const router = express.Router();

const loginController = require('../controllers/loginController');

// Login
router.post('/', loginController.login);

module.exports = router;
