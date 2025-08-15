const items = [];

export class Cart {
  constructor() {}

  addProductToCart(product) {
    items.push(product);
    console.info('Product added to cart:', product);
  }

  static getCartItems() {
    return items;
  }
}
