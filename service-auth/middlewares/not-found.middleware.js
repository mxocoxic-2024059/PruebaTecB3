const AppError = require('../src/utils/app-error');

function notFoundMiddleware(req, res, next) {
  next(new AppError(`Ruta no encontrada: ${req.method} ${req.originalUrl}`, 404));
}

module.exports = notFoundMiddleware;
