const { Cart } = require('../models/cart.model');
const Product = require('../models/product.model');
const catchAsync = require('../util/catchAsync');
const path = require('../util/path');

exports.getProducts = catchAsync(async (req, res, next) => {
  const products = await Product.fetchAll();
  res.render('shop/product-list', {
    products,
    path: '/products',
    pageTitle: 'Shop',
    cssPath: '/css/shop.css',
  });
});

exports.getProductDetails = catchAsync(async (req, res, next) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);
  res.render('shop/product-detail', {
    product,
    path: `/products/${productId}`,
    cssPath: '/css/product.css',
  });
});

exports.getIndex = (req, res, next) => {
  res.render('shop/index', {
    pageTitle: 'Home Page',
    shopName: 'My Shop',
    year: new Date().getFullYear(),
    cssPath: '/css/index.css',
  });
};

exports.getCheckoutController = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    cssPath: '/css/checkout.css',
  });
};

exports.getOrdersController = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Your Orders',
    cssPath: '/css/orders.css',
  });
};

exports.getCartController = (req, res, next) => {
  res.render('shop/cart', {
    pageTitle: 'Your Cart',
    cssPath: '/css/cart.css',
    products: Cart.getCartItems(),
  });
};

exports.addToCartController = (req, res, next) => {
  const productId = req.params.id;
  const cart = new Cart();
  Product.findById(productId, (product) => {
    if (!product) {
      console.error('Product not found:', productId);
      return res.status(404).render('404', {
        pageTitle: 'Product Not Found',
      });
    }
    cart.addProductToCart(product);
    res.redirect('/products');
  });
};
