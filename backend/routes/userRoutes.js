const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// User
router.get('/:id', userController.main);
router.get('/dashboard/categories', userController.dashCategories);
router.get('/dashboard/company/:id', userController.company);
router.get('/dashboard/company/products/:id', userController.products);
router.get('/dashboard/company/combos/:id', userController.combos);
router.get('/dashboard/company/categories/:id', userController.categories);
router.get('/dashboard/history/:id', userController.history);
router.get('/dashboard/ordersDelivered/:id', userController.ordersDelivered);

router.put('/dashboard/qualifyDeliveryMan', userController.qualifyDeliveryMan);

router.post('/dashboard/search', userController.search);
router.post('/dashboard/shoppingCart', userController.shoppingCart);

module.exports = router;
