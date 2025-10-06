const express = require('express');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3000;

// MongoDB
require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error de conexión:', err));

const rutaTarea = require('./routes/tarea'); 

// Rutas API 
app.use(express.json());
// Middleware de protección básica
app.use((req, res, next) => {
  const clave = req.headers['x-clave-app'];
  if (process.env.APP_SECRET && clave !== process.env.APP_SECRET) {
    return res.status(403).json({ error: 'Acceso no autorizado' });
  }
  next();
});
// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/tarea', rutaTarea); 
// Ruta raíz que sirve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((req, res) => {
  res.status(404).send('Ruta no encontrada');
});

app.use((err, req, res, next) => {
  console.error('❌ Error inesperado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor Express en http://localhost:${PORT}`);
});