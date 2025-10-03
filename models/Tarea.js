const mongoose = require('mongoose');

const tareaSchema = new mongoose.Schema({
  descripcion: { type: String, required: true },
  fecha: { type: Date, required: true },
  realizada: { type: Boolean, default: false },
  prioridad: {type: String, enum: ['alta', 'media', 'baja'], default: 'media'},
  etiquetas: [String]
});

module.exports = mongoose.model('Tarea', tareaSchema);