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

router.post('/dashboard/search', userController.search);

module.exports = router;
