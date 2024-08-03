const ordercontroller = require("../controllers/orderController")
const auth = require('../middleware/auth');
const express = require('express');

const router = express.Router();

router.post("/order",auth, ordercontroller.placeOrder);

router.get("/getorders", auth, ordercontroller.getUserOrders);

module.exports = router;