const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const INVALID_TOKEN_RESPONSE = { mensaje: 'Token inválido o expirado' };

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256']
    });

    const hasValidSubject =
      decoded &&
      typeof decoded === 'object' &&
      typeof decoded.sub === 'string' &&
      mongoose.Types.ObjectId.isValid(decoded.sub) &&
      new mongoose.Types.ObjectId(decoded.sub).toString() === decoded.sub.toLowerCase();

    if (!hasValidSubject) {
      return res.status(401).json(INVALID_TOKEN_RESPONSE);
    }

    req.user = {
      id: decoded.sub,
      correo: decoded.correo,
      nombre: decoded.nombre
    };
    return next();
  } catch (error) {
    return res.status(401).json(INVALID_TOKEN_RESPONSE);
  }
};

module.exports = authMiddleware;
