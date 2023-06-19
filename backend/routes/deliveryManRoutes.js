const express = require('express');
const router = express.Router();

const deliveryManController = require('../controllers/deliveryManController');

router.get('/',deliveryManController.main);
router.get('/deliveryManInfoRequest/:correo', deliveryManController.deliveryManInfoRequest);

module.exports = router;