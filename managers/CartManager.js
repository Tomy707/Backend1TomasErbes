import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export default class CartManager {
  constructor(filePath) {
    this.path = path.resolve(filePath);
  }

  async readFile() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async createCart() {
    const carts = await this.readFile();
    const newCart = { id: uuidv4(), products: [] };
    carts.push(newCart);
    await this.writeFile(carts);
    return newCart;
  }

  async getCartById(cid) {
    const carts = await this.readFile();
    return carts.find(c => c.id === cid);
  }

  async addProductToCart(cid, pid) {
    const carts = await this.readFile();
    const cart = carts.find(c => c.id === cid);
    if (!cart) return null;

    const productInCart = cart.products.find(p => p.product === pid);
    if (productInCart) {
      productInCart.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await this.writeFile(carts);
    return cart;
  }
}