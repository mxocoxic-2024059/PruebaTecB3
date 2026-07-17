const authService = require('./auth.service');
const apiResponse = require('../utils/api-response');

async function register(req, res, next) {
  try {
    const user = await authService.registerUser(req.body);
    return apiResponse.success(res, {
      statusCode: 201,
      message: 'Usuario registrado correctamente',
      data: { user },
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { user, token } = await authService.loginUser(req.body);
    return apiResponse.success(res, {
      statusCode: 200,
      message: 'Inicio de sesion exitoso',
      data: { user, token },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login,
};
