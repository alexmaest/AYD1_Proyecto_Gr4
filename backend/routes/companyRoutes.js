const express = require('express');
const router = express.Router();

const companyController = require('../controllers/companyController');

// Admin
router.get('/', companyController.main);
router.post('/controlPanel/products', companyController.products);
router.get('/controlPanel/categories', companyController.categories);
//router.get('/controlPanel/combos', companyController.combos);
router.post('/controlPanel/addProduct', companyController.addProduct);
router.post('/controlPanel/addCategory', companyController.addCategory);
router.post('/controlPanel/addCombo', companyController.addCombo);
//router.get('/orders', adminController.orders);
//router.get('/reports', adminController.reports);

module.exports = router;