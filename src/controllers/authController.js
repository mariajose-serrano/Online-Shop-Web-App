const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

// POST /registro - Registrar una nueva usuaria
const registro = async (req, res) => {
  const { nombre, user, pass } = req.body;

  if (!user || !pass) {
    return res.status(400).json({ success: false, error: 'El email (user) y la contraseña (pass) son obligatorios.' });
  }

  try {
    const [existe] = await db.query('SELECT id FROM usuarias WHERE email = ?', [user]);
    if (existe.length > 0) {
      return res.status(409).json({ success: false, error: 'Ya existe una usuaria con ese email.' });
    }

    const hash = await bcrypt.hash(pass, 10);
    const [resultado] = await db.query(
      'INSERT INTO usuarias (email, nombre, password) VALUES (?, ?, ?)',
      [user, nombre || user, hash]
    );

    const token = jwt.sign(
      { id: resultado.insertId, email: user },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /login - Iniciar sesión
const login = async (req, res) => {
  const { user, pass } = req.body;

  if (!user || !pass) {
    return res.status(400).json({ success: false, error: 'El email (user) y la contraseña (pass) son obligatorios.' });
  }

  try {
    const [resultado] = await db.query('SELECT * FROM usuarias WHERE email = ?', [user]);
    if (resultado.length === 0) {
      return res.status(401).json({ success: false, error: 'Credenciales incorrectas.' });
    }

    const usuaria = resultado[0];
    const passwordValida = await bcrypt.compare(pass, usuaria.password);
    if (!passwordValida) {
      return res.status(401).json({ success: false, error: 'Credenciales incorrectas.' });
    }

    const token = jwt.sign(
      { id: usuaria.id, email: usuaria.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { registro, login };
