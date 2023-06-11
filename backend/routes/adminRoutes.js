const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');

// Admin
router.get('/', adminController.main);
router.get('/requests', adminController.requests);
router.get('/reports', adminController.reports);

module.exports = router;
