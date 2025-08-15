const router = require('express').Router();
const shopController = require('../../controllers/shop.controller');

// * Shop main
router.get('/', shopController.getIndex);

// * Products
router
  .get('/products', shopController.getProducts)
  .get('/products/:id', shopController.getProductDetails);

// * Cart
router
  .get('/cart', shopController.getCartController)
  .post('/cart/:id', shopController.addToCartController);

// * Checkout & Orders
router
  .get('/checkout', shopController.getCheckoutController)
  .get('/orders', shopController.getOrdersController);

module.exports = router;
