const User = require('./user.model');
const AppError = require('../utils/app-error');
const { hashPassword, verifyPassword } = require('./password.service');
const { generateToken } = require('./token.service');

async function registerUser({ nombre, correo, contrasena }) {
  const existingUser = await User.findOne({ correo });
  if (existingUser) {
    throw new AppError('Ya existe un usuario registrado con este correo', 409);
  }

  const contrasenaHasheada = await hashPassword(contrasena);

  const user = await User.create({
    nombre,
    correo,
    contrasena: contrasenaHasheada,
  });

  return user;
}

async function loginUser({ correo, contrasena }) {
  const user = await User.findOne({ correo }).select('+contrasena');
  if (!user) {
    throw new AppError('Credenciales invalidas', 401);
  }

  const isPasswordValid = await verifyPassword(user.contrasena, contrasena);
  if (!isPasswordValid) {
    throw new AppError('Credenciales invalidas', 401);
  }

  const token = generateToken({
    sub: user._id.toString(),
    correo: user.correo,
    nombre: user.nombre,
  });

  return { user, token };
}

module.exports = {
  registerUser,
  loginUser,
};
