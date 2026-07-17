require('dotenv').config();

const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (!process.env.JWT_SECRET) {
  throw new Error('[service-productivity] JWT_SECRET es obligatorio para iniciar el servicio.');
}

module.exports = {
  port: process.env.PORT || 4003,
  tasksServiceUrl: (process.env.TASKS_SERVICE_URL || 'http://localhost:4002').replace(/\/$/, ''),
  jwtSecret: process.env.JWT_SECRET,
  corsOrigins,
};
