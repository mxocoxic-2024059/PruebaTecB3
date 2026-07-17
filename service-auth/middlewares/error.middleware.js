const AppError = require('../src/utils/app-error');
const apiResponse = require('../src/utils/api-response');
const environment = require('../configs/environment');

function errorMiddleware(err, req, res, next) {
  if (err instanceof AppError) {
    return apiResponse.error(res, {
      statusCode: err.statusCode,
      message: err.message,
      details: err.details,
    });
  }

  if (err.code === 11000) {
    return apiResponse.error(res, {
      statusCode: 409,
      message: 'Ya existe un usuario registrado con este correo',
    });
  }

  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((e) => e.message);
    return apiResponse.error(res, {
      statusCode: 400,
      message: 'Error de validacion',
      details,
    });
  }

  console.error('[service-auth] Error no controlado:', err);

  return apiResponse.error(res, {
    statusCode: 500,
    message: 'Error interno del servidor',
    details: environment.nodeEnv === 'development' ? err.message : null,
  });
}

module.exports = errorMiddleware;
