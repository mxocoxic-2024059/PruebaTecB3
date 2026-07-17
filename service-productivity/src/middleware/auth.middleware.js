const jwt = require('jsonwebtoken');

const INVALID_TOKEN = {
  success: false,
  message: 'Token inválido o expirado',
};

function createAuthMiddleware(jwtSecret) {
  return function authMiddleware(req, res, next) {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).json(INVALID_TOKEN);
    }

    const token = authorization.slice('Bearer '.length).trim();

    try {
      const decoded = jwt.verify(token, jwtSecret, { algorithms: ['HS256'] });

      if (!decoded || typeof decoded !== 'object' || typeof decoded.sub !== 'string' || !decoded.sub) {
        return res.status(401).json(INVALID_TOKEN);
      }

      req.user = {
        id: decoded.sub,
        correo: decoded.correo,
        nombre: decoded.nombre,
      };

      return next();
    } catch {
      return res.status(401).json(INVALID_TOKEN);
    }
  };
}

module.exports = {
  createAuthMiddleware,
  INVALID_TOKEN,
};
