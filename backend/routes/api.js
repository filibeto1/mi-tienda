const express = require('express');
const router = express.Router();
const Tipo = require('../models/Producto');

// Obtener todos los tipos con sus productos
router.get('/tipos', async (req, res) => {
  try {
    const tipos = await Tipo.find().sort({ createdAt: -1 });
    res.json(tipos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un nuevo tipo
router.post('/tipos', async (req, res) => {
  try {
    const { id, nombre, imagen } = req.body;
    const nuevoTipo = new Tipo({ id, nombre, imagen, productos: [] });
    await nuevoTipo.save();
    res.json(nuevoTipo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Editar un tipo
router.put('/tipos/:id', async (req, res) => {
  try {
    const { nombre, imagen } = req.body;
    const tipo = await Tipo.findOne({ id: req.params.id });
    if (!tipo) return res.status(404).json({ error: 'Tipo no encontrado' });
    
    if (nombre !== undefined) tipo.nombre = nombre;
    if (imagen !== undefined) tipo.imagen = imagen;
    
    await tipo.save();
    res.json(tipo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un tipo (y todos sus productos)
router.delete('/tipos/:id', async (req, res) => {
  try {
    await Tipo.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Agregar producto a un tipo
router.post('/tipos/:tipoId/productos', async (req, res) => {
  try {
    const tipo = await Tipo.findOne({ id: req.params.tipoId });
    if (!tipo) return res.status(404).json({ error: 'Tipo no encontrado' });
    
    tipo.productos.push(req.body);
    await tipo.save();
    res.json(tipo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Editar un producto
router.put('/tipos/:tipoId/productos/:productoId', async (req, res) => {
  try {
    const tipo = await Tipo.findOne({ id: req.params.tipoId });
    if (!tipo) return res.status(404).json({ error: 'Tipo no encontrado' });
    
    const productoIndex = tipo.productos.findIndex(p => p.id === req.params.productoId);
    if (productoIndex === -1) return res.status(404).json({ error: 'Producto no encontrado' });
    
    tipo.productos[productoIndex] = { ...tipo.productos[productoIndex].toObject(), ...req.body };
    await tipo.save();
    res.json(tipo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un producto
router.delete('/tipos/:tipoId/productos/:productoId', async (req, res) => {
  try {
    const tipo = await Tipo.findOne({ id: req.params.tipoId });
    if (!tipo) return res.status(404).json({ error: 'Tipo no encontrado' });
    
    tipo.productos = tipo.productos.filter(p => p.id !== req.params.productoId);
    await tipo.save();
    res.json(tipo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;