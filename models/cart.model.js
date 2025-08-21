const path = require('path');
const catchAsync = require('../util/catchAsync');
const { writeFile, readFile } = require('../util/fileUtils');
const rootDir = require('../util/path');
const BaseModel = require('./base.model');
const items = [];
const pathToFile = path.join(rootDir, 'data', 'cart.json');
// TODO: Implement cart functionality
class Cart {
  addProductToCart = catchAsync(async (product, quantity = 1) => {
    const items = await readFile(pathToFile, 'utf-8');
    const existingProduct = items.find((item) => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += quantity;
      existingProduct.price *= existingProduct.quantity;
      await writeFile(pathToFile, items);
      return;
    }
    items.push({ quantity, ...product });
    await writeFile(pathToFile, items);
    console.info('Product added to cart:', product);
  });

  static async getCartItems() {
    const cartItems = await readFile(pathToFile, 'utf-8');
    return cartItems;
  }

  static async clearCart() {
    await writeFile(pathToFile, []);
    console.info('Cart cleared');
  }

  static async removeProductFromCart(productId) {
    const items = await readFile(pathToFile, 'utf-8');
    const updatedItems = items.filter((item) => item.id !== productId);
    await writeFile(pathToFile, updatedItems);
  }
}

module.exports = Cart;
