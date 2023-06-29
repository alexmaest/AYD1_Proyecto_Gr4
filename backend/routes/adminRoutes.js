const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');

// Admin
router.get('/', adminController.main);
router.get('/companyRequests', adminController.companyRequests);
router.get('/deliveryRequests', adminController.deliveryRequests);
router.get('/deliveryChangeLocationRequests', adminController.deliveryChangeLocationRequest);
router.get('/reports', adminController.reports);
router.get('/usersToDisable', adminController.usersToDisable);
router.get('/companyTop5', adminController.companyTop5);
router.get('/deliveryTop5', adminController.deliveryTop5);
router.get('/productsTopGlobal', adminController.productsTopGlobal);

router.put('/userDisabled/:id', adminController.userDisabled);

router.post('/companyRequests', adminController.companyRequestApprove);
router.post('/deliveryRequests', adminController.deliveryRequestApprove);
router.post('/deliveryChangeLocationRequestsApprove', adminController.deliveryChangeLocationRequestApprove);

module.exports = router;
