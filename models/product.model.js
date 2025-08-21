/* ORIGINAL: /c:/Noda/express/models/product.model.js
const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');
const pathToFile = path.join(rootDir, 'data', 'products.json');
const nanoid = require('nanoid').nanoid;

const getProductsFromFile = (cb) => {
  fs.readFile(pathToFile, (err, data) => {
    if (err) {
      // If file doesn't exist, return empty array
      if (err.code === 'ENOENT') return cb([]);
      console.error('Error reading products file:', err);
      return cb([]);
    }

    if (!data) return cb([]);

    try {
      cb(JSON.parse(data));
    } catch (parseErr) {
      console.error('Error parsing products JSON:', parseErr);
      cb([]);
    }
  });
};

module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    this.id = nanoid(); // Generate a unique ID for the product
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(pathToFile, JSON.stringify(products), (err) => {
        if (err) {
          console.info('❌ Error writing to products file:', err);
        } else {
          console.info('✅ Product saved successfully!');
        }
      });
    });
  }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      if (product) {
        cb(product);
      } else {
        cb(null);
      }
    });
  }

  static edit(id, title, imageUrl, description, price) {
    getProductsFromFile((products) => {
      const idx = products.findIndex((p) => p && p.id === id);
      if (idx < 0) {
        console.warn('Product to edit not found:', id);
        return;
      }

      // Create a new Product instance for the updated data
      const updatedProduct = new Product(title, imageUrl, description, price);
      updatedProduct.id = id;

      products[idx] = updatedProduct;

      fs.writeFile(pathToFile, JSON.stringify(products), (err) => {
        if (err) {
          console.error('Error updating product:', err);
        } else {
          console.info('Product updated successfully!');
        }
      });
    });
  }

  static deleteById(id) {
    getProductsFromFile((products) => {
      const idx = products.findIndex((p) => p && p.id === id);
      if (idx < 0) {
        console.warn('Product to delete not found:', id);
        return;
      }
      products.splice(idx, 1); // Remove the product from the array
      fs.writeFile(pathToFile, JSON.stringify(products), (err) => {
        if (err) {
          console.error('Error deleting product:', err);
        } else {
          console.info('Product deleted successfully!');
        }
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
};
*/

/* REFACTORED: /c:/Noda/express/models/product.model.refactored.js
   - Uses fs.promises
   - Async/Promise-based API (still small helpers can adapt back to callbacks)
   - Ensures directory/file existence
   - Better error handling and consistent JSON formatting
*/

const path = require('path');
const rootDir = require('../util/path');
const { nanoid } = require('nanoid');
const { readFile, writeFile } = require('../util/fileUtils');
const Cart = require('./cart.model');

const pathToFile = path.join(rootDir, 'data', 'products.json');
class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    // id is assigned on save if missing
  }

  // *Save the product. Returns the saved product (with id).
  async save() {
    if (!this.id) this.id = nanoid();
    const products = await readFile(pathToFile);
    products.push(this);
    await writeFile(pathToFile, products);
    return this;
  }

  // *Fetch all products -> returns Promise<array>
  static async fetchAll() {
    return await readFile(pathToFile);
  }

  // *Find a product by id -> returns Promise<product|null>
  static async findById(id) {
    const products = await readFile(pathToFile);
    return products.find((p) => p && p.id === id) || null;
  }

  // *Edit product fields; returns the updated product or throws if not found
  // *Usage: Product.edit(id, { title, imageUrl, description, price })
  static async edit(id, updates = {}) {
    const products = await readFile(pathToFile);
    const idx = products.findIndex((p) => p && p.id === id);
    if (idx < 0) {
      const err = new Error(`Product with id ${id} not found`);
      err.code = 'NOT_FOUND';
      throw err;
    }

    const existing = products[idx];
    const updated = {
      ...existing,
      ...updates,
      id, // ensure id unchanged
    };

    products[idx] = updated;
    await writeFile(pathToFile, products);
    return updated;
  }

  //*Delete by id; returns deleted product or throws if not found
  static async deleteById(id) {
    const products = await readFile(pathToFile);
    const idx = products.findIndex((p) => p && p.id === id);
    if (idx < 0) {
      const err = new Error(`Product with id ${id} not found`);
      err.code = 'NOT_FOUND';
      throw err;
    }
    const [removed] = products.splice(idx, 1);
    await Cart.removeProductFromCart(id);
    await writeFile(pathToFile, products);
    return removed;
  }
}

module.exports = Product;
