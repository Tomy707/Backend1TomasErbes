import express from 'express';
import { createServer } from 'http';
import { Server as SocketIO } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';

import productsRouter, { initProductsSocket } from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import { getProducts } from './utils/products.utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new SocketIO(httpServer);

// handlebars 
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// route vistas
app.get('/', async (req, res) => {
  const products = await getProducts();
  res.render('home', { products });
});

app.get('/realtimeproducts', async (req, res) => {
  const products = await getProducts();
  res.render('realTimeProducts', { products });
});

// websockets
io.on('connection', socket => {
  console.log('Cliente conectado via WebSocket');
});

initProductsSocket(io);

// levantar el servidor
httpServer.listen(8080, () => {
  console.log('Servidor escuchando en puerto 8080');
});
