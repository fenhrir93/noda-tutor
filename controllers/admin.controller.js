const Product = require('../models/product.model');
const path = require('../util/path');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    cssPath: '/css/product.css',
  });
};

exports.getAdminProducts = (req, res, next) => {
  Product.fetchAll((fetchedProducts) => {
    res.render('admin/products', {
      products: fetchedProducts,
      pageTitle: 'Admin Products',
      cssPath: '/css/products.css',
    });
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, description, price } = req.body;
  const product = new Product(title, imageUrl, description, price);
  product.save();
  res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
  const productId = req.params.id;
  console.log(req.params);
  Product.fetchAll((fetchedProducts) => {
    const product = fetchedProducts.find((p) => p?.id === productId);
    if (!product) {
      return res.status(404).render('404', {
        pageTitle: 'Product Not Found',
      });
    }
    res.render('admin/edit-product', {
      path: `/admin/product/${productId}`,
      product,
      pageTitle: 'Edit Product',
      cssPath: '/css/product.css',
    });
  });
};

exports.putEditProduct = (req, res) => {
  const { title, imageUrl, description, price } = req.body;
  const id = req.params.id; // Get the product ID from the request parameters

  Product.edit(id, title, imageUrl, description, price);
  res.redirect('/');
};

exports.deleteProduct = (req, res) => {
  const productId = req.params.id;
  console.log('Deleting product with ID:', productId);
  Product.deleteById(productId, (err) => {
    if (err) {
      console.error('Error deleting product:', err);
      return res.status(500).render('500', {
        pageTitle: 'Internal Server Error',
      });
    }
  });
  res.redirect('/');
};
