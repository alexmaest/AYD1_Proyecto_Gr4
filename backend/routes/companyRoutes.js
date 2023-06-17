const express = require('express');
const router = express.Router();

const companyController = require('../controllers/companyController');

// Admin
router.get('/', companyController.main);
router.get('/controlPanel/categories', companyController.categories);
router.get('/controlPanel/productsCategories ', companyController.productsCategories);
router.get('/controlPanel/combosCategories', companyController.combosCategories);
router.get('/controlPanel/products/:userEmail', companyController.products);
router.get('/controlPanel/combos/:userEmail', companyController.combos);

router.post('/controlPanel/addProduct', companyController.addProduct);
router.post('/controlPanel/addCategory', companyController.addCategory);
router.post('/controlPanel/addCombo', companyController.addCombo);
router.put('/controlPanel/editProduct', companyController.editProduct);
router.delete('/controlPanel/products/:id', companyController.deleteProduct);
//router.get('/orders', adminController.orders);
//router.get('/reports', adminController.reports);

module.exports = router;