require('dotenv').config();

function positiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

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
  tasksRequestTimeoutMs: positiveInteger(process.env.TASKS_REQUEST_TIMEOUT_MS, 5000),
  jwtSecret: process.env.JWT_SECRET,
  corsOrigins,
};
