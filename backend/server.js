const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Datos temporales en memoria (sin MongoDB)
let tiposTemp = [];

// Rutas
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend funcionando correctamente' });
});

app.get('/api/tipos', (req, res) => {
  res.json(tiposTemp);
});

app.post('/api/tipos', (req, res) => {
  const nuevoTipo = req.body;
  tiposTemp.push(nuevoTipo);
  res.json(nuevoTipo);
});

app.put('/api/tipos/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, imagen } = req.body;
  const index = tiposTemp.findIndex(t => t.id === id);
  if (index !== -1) {
    tiposTemp[index] = { ...tiposTemp[index], nombre, imagen };
    res.json(tiposTemp[index]);
  } else {
    res.status(404).json({ error: 'No encontrado' });
  }
});

app.delete('/api/tipos/:id', (req, res) => {
  const { id } = req.params;
  tiposTemp = tiposTemp.filter(t => t.id !== id);
  res.json({ success: true });
});

app.post('/api/tipos/:tipoId/productos', (req, res) => {
  const { tipoId } = req.params;
  const producto = req.body;
  const tipoIndex = tiposTemp.findIndex(t => t.id === tipoId);
  if (tipoIndex !== -1) {
    if (!tiposTemp[tipoIndex].productos) tiposTemp[tipoIndex].productos = [];
    tiposTemp[tipoIndex].productos.push(producto);
    res.json(tiposTemp[tipoIndex]);
  } else {
    res.status(404).json({ error: 'Tipo no encontrado' });
  }
});

app.put('/api/tipos/:tipoId/productos/:productoId', (req, res) => {
  const { tipoId, productoId } = req.params;
  const productoActualizado = req.body;
  const tipoIndex = tiposTemp.findIndex(t => t.id === tipoId);
  if (tipoIndex !== -1) {
    const prodIndex = tiposTemp[tipoIndex].productos.findIndex(p => p.id === productoId);
    if (prodIndex !== -1) {
      tiposTemp[tipoIndex].productos[prodIndex] = { ...tiposTemp[tipoIndex].productos[prodIndex], ...productoActualizado };
      res.json(tiposTemp[tipoIndex]);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } else {
    res.status(404).json({ error: 'Tipo no encontrado' });
  }
});

app.delete('/api/tipos/:tipoId/productos/:productoId', (req, res) => {
  const { tipoId, productoId } = req.params;
  const tipoIndex = tiposTemp.findIndex(t => t.id === tipoId);
  if (tipoIndex !== -1) {
    tiposTemp[tipoIndex].productos = tiposTemp[tipoIndex].productos.filter(p => p.id !== productoId);
    res.json(tiposTemp[tipoIndex]);
  } else {
    res.status(404).json({ error: 'Tipo no encontrado' });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📝 Ruta de prueba: http://localhost:${PORT}/api/test`);
});