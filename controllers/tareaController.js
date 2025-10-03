const Tarea = require('../models/Tarea');

async function listarTareas(req, res) {
  const { realizada } = req.query;
  const filtro = realizada !== undefined ? { realizada: realizada === 'true' } : {};
  const tareas = await Tarea.find(filtro);
  res.json(tareas);
}

async function agregarTarea(req, res) {
  const { descripcion, fecha, realizada, prioridad, etiquetas } = req.body;

  if (!descripcion || descripcion.trim() === '') {
    return res.status(400).json({ error: 'La descripción es obligatoria' });
  }

  if (!fecha || isNaN(Date.parse(fecha))) {
    return res.status(400).json({ error: 'La fecha no es válida' });
  }

  const nuevaTarea = new Tarea({
    descripcion: descripcion.trim(),
    fecha: new Date(fecha),
    realizada: realizada === true,
    prioridad: prioridad || 'media',
    etiquetas: etiquetas || []
  });

  await nuevaTarea.save();
  res.status(201).json({ mensaje: 'Tarea agregada', tarea: nuevaTarea });
}

async function marcarComoRealizada(req, res) {
  const tarea = await Tarea.findByIdAndUpdate(
    req.params.id,
    { realizada: true },
    { new: true }
  );

  if (!tarea) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }

  res.json({ mensaje: 'Tarea marcada como realizada', tarea });
}

async function eliminarTarea(req, res) {
  const tarea = await Tarea.findByIdAndDelete(req.params.id);

  if (!tarea) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }

  res.json({ mensaje: 'Tarea eliminada', tarea });
}

async function editarTarea(req, res) {
  try {
    const { descripcion, fecha, prioridad, etiquetas } = req.body;

    if (!descripcion || descripcion.trim() === '') {
      return res.status(400).json({ error: 'La descripción es obligatoria' });
    }

    if (!fecha || isNaN(Date.parse(fecha))) {
      return res.status(400).json({ error: 'La fecha no es válida' });
    }

    const updateFields = {
      descripcion: descripcion.trim(),
      fecha: new Date(fecha)
    };

    if (prioridad) updateFields.prioridad = prioridad;
    if (etiquetas) updateFields.etiquetas = etiquetas;

    const tarea = await Tarea.findByIdAndUpdate(req.params.id, updateFields, { new: true });

    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.json({ mensaje: 'Tarea actualizada', tarea });
  } catch (err) {
    console.error('❌ Error al editar tarea:', err);
    res.status(500).json({ error: 'Error interno al editar tarea' });
  }
}

module.exports = { listarTareas, agregarTarea, marcarComoRealizada, eliminarTarea, editarTarea
};
  




