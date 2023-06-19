const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');

// Admin
router.get('/', adminController.main);
router.get('/companyRequests', adminController.companyRequests);
router.get('/deliveryRequests', adminController.deliveryRequests);
router.post('/companyRequests', adminController.companyRequestApprove);
router.post('/deliveryRequests', adminController.deliveryRequestApprove);
router.get('/reports', adminController.reports);

module.exports = router;
