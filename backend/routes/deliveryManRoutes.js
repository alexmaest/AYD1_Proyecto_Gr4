const express = require('express');
const router = express.Router();

const deliveryManController = require('../controllers/deliveryManController');

router.get('/',deliveryManController.main);
// get delivery man personal information
router.get('/deliveryManInfoRequest', deliveryManController.deliveryManInfoRequest);

module.exports = router;