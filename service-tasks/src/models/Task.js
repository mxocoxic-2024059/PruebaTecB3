const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  prioridad: {
    type: String,
    enum: ['baja', 'media', 'alta'],
    default: 'media'
  },
  estado: {
    type: String,
    enum: ['pendiente', 'en_progreso', 'completada'],
    default: 'pendiente'
  },
  fecha: {
    type: Date
  },
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
