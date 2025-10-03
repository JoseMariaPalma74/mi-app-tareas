// Servidor Node.js 
// integrando html  + api //
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const archivoTareas = path.join(__dirname, 'tareas.json');

// Cargar tareas desde el archivo
let tareas = [];
try {
    const datos = fs.readFileSync(archivoTareas, 'utf-8');
    tareas = JSON.parse(datos);
} catch (error) {
    console.log('No se pudo leer tareas.json, iniciando con array vacio');
    tareas = [];
}

const servidor = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const ruta = parsedUrl.pathname;
  const metodo = req.method;

  // Servir el HTML en la raíz
  if (ruta === '/' && metodo === 'GET') {
    const filePath = path.join(__dirname, 'index.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Error al cargar el HTML');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(data);
      }
    });
  }

  // Obtener tareas (con filtro opcional)
  else if (ruta === '/tarea' && metodo === 'GET') {
    const query = parsedUrl.query;
    let resultado = tareas;

    if (query.realizada !== undefined) {
      const valor = query.realizada === 'true';
      resultado = tareas.filter(t => t.realizada === valor);
    }

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(resultado));
  }

  // Agregar nueva tarea
  else if (ruta === '/tarea' && metodo === 'POST') {
    let cuerpo = '';

    req.on('data', chunk => {
      cuerpo += chunk; // vamos acumulando los trozos

    });

    req.on('end', () => {
      try {
        const nuevaTarea = JSON.parse(cuerpo); // ahora sí, convertimos el texto en objeto
        nuevaTarea.id = tareas.length + 1;
        tareas.push(nuevaTarea); 
        // Guardar en tareas.json
        fs.writeFileSync(archivoTareas, JSON.stringify(tareas, null, 2));

        res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ mensaje: 'Tarea agregada', tarea: nuevaTarea }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'Datos inválidos' }));
      }
    });
  }

  // Ruta no encontrada
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Ruta no encontrada');
  }
});

servidor.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});
