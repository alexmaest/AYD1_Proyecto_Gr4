const express = require('express');
const router = express.Router();

const companyController = require('../controllers/companyController');

// Admin
router.get('/', companyController.main);
router.get('/controlPanel/categories', companyController.categories);
router.get('/controlPanel/productsCategories', companyController.productsCategories);
router.get('/controlPanel/combosCategories', companyController.combosCategories);
router.get('/controlPanel/singleProduct/:id', companyController.singleProduct);
router.get('/controlPanel/products/:userEmail', companyController.products);
router.get('/controlPanel/combos/:userEmail', companyController.combos);
router.get('/orders/:id', companyController.orders);

router.post('/controlPanel/addProduct', companyController.addProduct);
router.post('/controlPanel/addCategory', companyController.addCategory);
router.post('/controlPanel/addCombo', companyController.addCombo);

router.put('/orderAccept/:id', companyController.orderAccept);
router.put('/orderReady/:id', companyController.orderReady);
router.put('/controlPanel/editProduct', companyController.editProduct);

router.delete('/controlPanel/products/:id', companyController.deleteProduct);
//router.get('/reports', companyController.reports);

module.exports = router;