const express = require('express');
const router = express.Router();

const companyController = require('../controllers/companyController');

// Admin
router.get('/', companyController.main);
router.get('/controlPanel/products', companyController.products);
router.get('/controlPanel/categories', companyController.categories);
//router.get('/controlPanel/combos', companyController.combos);
//router.get('/controlPanel/addProduct', companyController.addProduct);
router.post('/controlPanel/addCategory', companyController.addCategory);
//router.get('/controlPanel/addCombo', companyController.addCombo);
//router.get('/orders', adminController.orders);
//router.get('/reports', adminController.reports);

module.exports = router;