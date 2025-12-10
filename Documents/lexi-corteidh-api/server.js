// API mínima y determinista para servir jurisprudencia de la Corte IDH.
// Se usa un archivo JSON local para garantizar trazabilidad y evitar
// depender de bases de datos o servicios externos en este prototipo.

import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.join(__dirname, 'data', 'corteidh_casos.json');

// Cargamos los casos a memoria en el arranque para mantener respuestas
// deterministas y evitar I/O en cada solicitud.
let casos = [];
try {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  casos = JSON.parse(raw);
  if (!Array.isArray(casos)) {
    throw new Error('El archivo de datos no contiene un arreglo de casos');
  }
} catch (error) {
  console.error('Error al cargar casos locales:', error.message);
  // No levantamos la API sin datos válidos
  process.exit(1);
}

const app = express();

app.get('/', (_req, res) => {
  res.send('Lexi Corte IDH API OK');
});

app.get('/api/casos/buscar', (req, res) => {
  const {
    pais,
    anio_desde,
    anio_hasta,
    articulos,
    tema,
    texto,
    limite
  } = req.query;

  const limit = Number.isInteger(Number(limite)) && Number(limite) > 0
    ? Number(limite)
    : 5;

  let filtrados = casos.slice();

  if (pais) {
    const paisLower = String(pais).toLowerCase();
    filtrados = filtrados.filter(
      c =>
        Array.isArray(c.paises) &&
        c.paises.some(p => String(p).toLowerCase() === paisLower)
    );
  }

  if (anio_desde) {
    const desde = Number(anio_desde);
    filtrados = filtrados.filter(c => Number(c.anio) >= desde);
  }

  if (anio_hasta) {
    const hasta = Number(anio_hasta);
    filtrados = filtrados.filter(c => Number(c.anio) <= hasta);
  }

  if (articulos) {
    const solicitados = String(articulos)
      .split(',')
      .map(a => a.trim())
      .filter(Boolean);

    filtrados = filtrados.filter(
      c =>
        Array.isArray(c.articulos) &&
        c.articulos.some(a => solicitados.includes(String(a)))
    );
  }

  if (tema) {
    const temaLower = String(tema).toLowerCase();
    filtrados = filtrados.filter(
      c =>
        Array.isArray(c.temas) &&
        c.temas.some(t => String(t).toLowerCase() === temaLower)
    );
  }

  if (texto) {
    const textoLower = String(texto).toLowerCase();
    filtrados = filtrados.filter(c => {
      const campo = `${c.nombre || ''} ${c.resumen || ''}`.toLowerCase();
      return campo.includes(textoLower);
    });
  }

  res.json({ casos: filtrados.slice(0, limit) });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Lexi Corte IDH en puerto ${PORT}`);
});
