require('dotenv').config();

const environment = {
  port: process.env.PORT || 4001,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/service-auth',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  corsOrigin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
    : '*',
};

if (!environment.jwtSecret) {
  console.warn(
    '[service-auth] JWT_SECRET no esta definido en el .env. Configuralo antes de usar en produccion.'
  );
}

module.exports = environment;
