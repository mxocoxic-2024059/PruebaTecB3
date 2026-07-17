function success(res, { statusCode = 200, message = 'OK', data = null }) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

function error(res, { statusCode = 500, message = 'Error interno del servidor', details = null }) {
  return res.status(statusCode).json({
    success: false,
    message,
    details,
  });
}

module.exports = {
  success,
  error,
};
