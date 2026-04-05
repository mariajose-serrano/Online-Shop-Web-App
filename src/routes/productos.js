const express = require('express');
const router = express.Router();
const {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} = require('../controllers/productosController');
const verificarToken = require('../middleware/auth');

// Rutas públicas (no requieren autenticación)
router.get('/', listarProductos);
router.get('/:id', obtenerProducto);

// Rutas protegidas (requieren token JWT)
router.post('/', verificarToken, crearProducto);
router.put('/:id', verificarToken, actualizarProducto);
router.delete('/:id', verificarToken, eliminarProducto);

module.exports = router;
