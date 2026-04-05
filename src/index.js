const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const productosRoutes = require('./routes/productos');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares ──────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (frontend)
app.use(express.static(path.join(__dirname, '..', 'public')));

// ── Rutas API ────────────────────────────────────
app.use('/api/productos', productosRoutes);
app.use('/', authRoutes);

// Ruta raíz → devuelve el frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Ruta no encontrada.' });
});

// ── Iniciar servidor ─────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
