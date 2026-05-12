const mongoose = require('mongoose');

const tallaColorSchema = new mongoose.Schema({
  talla: { type: String, required: true },
  color: { type: String, required: true },
  cantidad: { type: Number, required: true, default: 0 }
});

const productoSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  marca: { type: String, required: true },
  precio: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  descripcion: { type: String, default: '' },
  tallasColores: [tallaColorSchema],
  imagen: { type: String, default: null }
});

const tipoSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  imagen: { type: String, default: null },
  productos: [productoSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Tipo', tipoSchema);