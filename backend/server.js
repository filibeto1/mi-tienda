const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://angel-rodriguez-tienda.vercel.app'],
    credentials: true
  }
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tienda')
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error conectando a MongoDB:', err));

// Schema y Model (igual que antes)
const tallaColorSchema = new mongoose.Schema({
  talla: String,
  color: String,
  cantidad: Number
});

const productoSchema = new mongoose.Schema({
  id: String,
  nombre: String,
  marca: String,
  precio: Number,
  stock: Number,
  descripcion: String,
  tallasColores: [tallaColorSchema],
  imagen: String
});

const tipoSchema = new mongoose.Schema({
  id: String,
  nombre: String,
  imagen: String,
  productos: [productoSchema]
}, { timestamps: true });

const Tipo = mongoose.model('Tipo', tipoSchema);

// Socket.io - Broadcast de cambios
io.on('connection', (socket) => {
  console.log('🟢 Cliente conectado:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('🔴 Cliente desconectado:', socket.id);
  });
});

// Función para emitir cambios a todos los clientes
const emitirCambios = () => {
  io.emit('datos-actualizados', { timestamp: Date.now() });
};

// Rutas
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend funcionando correctamente' });
});

app.get('/api/tipos', async (req, res) => {
  try {
    const tipos = await Tipo.find().sort({ createdAt: -1 });
    res.json(tipos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tipos', async (req, res) => {
  try {
    const nuevoTipo = new Tipo(req.body);
    await nuevoTipo.save();
    emitirCambios(); // Notificar a todos los clientes
    res.json(nuevoTipo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/tipos/:id', async (req, res) => {
  try {
    const { nombre, imagen } = req.body;
    const tipo = await Tipo.findOne({ id: req.params.id });
    if (!tipo) return res.status(404).json({ error: 'No encontrado' });
    if (nombre !== undefined) tipo.nombre = nombre;
    if (imagen !== undefined) tipo.imagen = imagen;
    await tipo.save();
    emitirCambios();
    res.json(tipo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/tipos/:id', async (req, res) => {
  try {
    await Tipo.findOneAndDelete({ id: req.params.id });
    emitirCambios();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tipos/:tipoId/productos', async (req, res) => {
  try {
    const tipo = await Tipo.findOne({ id: req.params.tipoId });
    if (!tipo) return res.status(404).json({ error: 'Tipo no encontrado' });
    tipo.productos.push(req.body);
    await tipo.save();
    emitirCambios(); // Notificar a todos los clientes
    res.json(tipo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/tipos/:tipoId/productos/:productoId', async (req, res) => {
  try {
    const tipo = await Tipo.findOne({ id: req.params.tipoId });
    if (!tipo) return res.status(404).json({ error: 'Tipo no encontrado' });
    const index = tipo.productos.findIndex(p => p.id === req.params.productoId);
    if (index === -1) return res.status(404).json({ error: 'Producto no encontrado' });
    tipo.productos[index] = { ...tipo.productos[index].toObject(), ...req.body };
    await tipo.save();
    emitirCambios();
    res.json(tipo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/tipos/:tipoId/productos/:productoId', async (req, res) => {
  try {
    const tipo = await Tipo.findOne({ id: req.params.tipoId });
    if (!tipo) return res.status(404).json({ error: 'Tipo no encontrado' });
    tipo.productos = tipo.productos.filter(p => p.id !== req.params.productoId);
    await tipo.save();
    emitirCambios();
    res.json(tipo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📝 Ruta de prueba: http://localhost:${PORT}/api/test`);
});