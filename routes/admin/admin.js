const express = require('express');

const adminController = require('../../controllers/admin.controller');
const router = express.Router();
// Add product
router
  .route('/add-product')
  .get(adminController.getAddProduct)
  .post(adminController.postAddProduct);

// Admin product list
router.get('/products', adminController.getAdminProducts);

// View and edit a single product
router
  .route('/product/:id')
  .get(adminController.getEditProduct)
  .post(adminController.putEditProduct);

// Delete a product
router.post('/delete-product/:id', adminController.deleteProduct);

module.exports = router;
