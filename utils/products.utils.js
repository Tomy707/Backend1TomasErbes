import fs from 'fs/promises';
const path = './data/products.json';

export async function getProducts() {
  try {
    const data = await fs.readFile(path, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error leyendo productos:', err);
    return [];
  }
}
