const db = require('../config/db');

// GET /api/productos - Listar todos los productos
const listarProductos = async (req, res) => {
  try {
    const [productos] = await db.query(`
      SELECT p.*, c.nombre AS categoria_nombre
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      ORDER BY p.creado_en DESC
    `);
    res.json({ success: true, data: productos });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/productos/:id - Obtener un producto por ID
const obtenerProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const [resultado] = await db.query(`
      SELECT p.*, c.nombre AS categoria_nombre
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.id = ?
    `, [id]);

    if (resultado.length === 0) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado.' });
    }
    res.json({ success: true, data: resultado[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/productos - Crear un nuevo producto
const crearProducto = async (req, res) => {
  const { nombre, descripcion, precio, stock, imagen_url, categoria_id } = req.body;

  if (!nombre || precio === undefined || precio === null) {
    return res.status(400).json({ success: false, error: 'El nombre y el precio son obligatorios.' });
  }

  try {
    const [resultado] = await db.query(
      'INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url, categoria_id) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, descripcion || null, precio, stock || 0, imagen_url || null, categoria_id || null]
    );
    res.status(201).json({ success: true, mensaje: 'Producto creado correctamente.', id: resultado.insertId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// PUT /api/productos/:id - Actualizar un producto
const actualizarProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, stock, imagen_url, categoria_id } = req.body;

  try {
    const [existe] = await db.query('SELECT id FROM productos WHERE id = ?', [id]);
    if (existe.length === 0) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado.' });
    }

    await db.query(
      'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, imagen_url = ?, categoria_id = ? WHERE id = ?',
      [nombre, descripcion, precio, stock, imagen_url, categoria_id, id]
    );
    res.json({ success: true, mensaje: 'Producto actualizado correctamente.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE /api/productos/:id - Eliminar un producto
const eliminarProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const [existe] = await db.query('SELECT id FROM productos WHERE id = ?', [id]);
    if (existe.length === 0) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado.' });
    }

    await db.query('DELETE FROM productos WHERE id = ?', [id]);
    res.json({ success: true, mensaje: 'Producto eliminado correctamente.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { listarProductos, obtenerProducto, crearProducto, actualizarProducto, eliminarProducto };
