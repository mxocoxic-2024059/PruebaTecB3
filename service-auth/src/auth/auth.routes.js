const { Router } = require('express');
const authController = require('./auth.controller');
const { validateRegister, validateLogin } = require('./auth.validation');

const router = Router();

router.post('/register', validateRegister, authController.register);

router.post('/login', validateLogin, authController.login);

module.exports = router;
