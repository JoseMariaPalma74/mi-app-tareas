const express = require('express');
const router = express.Router();
const { listarTareas, agregarTarea, marcarComoRealizada, eliminarTarea, editarTarea } = require('../controllers/tareaController');

router.get('/', listarTareas);
router.post('/', agregarTarea);
router.put('/:id', marcarComoRealizada); // ← nueva ruta
router.delete('/:id', eliminarTarea); // ← nueva ruta
router.put('/editar/:id', editarTarea);
// const { editarTarea } = require('../controllers/tareaController');


module.exports = router;