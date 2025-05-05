import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export default class ProductManager {
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

  async getProducts() {
    return await this.readFile();
  }

  async getProductById(id) {
    const products = await this.readFile();
    return products.find(p => p.id === id);
  }

  async addProduct(product) {
    const products = await this.readFile();
    const newProduct = { ...product, id: uuidv4() };
    products.push(newProduct);
    await this.writeFile(products);
    return newProduct;
  }

  async updateProduct(id, updates) {
    const products = await this.readFile();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...updates, id: products[index].id };
    await this.writeFile(products);
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.readFile();
    const filtered = products.filter(p => p.id !== id);
    if (products.length === filtered.length) return null;
    await this.writeFile(filtered);
    return true;
  }
}