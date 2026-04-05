const jwt = require('jsonwebtoken');
require('dotenv').config();

const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ success: false, error: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    const datos = jwt.verify(token, process.env.JWT_SECRET);
    req.usuaria = datos;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, error: 'Token inválido o expirado.' });
  }
};

module.exports = verificarToken;
