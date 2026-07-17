const Task = require('../models/Task');

const createTask = async (req, res) => {
  try {
    const { titulo, descripcion, prioridad, estado, fecha } = req.body;

    if (!titulo || titulo.trim() === '') {
      return res.status(400).json({ mensaje: 'El título es obligatorio' });
    }

    const prioridadesValidas = ['baja', 'media', 'alta'];
    if (prioridad && !prioridadesValidas.includes(prioridad)) {
      return res.status(400).json({ 
        mensaje: 'Prioridad inválida. Valores permitidos: baja, media, alta' 
      });
    }

    const estadosValidos = ['pendiente', 'en_progreso', 'completada'];
    if (estado && !estadosValidos.includes(estado)) {
      return res.status(400).json({ 
        mensaje: 'Estado inválido. Valores permitidos: pendiente, en_progreso, completada' 
      });
    }

    const nuevaTarea = new Task({
      titulo,
      descripcion,
      prioridad,
      estado,
      fecha,
      usuarioId: req.user.id
    });

    await nuevaTarea.save();

    res.status(201). json(nuevaTarea);
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

const getTasks = async (req, res) => {
  try {
    const tareas = await Task.find({ usuarioId: req.user.id });
    res.status(200).json(tareas);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

module.exports = {
  createTask,
  getTasks
};
