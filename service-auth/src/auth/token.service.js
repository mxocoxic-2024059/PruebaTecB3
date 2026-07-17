const jwt = require('jsonwebtoken');
const environment = require('../../configs/environment');

function generateToken(payload) {
  return jwt.sign(payload, environment.jwtSecret, {
    expiresIn: environment.jwtExpiresIn,
  });
}

function verifyToken(token) {
  return jwt.verify(token, environment.jwtSecret);
}

module.exports = {
  generateToken,
  verifyToken,
};
