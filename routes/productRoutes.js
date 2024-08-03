const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
router.get('/getproducts',auth,productController.getAllproducts);
router.post('/addproducts', productController.addProduct);
router.put('/updateproducts/:id', productController.updateProduct);
router.delete('/deleteproducts/:id', productController.deleteProducts);


module.exports = router;