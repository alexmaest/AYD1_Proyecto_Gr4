const express = require('express');
const router = express.Router();

const deliveryManController = require('../controllers/deliveryManController');

router.get('/',deliveryManController.main);
router.get('/deliveryManInfoRequest/:correo', deliveryManController.deliveryManInfoRequest);

router.post('/changeLocation', deliveryManController.changeLocation);

module.exports = router;