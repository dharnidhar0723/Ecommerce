const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const cartController = require('../controllers/cartController');

router.post('/cart/add',auth,cartController.addtocart);
router.get('/cart/get', auth,cartController.getitem);
router.delete('/cart/delete', auth,cartController.deleteproduct);

module.exports = router;