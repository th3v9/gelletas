const fs = require('fs').promises;
const path = require('path');
const DATA_PATH = path.join(__dirname, '../data/productos.json');

async function readProductos() {
  const raw = await fs.readFile(DATA_PATH, 'utf8');
  return JSON.parse(raw);
}

async function writeProductos(data) {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function validateProducto(payload) {
  const errors = [];
  if (!payload.nombre || String(payload.nombre).trim() === '') {
    errors.push('nombre vacío');
  }
  if (!payload.categoria || String(payload.categoria).trim() === '') {
    errors.push('categoría vacía');
  }
  if (typeof payload.precio !== 'number' || payload.precio <= 0) {
    errors.push('precio inválido');
  }
  if (!Number.isInteger(payload.stock) || payload.stock < 0) {
    errors.push('stock inválido');
  }
  return errors;
}

exports.getAll = async (req, res) => {
  try {
    const productos = await readProductos();
    res.status(200).json(productos);
  } catch (err) {
    res.status(500).json({ error: 'Error leyendo datos' });
  }
};

exports.getById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const productos = await readProductos();
    const p = productos.find((x) => x.id === id);
    if (!p) return res.status(404).json({ error: 'Producto no encontrado' });
    res.status(200).json(p);
  } catch (err) {
    res.status(500).json({ error: 'Error leyendo datos' });
  }
};

exports.create = async (req, res) => {
  try {
    const payload = req.body;
    const errors = validateProducto(payload);
    if (errors.length) return res.status(400).json({ errors });

    const productos = await readProductos();
    const maxId = productos.reduce((m, it) => (it.id > m ? it.id : m), 0);
    const nuevo = {
      id: maxId + 1,
      nombre: payload.nombre,
      descripcion: payload.descripcion || '',
      categoria: payload.categoria,
      precio: payload.precio,
      stock: payload.stock,
      imagen: payload.imagen || ''
    };
    productos.push(nuevo);
    await writeProductos(productos);
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(500).json({ error: 'Error guardando datos' });
  }
};

exports.update = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const productos = await readProductos();
    const idx = productos.findIndex((x) => x.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Producto no encontrado' });

    const payload = req.body;
    const errors = validateProducto(payload);
    if (errors.length) return res.status(400).json({ errors });

    productos[idx] = {
      id,
      nombre: payload.nombre,
      descripcion: payload.descripcion || productos[idx].descripcion || '',
      categoria: payload.categoria,
      precio: payload.precio,
      stock: payload.stock,
      imagen: payload.imagen || productos[idx].imagen || ''
    };
    await writeProductos(productos);
    res.status(200).json(productos[idx]);
  } catch (err) {
    res.status(500).json({ error: 'Error guardando datos' });
  }
};

exports.remove = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const productos = await readProductos();
    const idx = productos.findIndex((x) => x.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Producto no encontrado' });
    const removed = productos.splice(idx, 1)[0];
    await writeProductos(productos);
    res.status(200).json(removed);
  } catch (err) {
    res.status(500).json({ error: 'Error guardando datos' });
  }
};
