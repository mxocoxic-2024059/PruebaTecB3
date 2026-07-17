const Joi = require('joi');
const AppError = require('../utils/app-error');

const registerSchema = Joi.object({
  nombre: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'El nombre es obligatorio',
    'string.min': 'El nombre debe tener al menos 2 caracteres',
  }),
  correo: Joi.string().trim().lowercase().email().required().messages({
    'string.email': 'El correo electronico no tiene un formato valido',
    'string.empty': 'El correo electronico es obligatorio',
  }),
  contrasena: Joi.string().min(8).required().messages({
    'string.min': 'La contrasena debe tener al menos 8 caracteres',
    'string.empty': 'La contrasena es obligatoria',
  }),
});

const loginSchema = Joi.object({
  correo: Joi.string().trim().lowercase().email().required().messages({
    'string.email': 'El correo electronico no tiene un formato valido',
    'string.empty': 'El correo electronico es obligatorio',
  }),
  contrasena: Joi.string().required().messages({
    'string.empty': 'La contrasena es obligatoria',
  }),
});

function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((detail) => detail.message);
      return next(new AppError('Error de validacion', 400, details));
    }

    req.body = value;
    return next();
  };
}

module.exports = {
  validateRegister: validate(registerSchema),
  validateLogin: validate(loginSchema),
};
