const express = require('express');
const router = express.Router();

const deliveryManController = require('../controllers/deliveryManController');

router.get('/',deliveryManController.main);
router.get('/deliveryManInfoRequest/:correo', deliveryManController.deliveryManInfoRequest);
router.get('/orders/:id', deliveryManController.orders);
router.get('/orderPending/:id', deliveryManController.orderPending);
router.get('/qualification/:id', deliveryManController.qualification);
/*router.get('/history/:id', deliveryManController.history);
router.get('/commissions/:id', deliveryManController.commissions);
*/
router.post('/changeLocation', deliveryManController.changeLocation);

router.put('/orderAccept', deliveryManController.orderAccept);
router.put('/orderDelivered/:id', deliveryManController.orderDelivered);

module.exports = router;