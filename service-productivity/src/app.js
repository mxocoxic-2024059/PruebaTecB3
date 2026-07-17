const express = require('express');
const cors = require('cors');
const environment = require('./config/environment');
const { createAuthMiddleware, INVALID_TOKEN } = require('./middleware/auth.middleware');
const {
  getDashboard,
  InvalidTasksTokenError,
  TasksUnavailableError,
} = require('./services/dashboard.service');

const app = express();
const authMiddleware = createAuthMiddleware(environment.jwtSecret);

app.use(cors({ origin: environment.corsOrigins }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'productivity' });
});

app.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const data = await getDashboard(environment.tasksServiceUrl, req.headers.authorization);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    if (error instanceof InvalidTasksTokenError) {
      return res.status(401).json(INVALID_TOKEN);
    }

    if (error instanceof TasksUnavailableError) {
      return res.status(503).json({
        success: false,
        message: 'El servicio de tareas no está disponible',
      });
    }

    return res.status(503).json({
      success: false,
      message: 'El servicio de tareas no está disponible',
    });
  }
});

module.exports = app;
