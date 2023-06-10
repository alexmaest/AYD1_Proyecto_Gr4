const express = require('express');
const router = express.Router();

const loginController = require('../controllers/loginController');

// POST route for login page
router.post('/', loginController.login);

module.exports = router;
