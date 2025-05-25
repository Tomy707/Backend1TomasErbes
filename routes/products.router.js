import { Router } from 'express';
import fs from 'fs/promises';
import crypto from 'crypto';

const router = Router();
const filePath = './data/products.json';

let io;

export function initProductsSocket(_io) {
  io = _io;
}

const getProducts = async () => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const saveProducts = async (products) => {
  await fs.writeFile(filePath, JSON.stringify(products, null, 2));
  if (io) io.emit('updateProducts', products);
};

router.get('/', async (req, res) => {
  const products = await getProducts();
  res.json(products);
});

router.post('/', async (req, res) => {
  const products = await getProducts();
  const newProduct = { id: crypto.randomUUID(), ...req.body };
  products.push(newProduct);
  await saveProducts(products);
  res.status(201).json(newProduct);
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  let products = await getProducts();
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length === products.length) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  await saveProducts(filtered);
  res.sendStatus(204);
});

export default router;
